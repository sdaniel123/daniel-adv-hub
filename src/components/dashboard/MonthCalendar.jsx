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
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700 }}>
          Mês: {months[currentMonthIndex]} {currentYear}
        </h3>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={prevMonth}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-page)'
            }}
            aria-label="Mês anterior"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-page)'
            }}
            aria-label="Próximo mês"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
        {weekHeaders.map((h, i) => (
          <div key={i} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gold)' }}>
            {h}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {daysGrid.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
            {row.map((day, dIdx) => {
              const isToday = rIdx === 2 && day === 16;
              const isOtherMonth = rIdx === 4 && day <= 4;

              return (
                <div
                  key={dIdx}
                  style={{
                    padding: '6px 0',
                    borderRadius: '50%',
                    fontSize: '0.85rem',
                    fontWeight: isToday ? 700 : 500,
                    backgroundColor: isToday ? 'var(--color-midnight)' : 'transparent',
                    color: isToday ? 'var(--color-gold)' : isOtherMonth ? 'rgba(100,116,139,0.4)' : 'var(--text-page)',
                    cursor: 'pointer',
                    border: isToday ? '1px solid var(--color-gold)' : 'none'
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
