'use client';

import React, { useState } from 'react';
import { Scale } from 'lucide-react';

const chartData = [
  { area: 'Direito Cível', count: 20, percentage: 42, color: '#3774FF' },
  { area: 'Trabalhista', count: 16, percentage: 33, color: '#000000' },
  { area: 'Empresarial & Tributário', count: 8, percentage: 17, color: '#DBDBDB' },
  { area: 'Família & Sucessões', count: 4, percentage: 8, color: '#F93D4A' },
];

export default function InteractiveChart() {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const total = chartData.reduce((acc, curr) => acc + curr.count, 0);

  let cumulativeAngle = 0;
  const radius = 70;
  const strokeWidth = 22;
  const center = 100;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="card-glass-3d" style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.3rem', fontWeight: 700 }}>
            Distribuição por Área Jurídica
          </h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: '2px' }}>
            Acompanhamento dos processos ativos
          </p>
        </div>
        <Scale size={24} color="#3774FF" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px' }}>
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
                    transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                    opacity: hoveredSegment !== null && !isHovered ? 0.45 : 1,
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
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-montserrat)' }}>
              {hoveredSegment !== null ? chartData[hoveredSegment].count : total}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase' }}>
              {hoveredSegment !== null ? chartData[hoveredSegment].area : 'Total Processos'}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  borderRadius: '10px',
                  backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color, border: item.color === '#FFFFFF' ? '1px solid #000000' : 'none' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.area}</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  {item.count} <span style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 400 }}>({item.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
