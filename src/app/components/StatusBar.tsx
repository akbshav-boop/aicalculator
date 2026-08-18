'use client';

import React, { useState, useEffect } from 'react';

export default function StatusBar() {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now?.getHours();
      const m = now?.getMinutes()?.toString()?.padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="status-bar" style={{ position: 'relative' }}>
      {/* Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 116,
          height: 32,
          background: '#000',
          borderRadius: 20,
          zIndex: 10,
        }}
      />

      {/* Time */}
      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3, color: '#1A1A1A', zIndex: 11 }}>
        {timeStr}
      </span>

      {/* Right icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, zIndex: 11 }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="7" width="3" height="5" rx="1" fill="#1A1A1A" />
          <rect x="4.5" y="5" width="3" height="7" rx="1" fill="#1A1A1A" />
          <rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#1A1A1A" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#1A1A1A" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5C8.83 9.5 9.5 10.17 9.5 11S8.83 12.5 8 12.5 6.5 11.83 6.5 11 7.17 9.5 8 9.5Z" fill="#1A1A1A" />
          <path d="M4.2 7.3C5.15 6.35 6.5 5.75 8 5.75s2.85.6 3.8 1.55" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M1.5 4.6C3.1 3 5.45 2 8 2s4.9 1 6.5 2.6" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div style={{
            width: 24,
            height: 12,
            border: '1.5px solid #1A1A1A',
            borderRadius: 3,
            padding: '1.5px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <div style={{ width: '80%', height: '100%', background: '#1A1A1A', borderRadius: 1.5 }} />
          </div>
          <div style={{ width: 2, height: 5, background: '#1A1A1A', borderRadius: '0 1px 1px 0' }} />
        </div>
      </div>
    </div>
  );
}