'use client';

import React from 'react';

interface Props {
  onClose: () => void;
}

export default function EnterpriseModal({ onClose }: Props) {
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
        background: '#F1EFE8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
      }}>
        <span style={{ fontSize: 22, color: '#C9A84C' }}>÷</span>
      </div>

      <div style={{ fontSize: 17, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>
        Enterprise
      </div>
      <div style={{ fontSize: 14, color: '#6A6A62', fontWeight: 400, lineHeight: 1.5, marginBottom: 20 }}>
        Эта функция доступна в тарифе Enterprise. Оставьте заявку, и мы свяжемся с вами.
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
          Закрыть
        </button>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            height: 44,
            background: '#11184A',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Связаться
        </button>
      </div>
    </div>
  );
}