'use client';

import React, { useRef, useState } from 'react';

interface Props {
  success: boolean;
  onClose?: () => void;
}

export default function FaceIdSheet({ success, onClose }: Props) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (success) return; // don't allow swipe-to-close on success state
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || success) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      setDragY(delta);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 80 && onClose) {
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
        padding: '20px 20px 40px',
        boxShadow: '0 -4px 40px rgba(0,0,0,0.18)',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translateY(${dragY}px)`,
        transition: isDragging ? 'none' : 'transform 350ms cubic-bezier(0.32,0.72,0,1)',
        touchAction: 'none',
      }}
    >
      {/* Handle */}
      <div style={{
        width: 36,
        height: 4,
        background: '#D5D0C8',
        borderRadius: 2,
        marginBottom: 32,
        cursor: success ? 'default' : 'grab',
      }} />

      {/* Face ID or Success */}
      {!success ? (
        <>
          <div className="face-id-ring">
            {/* Face ID SVG icon */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              {/* Eyes */}
              <rect x="10" y="13" width="3" height="5" rx="1.5" fill="#11184A" />
              <rect x="23" y="13" width="3" height="5" rx="1.5" fill="#11184A" />
              {/* Nose */}
              <path d="M18 16v4" stroke="#11184A" strokeWidth="1.8" strokeLinecap="round" />
              {/* Mouth */}
              <path d="M13 23c1.4 2.5 8.6 2.5 10 0" stroke="#11184A" strokeWidth="1.8" strokeLinecap="round" />
              {/* Corner marks */}
              <path d="M6 12V8h4" stroke="#11184A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M30 12V8h-4" stroke="#11184A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 24v4h4" stroke="#11184A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M30 24v4h-4" stroke="#11184A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ marginTop: 16, fontSize: 16, fontWeight: 500, color: '#1A1A1A' }}>
            Face ID
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: '#8A8A82', fontWeight: 400 }}>
            Подтвердите оплату
          </div>
        </>
      ) : (
        <>
          <div
            className="check-pop"
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#55C85A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M9 18l6 6 12-12"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ marginTop: 16, fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>
            Готово
          </div>
        </>
      )}
    </div>
  );
}