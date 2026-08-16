'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const months = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
];

export default function MonthCalendar() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(7);
  const [currentYear] = useState(2026);

  const prevMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const nextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
  };

  const weekHeaders = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const daysGrid = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, 31, 1, 2, 3, 4]
  ];

  return (
    <div className="card-glass-3d" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h3 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.1rem', fontWeight: 800 }}>
          Mês: {months[currentMonthIndex]} {currentYear}
        </h3>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={prevMonth}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-page)'
            }}
            aria-label="Mês anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-page)'
            }}
            aria-label="Próximo mês"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '10px' }}>
        {weekHeaders.map((h, i) => (
          <div key={i} style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.8 }}>
            {h}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {daysGrid.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
            {row.map((day, dIdx) => {
              const isToday = rIdx === 2 && day === 16;
              const isOtherMonth = rIdx === 4 && day <= 4;

              return (
                <div
                  key={dIdx}
                  style={{
                    padding: '8px 0',
                    borderRadius: '50%',
                    fontSize: '0.88rem',
                    fontWeight: isToday ? 800 : 500,
                    backgroundColor: isToday ? '#000000' : 'transparent',
                    color: isToday ? '#FFFFFF' : isOtherMonth ? 'rgba(0,0,0,0.3)' : 'var(--text-page)',
                    cursor: 'pointer',
                    border: isToday ? '1px solid #000000' : 'none'
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
