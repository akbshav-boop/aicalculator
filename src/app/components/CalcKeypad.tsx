'use client';

import React, { useState, useCallback } from 'react';
import type { Plan } from './CalculatorApp';

interface Props {
  plan: Plan;
  currentOperator: string | null;
  onButton: (btn: string) => void;
  onOperatorTap: (op: string) => void;
  scientificMode?: boolean;
  onToggleScientific?: () => void;
  memory?: number;
}

function vibrate(pattern: number | number[] = 10) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch (_) {}
  }
}

export default function CalcKeypad({ plan, currentOperator, onButton, onOperatorTap, scientificMode, onToggleScientific, memory }: Props) {
  const multiplyUnlocked = plan === 'pro' || plan === 'enterprise';
  const divideUnlocked = plan === 'enterprise';
  const [showInv, setShowInv] = useState(false);

  const press = useCallback((action: () => void) => {
    vibrate(10);
    action();
  }, []);

  type BtnDef = {
    label: string;
    type: 'function' | 'number' | 'operator' | 'equals' | 'sci' | 'mem';
    wide?: boolean;
    action: () => void;
    locked?: boolean;
    lockLabel?: string;
    isActive?: boolean;
    small?: boolean;
  };

  // Scientific rows (shown when scientificMode is true)
  const sciRow1: BtnDef[] = showInv
    ? [
        { label: 'sin⁻¹', type: 'sci', small: true, action: () => press(() => onButton('asin')) },
        { label: 'cos⁻¹', type: 'sci', small: true, action: () => press(() => onButton('acos')) },
        { label: 'tan⁻¹', type: 'sci', small: true, action: () => press(() => onButton('atan')) },
        { label: 'x²', type: 'sci', small: true, action: () => press(() => onButton('square')) },
      ]
    : [
        { label: 'sin', type: 'sci', small: true, action: () => press(() => onButton('sin')) },
        { label: 'cos', type: 'sci', small: true, action: () => press(() => onButton('cos')) },
        { label: 'tan', type: 'sci', small: true, action: () => press(() => onButton('tan')) },
        { label: 'x²', type: 'sci', small: true, action: () => press(() => onButton('square')) },
      ];

  const sciRow2: BtnDef[] = showInv
    ? [
        { label: '10ˣ', type: 'sci', small: true, action: () => press(() => onButton('pow10')) },
        { label: 'eˣ', type: 'sci', small: true, action: () => press(() => onButton('exp')) },
        { label: 'x³', type: 'sci', small: true, action: () => press(() => onButton('cube')) },
        { label: '∛x', type: 'sci', small: true, action: () => press(() => onButton('cbrt')) },
      ]
    : [
        { label: 'log', type: 'sci', small: true, action: () => press(() => onButton('log')) },
        { label: 'ln', type: 'sci', small: true, action: () => press(() => onButton('ln')) },
        { label: 'x³', type: 'sci', small: true, action: () => press(() => onButton('cube')) },
        { label: '√x', type: 'sci', small: true, action: () => press(() => onButton('sqrt')) },
      ];

  const sciRow3: BtnDef[] = [
    { label: showInv ? '2nd↩' : '2nd', type: 'sci', small: true, action: () => { vibrate(10); setShowInv(v => !v); } },
    { label: 'π', type: 'sci', small: true, action: () => press(() => onButton('pi')) },
    { label: 'e', type: 'sci', small: true, action: () => press(() => onButton('euler')) },
    { label: 'n!', type: 'sci', small: true, action: () => press(() => onButton('factorial')) },
  ];

  const memRow: BtnDef[] = [
    { label: 'MC', type: 'mem', small: true, action: () => press(() => onButton('MC')) },
    { label: 'MR', type: 'mem', small: true, action: () => press(() => onButton('MR')) },
    { label: 'M+', type: 'mem', small: true, action: () => press(() => onButton('M+')) },
    { label: 'M−', type: 'mem', small: true, action: () => press(() => onButton('M-')) },
  ];

  // Standard rows
  const rows: BtnDef[][] = [
    [
      { label: 'AC', type: 'function', action: () => press(() => onButton('AC')) },
      { label: '+/-', type: 'function', action: () => press(() => onButton('+/-')) },
      { label: '%', type: 'function', action: () => press(() => onButton('%')) },
      {
        label: '÷',
        type: 'operator',
        locked: !divideUnlocked,
        lockLabel: 'ENT',
        isActive: currentOperator === '÷' && divideUnlocked,
        action: () => { vibrate(10); onOperatorTap('÷'); },
      },
    ],
    [
      { label: '7', type: 'number', action: () => press(() => onButton('7')) },
      { label: '8', type: 'number', action: () => press(() => onButton('8')) },
      { label: '9', type: 'number', action: () => press(() => onButton('9')) },
      {
        label: '×',
        type: 'operator',
        locked: !multiplyUnlocked,
        lockLabel: 'PRO',
        isActive: currentOperator === '×' && multiplyUnlocked,
        action: () => { vibrate(10); onOperatorTap('×'); },
      },
    ],
    [
      { label: '4', type: 'number', action: () => press(() => onButton('4')) },
      { label: '5', type: 'number', action: () => press(() => onButton('5')) },
      { label: '6', type: 'number', action: () => press(() => onButton('6')) },
      {
        label: '−',
        type: 'operator',
        isActive: currentOperator === '−',
        action: () => press(() => onButton('−')),
      },
    ],
    [
      { label: '1', type: 'number', action: () => press(() => onButton('1')) },
      { label: '2', type: 'number', action: () => press(() => onButton('2')) },
      { label: '3', type: 'number', action: () => press(() => onButton('3')) },
      {
        label: '+',
        type: 'operator',
        isActive: currentOperator === '+',
        action: () => press(() => onButton('+')),
      },
    ],
    [
      { label: '0', type: 'number', wide: true, action: () => press(() => onButton('0')) },
      { label: ',', type: 'number', action: () => press(() => onButton(',')) },
      { label: '=', type: 'equals', action: () => press(() => onButton('=')) },
    ],
  ];

  const getButtonStyle = (btn: BtnDef): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 17,
      fontSize: btn.small ? 13 : 22,
      fontWeight: btn.small ? 500 : 400,
      cursor: 'pointer',
      userSelect: 'none',
      position: 'relative',
      border: 'none',
      outline: 'none',
      fontFamily: 'var(--font-sans)',
      transition: 'transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 350ms ease, color 350ms ease',
    };

    if (btn.type === 'equals') {
      return { ...base, background: '#F04400', color: '#fff', boxShadow: '0 4px 16px rgba(240,68,0,0.3)' };
    }
    if (btn.type === 'sci') {
      return { ...base, background: '#E8E6DF', color: '#11184A', boxShadow: '0 2px 8px rgba(40,30,20,0.07)', borderRadius: 12 };
    }
    if (btn.type === 'mem') {
      return { ...base, background: '#DDE8F0', color: '#11184A', boxShadow: '0 2px 8px rgba(17,24,74,0.08)', borderRadius: 12 };
    }
    if (btn.type === 'operator') {
      if (btn.locked) return { ...base, background: '#F1EFE8', color: '#9A9A92', boxShadow: '0 3px 12px rgba(40,30,20,0.06)' };
      if (btn.isActive) return { ...base, background: '#fff', color: '#11184A', boxShadow: '0 4px 16px rgba(17,24,74,0.15)' };
      return { ...base, background: '#11184A', color: '#fff', boxShadow: '0 4px 16px rgba(17,24,74,0.25)' };
    }
    if (btn.type === 'function') {
      return { ...base, background: '#F1EFE8', color: '#3A3A3A', boxShadow: '0 3px 12px rgba(40,30,20,0.07)' };
    }
    return { ...base, background: '#F9F7F0', color: '#2A2A2A', boxShadow: '0 3px 12px rgba(40,30,20,0.07), 0 1px 3px rgba(40,30,20,0.04)' };
  };

  const renderRow = (row: BtnDef[], ri: number, height = 64) => (
    <div key={`row-${ri}`} style={{ display: 'flex', gap: GAP, width: '100%' }}>
      {row.map((btn, bi) => {
        const isWide = btn.wide;
        const style = getButtonStyle(btn);
        return (
          <button
            key={`btn-${ri}-${bi}`}
            onClick={btn.action}
            style={{
              ...style,
              flex: isWide ? 2.15 : 1,
              height,
              justifyContent: isWide ? 'flex-start' : 'center',
              paddingLeft: isWide ? 24 : 0,
            }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.94)'; }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.94)'; }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            {btn.label}
            {btn.locked && btn.lockLabel && (
              <span style={{
                position: 'absolute', top: 6, right: 8, fontSize: 8, fontWeight: 700,
                letterSpacing: '0.04em',
                color: btn.lockLabel === 'ENT' ? '#C9A84C' : '#8B7355',
                pointerEvents: 'none', lineHeight: 1,
              }}>
                {btn.lockLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const GAP = 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, width: '100%' }}>
      {/* Scientific toggle button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -4 }}>
        <button
          onClick={() => { vibrate(10); onToggleScientific?.(); }}
          style={{
            background: scientificMode ? '#11184A' : '#E8E6DF',
            color: scientificMode ? '#fff' : '#11184A',
            border: 'none', borderRadius: 10, padding: '4px 12px',
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
            letterSpacing: '0.04em', fontFamily: 'var(--font-sans)',
            transition: 'background 300ms ease, color 300ms ease',
          }}
        >
          {scientificMode ? 'BASIC' : 'SCI'}
        </button>
      </div>

      {/* Scientific rows */}
      {scientificMode && (
        <>
          {renderRow(memRow, -3, 44)}
          {renderRow(sciRow3, -2, 44)}
          {renderRow(sciRow2, -1, 44)}
          {renderRow(sciRow1, 0, 44)}
        </>
      )}

      {/* Standard rows */}
      {rows.map((row, ri) => renderRow(row, ri + 10))}
    </div>
  );
}