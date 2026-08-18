'use client';

import React from 'react';
import type { Plan } from './CalculatorApp';

interface Props {
  plan: Plan;
}

const planCounts: Record<Plan, number> = {
  basic: 2,
  pro: 3,
  enterprise: 4,
};

export default function OperatorProgress({ plan }: Props) {
  const count = planCounts[plan];
  const total = 4;

  return (
    <div>
      {/* Label row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: '#8A8A82',
          textTransform: 'uppercase',
        }}>
          Операторов открыто
        </span>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#3A3A3A',
          letterSpacing: 0,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {count}/{total}
        </span>
      </div>

      {/* Progress segments */}
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={`progress-seg-${i}`}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i < count ? '#11184A' : '#DDD9CE',
              transition: 'background-color 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}