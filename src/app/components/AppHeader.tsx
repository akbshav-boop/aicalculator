'use client';

import React from 'react';
import type { Plan } from './CalculatorApp';

interface Props {
  plan: Plan;
  darkMode: boolean;
  onToggleDark: () => void;
  demoMode: boolean;
  onToggleDemo: () => void;
}

const planLabels: Record<Plan, string> = {
  basic: 'БАЗОВЫЙ',
  pro: 'PRO',
  enterprise: 'ENTERPRISE',
};

export default function AppHeader({ plan, darkMode, onToggleDark, demoMode, onToggleDemo }: Props) {
  return (
    <div style={{ paddingTop: 4 }}>
      {/* Main header row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: icon + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: '#11184A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontSize: 14, lineHeight: 1, fontWeight: 400 }}>✦</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--foreground)', letterSpacing: -0.2 }}>
            ИИ Калькулятор
          </span>
        </div>

        {/* Right: dark mode toggle + plan badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'var(--secondary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 200ms ease, transform 120ms ease',
              flexShrink: 0,
            }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.88)'; }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.88)'; }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            {darkMode ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* Plan badge */}
          <div
            className={plan === 'pro' || plan === 'enterprise' ? 'plan-badge plan-badge-pro' : 'plan-badge'}
            style={{
              transition: 'background-color 400ms ease, color 400ms ease',
              animation: 'badgePulse 400ms ease',
            }}
          >
            {planLabels[plan]}
          </div>
        </div>
      </div>

      {/* Demo mode toggle row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 6,
        gap: 8,
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 500,
          color: demoMode ? '#F04400' : 'var(--muted-foreground)',
          letterSpacing: '0.05em',
          transition: 'color 250ms ease',
        }}>
          Демо-режим
        </span>
        {/* Toggle switch */}
        <button
          onClick={onToggleDemo}
          title="Демо-режим: 2+2=5"
          style={{
            width: 38,
            height: 22,
            borderRadius: 11,
            background: demoMode ? '#F04400' : 'var(--muted)',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 250ms ease',
            flexShrink: 0,
            padding: 0,
          }}
          onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.92)'; }}
          onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.92)'; }}
          onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        >
          <div style={{
            position: 'absolute',
            top: 3,
            left: demoMode ? 19 : 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 250ms cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          }} />
        </button>
      </div>
    </div>
  );
}