'use client';

import React, { useRef, useState } from 'react';

interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

export default function ApplePaySheet({ onConfirm, onClose }: Props) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      setDragY(delta);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 80) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  return (
    <div
      className="sheet-enter"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        background: '#FAFAF8',
        borderRadius: '30px 30px 0 0',
        padding: '16px 0 0 0',
        boxShadow: '0 -4px 40px rgba(0,0,0,0.18)',
        fontFamily: 'var(--font-sans)',
        transform: `translateY(${dragY}px)`,
        transition: isDragging ? 'none' : 'transform 350ms cubic-bezier(0.32,0.72,0,1)',
        touchAction: 'none',
      }}
    >
      {/* Handle bar */}
      <div style={{
        width: 36,
        height: 4,
        background: '#D5D0C8',
        borderRadius: 2,
        margin: '0 auto 16px',
        cursor: 'grab',
      }} />

      {/* Top row: close + Pay logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        marginBottom: 20,
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#ECEAE2',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: '#555',
            fontFamily: 'var(--font-sans)',
          }}
        >
          ×
        </button>

        {/* Pay title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#000" />
            <text x="10" y="14" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              
            </text>
          </svg>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', letterSpacing: -0.3 }}>
            Pay
          </span>
        </div>

        <div style={{ width: 28 }} />
      </div>

      {/* Payment rows */}
      <div style={{ padding: '0 20px' }}>
        {/* Divider */}
        <div style={{ height: 1, background: '#E8E4DA', marginBottom: 0 }} />

        {/* Row: Card */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 0',
          borderBottom: '1px solid #E8E4DA',
        }}>
          <span style={{ fontSize: 15, color: '#3A3A3A', fontWeight: 400 }}>Карта</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#2A6BE0', letterSpacing: 1 }}>VISA</span>
            <span style={{ fontSize: 14, color: '#6A6A62', fontWeight: 400 }}>Дебетовая •••• 4291</span>
            <span style={{ fontSize: 12, color: '#AAAAAA' }}>›</span>
          </div>
        </div>

        {/* Row: Payment */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 0',
          borderBottom: '1px solid #E8E4DA',
        }}>
          <span style={{ fontSize: 15, color: '#3A3A3A', fontWeight: 400 }}>Оплата</span>
          <span style={{ fontSize: 14, color: '#6A6A62', fontWeight: 400 }}>ИИ Калькулятор — Pro</span>
        </div>

        {/* Row: Total */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 0',
        }}>
          <span style={{ fontSize: 15, color: '#3A3A3A', fontWeight: 400 }}>Итого</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', fontVariantNumeric: 'tabular-nums' }}>590 ₽</span>
        </div>

        <div style={{ height: 1, background: '#E8E4DA' }} />
      </div>

      {/* Confirm button */}
      <div style={{ padding: '20px 20px 8px' }}>
        <button
          onClick={onConfirm}
          style={{
            width: '100%',
            height: 54,
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            fontSize: 17,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'transform 120ms ease',
          }}
          onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)'; }}
          onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          onTouchStart={e => { e.stopPropagation(); (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)'; }}
          onTouchEnd={e => { e.stopPropagation(); (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="white" />
            <text x="10" y="14" textAnchor="middle" fill="#000" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              
            </text>
          </svg>
          Дважды нажмите боковую кнопку
        </button>
      </div>

      {/* Footnote */}
      <div style={{ textAlign: 'center', padding: '0 20px 28px' }}>
        <span style={{ fontSize: 11, color: '#AAAA9E', fontWeight: 400 }}>
          ежемесячно • отмена — 1 190 ₽
        </span>
      </div>
    </div>
  );
}