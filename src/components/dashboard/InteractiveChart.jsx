'use client';

import React, { useState } from 'react';

const chartData = [
  { area: 'Área Cível', count: 20, percentage: 42, color: '#2563EB' },
  { area: 'Área Trabalhista', count: 16, percentage: 33, color: '#C5A059' },
  { area: 'Área Tributária', count: 8, percentage: 17, color: '#0F172A' },
  { area: 'Área de Família', count: 3, percentage: 5, color: '#DC2626' },
  { area: 'Outras Áreas', count: 1, percentage: 3, color: '#94A3B8' },
];

export default function InteractiveChart() {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const total = chartData.reduce((acc, curr) => acc + curr.count, 0);

  let cumulativeAngle = 0;
  const radius = 70;
  const strokeWidth = 20;
  const center = 100;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="card-glass-3d">
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Estatísticas
        </span>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, marginTop: '2px' }}>
          Dados sistêmicos
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '32px' }}>
        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
          <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
            {chartData.map((item, index) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativeAngle / 100) * circumference);
              cumulativeAngle += item.percentage;

              const isHovered = hoveredSegment === index;

              return (
                <circle
                  key={item.area}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: 'stroke-width 0.2s ease-out, opacity 0.2s ease-out',
                    opacity: hoveredSegment !== null && !isHovered ? 0.4 : 1,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              );
            })}
          </svg>

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}
          >
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              {hoveredSegment !== null ? chartData[hoveredSegment].count : total}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase' }}>
              {hoveredSegment !== null ? chartData[hoveredSegment].area : 'Total Processos'}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {chartData.map((item, index) => {
            const isHovered = hoveredSegment === index;

            return (
              <div
                key={item.area}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  transition: 'background-color 0.15s ease-out',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.area}</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  {item.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
