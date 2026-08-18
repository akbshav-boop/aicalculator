'use client';

import React from 'react';

interface Props {
  message: string;
}

export default function InlineToast({ message }: Props) {
  return (
    <div
      className="toast-slide"
      style={{
        background: 'rgba(20,20,20,0.88)',
        color: '#fff',
        borderRadius: 12,
        padding: '10px 18px',
        fontSize: 13,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-sans)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      }}
    >
      {message}
    </div>
  );
}