'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import IPhoneMockup from './IPhoneMockup';
import CalculatorScreen from './CalculatorScreen';
import type { TapeEntry } from './CalculationTape';

export type Plan = 'basic' | 'pro' | 'enterprise';

export interface AppState {
  plan: Plan;
  displayValue: string;
  expression: string;
  operator: string | null;
  firstOperand: number | null;
  waitingForSecond: boolean;
  justCalculated: boolean;
  freeCalculationsUsed: number;
  freeCalculationLimit: number;
}

const FREE_LIMIT = 2;

const initialState: AppState = {
  plan: 'basic',
  displayValue: '0',
  expression: '',
  operator: null,
  firstOperand: null,
  waitingForSecond: false,
  justCalculated: false,
  freeCalculationsUsed: 0,
  freeCalculationLimit: FREE_LIMIT,
};

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function formatResult(val: number): string {
  if (!isFinite(val)) return isNaN(val) ? 'Ошибка' : val > 0 ? '∞' : '-∞';
  if (Number.isInteger(val)) return String(val);
  const s = parseFloat(val.toFixed(10)).toString();
  return s;
}

export default function CalculatorApp() {
  const [appState, setAppState] = useState<AppState>(initialState);
  const [showApplePay, setShowApplePay] = useState(false);
  const [showFaceId, setShowFaceId] = useState(false);
  const [faceIdSuccess, setFaceIdSuccess] = useState(false);
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showEntLockedModal, setShowEntLockedModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scientificMode, setScientificMode] = useState(false);
  const [memory, setMemory] = useState(0);
  const [tapeEntries, setTapeEntries] = useState<TapeEntry[]>([]);
  const [showTape, setShowTape] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Keep demoMode in a ref so handleButton can read it without stale closure
  const demoModeRef = useRef(demoMode);
  useEffect(() => { demoModeRef.current = demoMode; }, [demoMode]);

  // Load persisted state from localStorage
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('ai_calc_plan') as Plan | null;
      const savedUsed = localStorage.getItem('ai_calc_free_used');
      const savedDark = localStorage.getItem('ai_calc_dark_mode');

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const darkPref = savedDark !== null ? savedDark === 'true' : prefersDark;
      setDarkMode(darkPref);

      if (savedPlan || savedUsed) {
        setAppState(prev => ({
          ...prev,
          plan: savedPlan || 'basic',
          freeCalculationsUsed: savedUsed ? parseInt(savedUsed, 10) : 0,
          freeCalculationLimit: savedPlan === 'pro' || savedPlan === 'enterprise' ? Infinity : FREE_LIMIT,
        }));
      }
    } catch {}
  }, []);

  // Listen for system dark mode changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set preference
      const savedDark = localStorage.getItem('ai_calc_dark_mode');
      if (savedDark === null) {
        setDarkMode(e.matches);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleToggleDark = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      try { localStorage.setItem('ai_calc_dark_mode', String(next)); } catch {}
      return next;
    });
  }, []);

  const handleToggleDemo = useCallback(() => {
    setDemoMode(prev => !prev);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const addTapeEntry = useCallback((expression: string, result: string) => {
    const entry: TapeEntry = {
      id: `${Date.now()}-${Math.random()}`,
      expression,
      result,
      timestamp: new Date(),
    };
    setTapeEntries(prev => [...prev, entry]);
  }, []);

  const persistState = useCallback((plan: Plan, freeUsed: number) => {
    try {
      localStorage.setItem('ai_calc_plan', plan);
      localStorage.setItem('ai_calc_free_used', String(freeUsed));
    } catch {}
  }, []);

  const handleButton = useCallback((btn: string) => {
    // Memory operations
    if (btn === 'MC') { setMemory(0); showToast('Память очищена'); return; }
    if (btn === 'MR') {
      setAppState(prev => ({ ...prev, displayValue: formatResult(memory), justCalculated: false, waitingForSecond: false }));
      return;
    }
    if (btn === 'M+') {
      setAppState(prev => {
        const val = parseFloat(prev.displayValue);
        setMemory(m => m + val);
        return prev;
      });
      return;
    }
    if (btn === 'M-') {
      setAppState(prev => {
        const val = parseFloat(prev.displayValue);
        setMemory(m => m - val);
        return prev;
      });
      return;
    }

    setAppState(prev => {
      const currentVal = parseFloat(prev.displayValue);

      if (btn === 'AC') {
        return { ...prev, displayValue: '0', expression: '', operator: null, firstOperand: null, waitingForSecond: false, justCalculated: false };
      }

      if (btn === '+/-') {
        return { ...prev, displayValue: String(-currentVal) };
      }

      if (btn === '%') {
        return { ...prev, displayValue: formatResult(currentVal / 100) };
      }

      if (btn === ',' || btn === '.') {
        if (prev.displayValue.includes('.')) return prev;
        return { ...prev, displayValue: prev.displayValue + '.', justCalculated: false };
      }

      // Scientific unary operations
      const unaryOps: Record<string, () => number> = {
        sqrt: () => Math.sqrt(currentVal),
        square: () => currentVal * currentVal,
        cube: () => currentVal * currentVal * currentVal,
        cbrt: () => Math.cbrt(currentVal),
        log: () => Math.log10(currentVal),
        ln: () => Math.log(currentVal),
        sin: () => Math.sin(currentVal * Math.PI / 180),
        cos: () => Math.cos(currentVal * Math.PI / 180),
        tan: () => Math.tan(currentVal * Math.PI / 180),
        asin: () => Math.asin(currentVal) * 180 / Math.PI,
        acos: () => Math.acos(currentVal) * 180 / Math.PI,
        atan: () => Math.atan(currentVal) * 180 / Math.PI,
        factorial: () => factorial(currentVal),
        inverse: () => 1 / currentVal,
        pow10: () => Math.pow(10, currentVal),
        exp: () => Math.exp(currentVal),
      };

      if (btn in unaryOps) {
        let result = unaryOps[btn]();
        const resultStr = formatResult(result);
        const expr = `${btn}(${currentVal}) = ${resultStr}`;
        setTimeout(() => addTapeEntry(expr, resultStr), 0);
        return { ...prev, displayValue: resultStr, expression: expr, justCalculated: true };
      }

      if (btn === 'pi') return { ...prev, displayValue: formatResult(Math.PI), justCalculated: true };
      if (btn === 'euler') return { ...prev, displayValue: formatResult(Math.E), justCalculated: true };

      if (['+', '−', '×', '÷'].includes(btn)) {
        return {
          ...prev,
          operator: btn,
          firstOperand: currentVal,
          waitingForSecond: true,
          justCalculated: false,
          expression: '',
        };
      }

      if (btn === '=') {
        if (prev.operator === null || prev.firstOperand === null) return prev;

        // Check free calculation limit — show paywall, preserve expression, do NOT compute
        if (prev.plan === 'basic' && prev.freeCalculationsUsed >= prev.freeCalculationLimit) {
          setTimeout(() => setShowPaywall(true), 0);
          return prev;
        }

        const a = prev.firstOperand;
        const b = currentVal;
        let result = 0;

        if (prev.operator === '+') result = a + b;
        else if (prev.operator === '−') result = a - b;
        else if (prev.operator === '×') result = a * b;
        else if (prev.operator === '÷') result = b !== 0 ? a / b : NaN;

        // Demo mode override: 2 + 2 = 5 (read from ref to avoid stale closure)
        const isDemo2plus2 = demoModeRef.current && a === 2 && prev.operator === '+' && b === 2;
        const displayResult = isDemo2plus2 ? 5 : result;
        const resultStr = formatResult(displayResult);
        const opSymbol = prev.operator;
        const expr = `${a} ${opSymbol} ${b} = ${resultStr}`;

        const newUsed = prev.plan === 'basic'
          ? prev.freeCalculationsUsed + 1
          : prev.freeCalculationsUsed;

        setTimeout(() => {
          addTapeEntry(expr, resultStr);
          persistState(prev.plan, newUsed);
        }, 0);

        return {
          ...prev,
          displayValue: resultStr,
          expression: expr,
          operator: null,
          firstOperand: null,
          waitingForSecond: false,
          justCalculated: true,
          freeCalculationsUsed: newUsed,
        };
      }

      // Number input
      const digit = btn;
      if (prev.waitingForSecond) return { ...prev, displayValue: digit, waitingForSecond: false };
      if (prev.justCalculated) return { ...prev, displayValue: digit, justCalculated: false };
      if (prev.displayValue === '0') return { ...prev, displayValue: digit };
      if (prev.displayValue.length >= 12) return prev;
      return { ...prev, displayValue: prev.displayValue + digit };
    });
  }, [memory, showToast, addTapeEntry, persistState]);

  const handleOperatorTap = useCallback((op: string) => {
    const { plan } = appState;
    if (op === '×') {
      if (plan === 'basic') { setShowProModal(true); return; }
    }
    if (op === '÷') {
      if (plan === 'basic') { setShowEnterpriseModal(true); return; }
      if (plan === 'pro') { setShowEntLockedModal(true); return; }
    }
    handleButton(op);
  }, [appState, handleButton]);

  const handleOpenPro = useCallback(() => {
    setShowPaywall(false);
    setShowApplePay(true);
  }, []);

  const handleApplePayConfirm = useCallback(() => {
    setShowApplePay(false);
    setTimeout(() => {
      setShowFaceId(true);
      setTimeout(() => {
        setFaceIdSuccess(true);
        setTimeout(() => {
          setShowFaceId(false);
          setFaceIdSuccess(false);
          setAppState(prev => {
            const newState = { ...prev, plan: 'pro' as Plan, freeCalculationLimit: Infinity };
            persistState('pro', prev.freeCalculationsUsed);
            return newState;
          });
          showToast('✓ Добро пожаловать в Pro!');
        }, 1200);
      }, 1500);
    }, 200);
  }, [showToast, persistState]);

  const handleApplePayClose = useCallback(() => { setShowApplePay(false); }, []);
  const handleFaceIdClose = useCallback(() => { setShowFaceId(false); setFaceIdSuccess(false); }, []);

  const handleTapeRestore = useCallback((entry: TapeEntry) => {
    setAppState(prev => ({
      ...prev,
      displayValue: entry.result,
      expression: entry.expression,
      operator: null,
      firstOperand: null,
      waitingForSecond: false,
      justCalculated: true,
    }));
    setShowTape(false);
    showToast('Результат восстановлен');
  }, [showToast]);

  const handleTapeDelete = useCallback((id: string) => {
    setTapeEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleTapeClearAll = useCallback(() => {
    setTapeEntries([]);
    showToast('История очищена');
  }, [showToast]);

  const screenContent = (
    <CalculatorScreen
      appState={appState}
      showApplePay={showApplePay}
      showFaceId={showFaceId}
      faceIdSuccess={faceIdSuccess}
      showEnterpriseModal={showEnterpriseModal}
      showProModal={showProModal}
      showEntLockedModal={showEntLockedModal}
      showPaywall={showPaywall}
      toastMessage={toastMessage}
      onButton={handleButton}
      onOperatorTap={handleOperatorTap}
      onOpenPro={handleOpenPro}
      onApplePayConfirm={handleApplePayConfirm}
      onApplePayClose={handleApplePayClose}
      onFaceIdClose={handleFaceIdClose}
      onCloseEnterpriseModal={() => setShowEnterpriseModal(false)}
      onCloseProModal={() => setShowProModal(false)}
      onCloseEntLockedModal={() => setShowEntLockedModal(false)}
      onOpenProFromModal={() => { setShowProModal(false); setShowApplePay(true); }}
      onClosePaywall={() => setShowPaywall(false)}
      scientificMode={scientificMode}
      onToggleScientific={() => setScientificMode(v => !v)}
      memory={memory}
      tapeEntries={tapeEntries}
      showTape={showTape}
      onOpenTape={() => setShowTape(true)}
      onCloseTape={() => setShowTape(false)}
      onTapeRestore={handleTapeRestore}
      onTapeDelete={handleTapeDelete}
      onTapeClearAll={handleTapeClearAll}
      darkMode={darkMode}
      onToggleDark={handleToggleDark}
      demoMode={demoMode}
      onToggleDemo={handleToggleDemo}
    />
  );

  if (isMobile) {
    return (
      <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', background: 'var(--background)', position: 'relative' }}>
        {screenContent}
      </div>
    );
  }

  return (
    <div className={`app-bg-desktop${darkMode ? ' dark-mode' : ''}`}>
      <IPhoneMockup>
        {screenContent}
      </IPhoneMockup>
    </div>
  );
}