'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Clock, Users, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

const events = [
  { id: '1', time: '09:00 - 10:30', title: 'Audiência de Instrução e Julgamento', type: 'Audiência', local: 'TJSP - 4ª Vara Cível', cliente: 'Carlos Eduardo Silva', tagColor: 'var(--primary)' },
  { id: '2', time: '14:00 - 15:00', title: 'Reunião Inicial com Novo Cliente', type: 'Reunião', local: 'Escritório Presencial', cliente: 'Tech Solutions Ltda', tagColor: 'var(--warning)' },
  { id: '3', time: '17:00 - 18:00', title: 'Conferência de Minutas de Apelação', type: 'Interno', local: 'Sala de Reuniões', cliente: 'Interno', tagColor: 'var(--success)' },
];

export default function AgendaPage() {
  const [selectedDay, setSelectedDay] = useState(16);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [eventTitle, setEventTitle] = useState('');

  const handleAddEvent = (e) => {
    e.preventDefault();
    setToast(`Compromisso ${eventTitle || 'Novo'} agendado na agenda!`);
    setShowModal(false);
    setEventTitle('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Compromissos & Audiências
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 800 }}>
            Agenda do Advogado
          </h1>
        </div>

        <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span>Agendar Compromisso</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>
              Agosto 2026
            </h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" style={{ padding: '6px', borderRadius: '50%', border: '1px solid var(--border-light)' }}>
                <ChevronLeft size={16} />
              </button>
              <button type="button" style={{ padding: '6px', borderRadius: '50%', border: '1px solid var(--border-light)' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '10px' }}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((h, i) => (
              <div key={i} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                {h}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isSelected = selectedDay === day;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: '8px 0',
                    borderRadius: '50%',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 800 : 500,
                    backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                    color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-saas">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
            Compromissos do Dia {selectedDay} de Agosto
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map((ev) => (
              <div key={ev.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', borderLeft: `4px solid ${ev.tagColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: ev.tagColor }}>{ev.type}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ev.time}</span>
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '4px' }}>{ev.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {ev.local}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={13} /> {ev.cliente}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="sidebar-overlay open" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-popup" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '440px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>Agendar Compromisso</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Título do Compromisso</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Audiência TJSP..."
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Agendamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
