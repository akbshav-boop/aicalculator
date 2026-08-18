'use client';

import React from 'react';
import type { AppState } from './CalculatorApp';
import type { TapeEntry } from './CalculationTape';
import StatusBar from './StatusBar';
import AppHeader from './AppHeader';
import OperatorProgress from './OperatorProgress';
import ResultCard from './ResultCard';
import CalcKeypad from './CalcKeypad';
import BottomCTA from './BottomCTA';
import ApplePaySheet from './ApplePaySheet';
import FaceIdSheet from './FaceIdSheet';
import EnterpriseModal from './EnterpriseModal';
import ProModal from './ProModal';
import EntLockedModal from './EntLockedModal';
import InlineToast from './InlineToast';
import CalculationTape from './CalculationTape';
import PaywallSheet from './PaywallSheet';

interface Props {
  appState: AppState;
  showApplePay: boolean;
  showFaceId: boolean;
  faceIdSuccess: boolean;
  showEnterpriseModal: boolean;
  showProModal: boolean;
  showEntLockedModal: boolean;
  showPaywall: boolean;
  toastMessage: string | null;
  onButton: (btn: string) => void;
  onOperatorTap: (op: string) => void;
  onOpenPro: () => void;
  onApplePayConfirm: () => void;
  onApplePayClose: () => void;
  onFaceIdClose: () => void;
  onCloseEnterpriseModal: () => void;
  onCloseProModal: () => void;
  onCloseEntLockedModal: () => void;
  onOpenProFromModal: () => void;
  onClosePaywall: () => void;
  scientificMode?: boolean;
  onToggleScientific?: () => void;
  memory?: number;
  tapeEntries: TapeEntry[];
  showTape: boolean;
  onOpenTape: () => void;
  onCloseTape: () => void;
  onTapeRestore: (entry: TapeEntry) => void;
  onTapeDelete: (id: string) => void;
  onTapeClearAll: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
  demoMode: boolean;
  onToggleDemo: () => void;
}

export default function CalculatorScreen({
  appState,
  showApplePay,
  showFaceId,
  faceIdSuccess,
  showEnterpriseModal,
  showProModal,
  showEntLockedModal,
  showPaywall,
  toastMessage,
  onButton,
  onOperatorTap,
  onOpenPro,
  onApplePayConfirm,
  onApplePayClose,
  onFaceIdClose,
  onCloseEnterpriseModal,
  onCloseProModal,
  onCloseEntLockedModal,
  onOpenProFromModal,
  onClosePaywall,
  scientificMode,
  onToggleScientific,
  memory,
  tapeEntries,
  showTape,
  onOpenTape,
  onCloseTape,
  onTapeRestore,
  onTapeDelete,
  onTapeClearAll,
  darkMode,
  onToggleDark,
  demoMode,
  onToggleDemo,
}: Props) {
  const isOverlayOpen = showApplePay || showFaceId || showEnterpriseModal || showProModal || showEntLockedModal;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--background)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Status Bar */}
      <StatusBar />

      {/* Main scrollable content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 16px',
          gap: 0,
          filter: isOverlayOpen ? 'blur(1px)' : 'none',
          transition: 'filter 300ms ease',
          pointerEvents: isOverlayOpen ? 'none' : 'auto',
        }}
      >
        {/* Header */}
        <AppHeader
          plan={appState.plan}
          darkMode={darkMode}
          onToggleDark={onToggleDark}
          demoMode={demoMode}
          onToggleDemo={onToggleDemo}
        />

        {/* Progress */}
        <div style={{ marginTop: 14 }}>
          <OperatorProgress plan={appState.plan} />
        </div>

        {/* Result Card + Tape toggle */}
        <div style={{ marginTop: 14, position: 'relative' }}>
          <ResultCard
            displayValue={appState.displayValue}
            expression={appState.expression}
            plan={appState.plan}
            freeUsed={appState.freeCalculationsUsed}
            freeLimit={appState.freeCalculationLimit === Infinity ? 2 : appState.freeCalculationLimit}
            demoMode={demoMode}
          />
          {/* Tape toggle button */}
          <button
            onClick={onOpenTape}
            title="История вычислений"
            style={{
              position: 'absolute',
              top: 10,
              left: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'rgba(17,24,74,0.07)',
              border: 'none',
              borderRadius: 10,
              padding: '5px 9px',
              cursor: 'pointer',
              transition: 'background 150ms ease',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#11184A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#11184A',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.04em',
            }}>
              {tapeEntries.length > 0 ? tapeEntries.length : ''}
            </span>
          </button>
        </div>

        {/* Keypad */}
        <div style={{ marginTop: 14, flex: 1 }}>
          <CalcKeypad
            plan={appState.plan}
            currentOperator={appState.operator}
            onButton={onButton}
            onOperatorTap={onOperatorTap}
            scientificMode={scientificMode}
            onToggleScientific={onToggleScientific}
            memory={memory}
          />
        </div>

        {/* Bottom CTA */}
        <div style={{ paddingBottom: 12, marginTop: 10 }}>
          <BottomCTA plan={appState.plan} onOpen={onOpenPro} />
        </div>

        {/* Home indicator */}
        <div className="home-indicator" />
      </div>

      {/* Overlay backdrop */}
      {isOverlayOpen && (
        <div
          className="overlay-backdrop fade-in"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 40,
          }}
          onClick={() => {
            if (showEnterpriseModal) onCloseEnterpriseModal();
            if (showProModal) onCloseProModal();
            if (showEntLockedModal) onCloseEntLockedModal();
          }}
        />
      )}

      {/* Apple Pay Sheet */}
      {showApplePay && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
          <ApplePaySheet onConfirm={onApplePayConfirm} onClose={onApplePayClose} />
        </div>
      )}

      {/* Face ID Sheet */}
      {showFaceId && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
          <FaceIdSheet success={faceIdSuccess} onClose={onFaceIdClose} />
        </div>
      )}

      {/* Modals */}
      {showEnterpriseModal && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 55, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <EnterpriseModal onClose={onCloseEnterpriseModal} />
        </div>
      )}

      {showProModal && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 55, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <ProModal onClose={onCloseProModal} onOpenPro={onOpenProFromModal} />
        </div>
      )}

      {showEntLockedModal && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 55, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <EntLockedModal onClose={onCloseEntLockedModal} />
        </div>
      )}

      {/* Paywall Sheet */}
      <PaywallSheet
        isOpen={showPaywall}
        freeUsed={appState.freeCalculationsUsed}
        freeLimit={appState.freeCalculationLimit === Infinity ? 2 : appState.freeCalculationLimit}
        onOpenPro={onOpenPro}
        onClose={onClosePaywall}
      />

      {/* Calculation Tape */}
      {showTape && (
        <CalculationTape
          entries={tapeEntries}
          isOpen={showTape}
          onClose={onCloseTape}
          onRestore={onTapeRestore}
          onDelete={onTapeDelete}
          onClearAll={onTapeClearAll}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <InlineToast message={toastMessage} />
      )}
    </div>
  );
}