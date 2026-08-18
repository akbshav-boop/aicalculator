'use client';

import React from 'react';
import type { Plan } from './CalculatorApp';

interface Props {
  plan: Plan;
  onOpen: () => void;
}

export default function BottomCTA({ plan, onOpen }: Props) {
  if (plan === 'basic') {
    return (
      <div
        style={{
          background: '#11184A',
          borderRadius: 18,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 6px 24px rgba(17,24,74,0.2)',
        }}
      >
        {/* Left */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Открыть</span>
            <span style={{ fontSize: 14, color: '#fff', opacity: 0.9 }}>✦</span>
          </div>
          <div style={{ marginTop: 2 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>
              590 ₽ в месяц • Pro
            </span>
          </div>
        </div>

        {/* Right: open button */}
        <button
          onClick={onOpen}
          style={{
            background: '#F04400',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '9px 18px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            transition: 'transform 120ms ease',
            boxShadow: '0 3px 12px rgba(240,68,0,0.35)',
          }}
          onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.94)'; }}
          onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.94)'; }}
          onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        >
          Открыть
        </button>
      </div>
    );
  }

  // Pro plan CTA → Enterprise
  return (
    <div
      style={{
        background: '#11184A',
        borderRadius: 18,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 6px 24px rgba(17,24,74,0.2)',
        transition: 'all 400ms ease',
      }}
    >
      {/* Left */}
      <div>
        <div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Нужно ещё ÷?</span>
        </div>
        <div style={{ marginTop: 2 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>
            Enterprise • цена по запросу
          </span>
        </div>
      </div>

      {/* Right: contact button */}
      <button
        onClick={onOpen}
        style={{
          background: '#F9F7F0',
          color: '#11184A',
          border: 'none',
          borderRadius: 12,
          padding: '9px 16px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          transition: 'transform 120ms ease',
        }}
        onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.94)'; }}
        onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.94)'; }}
        onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
      >
        Связаться
      </button>
    </div>
  );
}