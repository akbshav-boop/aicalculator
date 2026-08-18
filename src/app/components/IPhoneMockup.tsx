import React from 'react';

interface IPhoneMockupProps {
  children: React.ReactNode;
}

export default function IPhoneMockup({ children }: IPhoneMockupProps) {
  return (
    <div className="iphone-frame" style={{ flexShrink: 0 }}>
      {/* Side buttons */}
      <div style={{
        position: 'absolute',
        left: -3,
        top: 140,
        width: 3,
        height: 36,
        background: '#2A2A2A',
        borderRadius: '2px 0 0 2px',
      }} />
      <div style={{
        position: 'absolute',
        left: -3,
        top: 192,
        width: 3,
        height: 64,
        background: '#2A2A2A',
        borderRadius: '2px 0 0 2px',
      }} />
      <div style={{
        position: 'absolute',
        left: -3,
        top: 272,
        width: 3,
        height: 64,
        background: '#2A2A2A',
        borderRadius: '2px 0 0 2px',
      }} />
      {/* Power button */}
      <div style={{
        position: 'absolute',
        right: -3,
        top: 200,
        width: 3,
        height: 80,
        background: '#2A2A2A',
        borderRadius: '0 2px 2px 0',
      }} />
      <div className="iphone-inner">
        {children}
      </div>
    </div>
  );
}