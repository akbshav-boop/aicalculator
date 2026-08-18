'use client';

import React from 'react';

interface Props {
  onClose: () => void;
  onOpenPro: () => void;
}

export default function ProModal({ onClose, onOpenPro }: Props) {
  return (
    <div
      className="fade-in"
      style={{
        background: '#FAFAF8',
        borderRadius: 24,
        padding: '28px 24px',
        width: '100%',
        maxWidth: 320,
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
        fontFamily: 'var(--font-sans)',
        position: 'relative',
        zIndex: 56,
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Icon */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: '#11184A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
      }}>
        <span style={{ fontSize: 20, color: '#fff' }}>×</span>
      </div>

      <div style={{ fontSize: 17, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>
        Умножение — Pro
      </div>
      <div style={{ fontSize: 14, color: '#6A6A62', fontWeight: 400, lineHeight: 1.5, marginBottom: 20 }}>
        Откройте Pro, чтобы использовать умножение и другие расширенные функции.
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            height: 44,
            background: '#F1EFE8',
            color: '#3A3A3A',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Отмена
        </button>
        <button
          onClick={onOpenPro}
          style={{
            flex: 1,
            height: 44,
            background: '#F04400',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 3px 12px rgba(240,68,0,0.3)',
          }}
        >
          Открыть Pro
        </button>
      </div>
    </div>
  );
}