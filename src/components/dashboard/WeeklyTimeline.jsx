'use client';

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const weekDays = [
  { dayName: 'Seg', dateNum: '17', isToday: false, urgentCount: 1, normalCount: 2 },
  { dayName: 'Ter', dateNum: '18', isToday: true, urgentCount: 3, normalCount: 1 },
  { dayName: 'Qua', dateNum: '19', isToday: false, urgentCount: 0, normalCount: 4 },
  { dayName: 'Qui', dateNum: '20', isToday: false, urgentCount: 1, normalCount: 2 },
  { dayName: 'Sex', dateNum: '21', isToday: false, urgentCount: 2, normalCount: 1 },
  { dayName: 'Sáb', dateNum: '22', isToday: false, urgentCount: 0, normalCount: 0 },
  { dayName: 'Dom', dateNum: '23', isToday: false, urgentCount: 0, normalCount: 0 },
];

export default function WeeklyTimeline({ onSelectDay }) {
  const [selectedIndex, setSelectedIndex] = useState(1);

  return (
    <div className="card-glass-3d" style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(55, 116, 255, 0.1)' }}>
            <Calendar size={20} color="#3774FF" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.25rem', fontWeight: 700 }}>
              Agenda da Semana
            </h2>
            <p style={{ fontSize: '0.82rem', opacity: 0.75 }}>
              Agosto 2026 - Prazos Fatais e Audiências
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--card-border)' }}
            aria-label="Semana anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Esta Semana</span>
          <button
            type="button"
            style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--card-border)' }}
            aria-label="Próxima semana"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        {weekDays.map((item, index) => {
          const isSelected = selectedIndex === index;

          return (
            <div
              key={item.dayName + item.dateNum}
              onClick={() => {
                setSelectedIndex(index);
                if (onSelectDay) onSelectDay(item);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '14px 8px',
                borderRadius: '12px',
                backgroundColor: isSelected
                  ? '#000000'
                  : item.isToday
                  ? 'rgba(55, 116, 255, 0.1)'
                  : 'transparent',
                color: isSelected ? '#FFFFFF' : 'var(--text-page)',
                border: isSelected ? '2px solid #000000' : '1px solid var(--card-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', opacity: isSelected ? 0.9 : 0.7 }}>
                {item.dayName}
              </span>
              <span style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '4px', marginBottom: '8px' }}>
                {item.dateNum}
              </span>

              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {item.urgentCount > 0 && (
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#F93D4A'
                    }}
                    title={`${item.urgentCount} urgentes`}
                  />
                )}
                {item.normalCount > 0 && (
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#3774FF'
                    }}
                    title={`${item.normalCount} audiências`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
