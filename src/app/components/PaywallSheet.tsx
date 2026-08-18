'use client';

import React, { useRef, useState, useCallback } from 'react';

interface Props {
  isOpen: boolean;
  freeUsed: number;
  freeLimit: number;
  onOpenPro: () => void;
  onClose: () => void;
}

const benefits = [
  { icon: '∞', text: 'Безлимитные вычисления' },
  { icon: '×', text: 'Открывает умножение' },
  { icon: '✦', text: 'Все возможности Pro' },
  { icon: '◎', text: 'Без повторных ограничений' },
];

export default function PaywallSheet({ isOpen, freeUsed, freeLimit, onOpenPro, onClose }: Props) {
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  const handleHandleTouchStart = useCallback((e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  }, []);

  const handleHandleTouchMove = useCallback((e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - startYRef.current;
    if (dy > 0) setTranslateY(dy);
  }, []);

  const handleHandleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (translateY > 80) {
      onClose();
    }
    setTranslateY(0);
  }, [translateY, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 48,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
        }}
      />

      {/* Sheet */}
      <div
        className="paywall-sheet"
        style={{
          transform: isOpen
            ? `translateY(${translateY}px)`
            : 'translateY(100%)',
          transition: isDragging ? 'none' : 'transform 420ms cubic-bezier(0.32,0.72,0,1)',
          willChange: 'transform',
        }}
      >
        {/* Drag handle */}
        <div
          onTouchStart={handleHandleTouchStart}
          onTouchMove={handleHandleTouchMove}
          onTouchEnd={handleHandleTouchEnd}
          style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center', cursor: 'grab' }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(128,128,128,0.3)' }} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 18,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(128,128,128,0.15)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--muted-foreground)',
            fontSize: 14,
            fontFamily: 'var(--font-sans)',
          }}
        >
          ✕
        </button>

        <div style={{ padding: '8px 24px 32px', fontFamily: 'var(--font-sans)' }}>
          {/* Icon */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: '#11184A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 24, color: '#fff' }}>✦</span>
          </div>

          {/* Title */}
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--foreground)', marginBottom: 6, letterSpacing: -0.3 }}>
            Бесплатные вычисления закончились
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.5, marginBottom: 4 }}>
            Вы использовали {freeUsed} из {freeLimit} бесплатных вычислений.
          </div>
          <div style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.5, marginBottom: 22 }}>
            Оформите Pro и продолжайте вычислять без ограничений.
          </div>

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(17,24,74,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: '#11184A',
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {b.icon}
                </div>
                <span style={{ fontSize: 14, color: 'var(--foreground)', fontWeight: 400 }}>{b.text}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div style={{
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--muted-foreground)',
            marginBottom: 14,
          }}>
            590 ₽ / месяц
          </div>

          {/* CTA button */}
          <button
            onClick={onOpenPro}
            style={{
              width: '100%',
              height: 52,
              background: '#F04400',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              fontSize: 17,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 4px 16px rgba(240,68,0,0.35)',
              transition: 'transform 120ms ease',
              marginBottom: 12,
            }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            Открыть Pro
          </button>

          {/* Later button */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              height: 44,
              background: 'transparent',
              color: 'var(--muted-foreground)',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Позже
          </button>
        </div>
      </div>
    </>
  );
}
