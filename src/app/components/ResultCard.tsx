'use client';

import React from 'react';
import type { Plan } from './CalculatorApp';

interface Props {
  displayValue: string;
  expression: string;
  plan: Plan;
  freeUsed?: number;
  freeLimit?: number;
  demoMode?: boolean;
}

export default function ResultCard({ displayValue, expression, plan, freeUsed = 0, freeLimit = 2, demoMode = false }: Props) {
  const remaining = freeLimit - freeUsed;

  let statusText = '';
  if (plan === 'basic') {
    if (freeUsed === 0) {
      statusText = `БАЗОВЫЙ ТАРИФ • ${freeLimit} БЕСПЛАТНЫХ ВЫЧИСЛЕНИЯ`;
    } else if (remaining > 0) {
      statusText = `БАЗОВЫЙ ТАРИФ • ОСТАЛОСЬ: ${remaining}`;
    } else {
      statusText = 'БАЗОВЫЙ ТАРИФ • ОСТАЛОСЬ: 0';
    }
  } else if (plan === 'pro') {
    statusText = 'ТАРИФ PRO • БЕЗЛИМИТНЫЕ ВЫЧИСЛЕНИЯ';
  } else {
    statusText = 'ТАРИФ ENTERPRISE • ВСЕ ОПЕРАТОРЫ';
  }

  return (
    <div
      className="result-card"
      style={{
        width: '100%',
        minHeight: 128,
        padding: '14px 20px 14px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      {/* DEMO badge */}
      {demoMode && (
        <div style={{
          position: 'absolute',
          top: 12,
          right: 14,
          background: '#F04400',
          color: '#fff',
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: '0.1em',
          padding: '3px 7px',
          borderRadius: 6,
          lineHeight: 1.2,
          zIndex: 2,
        }}>
          DEMO
        </div>
      )}

      {/* Top: expression (right-aligned) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: 18, paddingRight: demoMode ? 52 : 0 }}>
        {expression && (
          <span style={{
            fontSize: 11,
            color: 'var(--muted-foreground)',
            fontWeight: 400,
            letterSpacing: 0.2,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {expression}
          </span>
        )}
      </div>

      {/* Middle: big number (right-aligned) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <span
          className="result-number"
          style={{
            color: demoMode ? '#F04400' : 'var(--foreground)',
            transition: 'color 200ms ease',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {displayValue}
        </span>
      </div>

      {/* Bottom: plan status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
        <div style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: demoMode ? '#F04400' : (plan === 'basic' && remaining === 0 ? '#F04400' : '#55C85A'),
          flexShrink: 0,
          transition: 'background 400ms ease',
        }} />
        <span style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: '0.07em',
          color: demoMode ? '#F04400' : 'var(--muted-foreground)',
          textTransform: 'uppercase',
          transition: 'all 400ms ease',
        }}>
          {demoMode ? 'ДЕМО-РЕЖИМ • 2 + 2 = 5' : statusText}
        </span>
      </div>
    </div>
  );
}