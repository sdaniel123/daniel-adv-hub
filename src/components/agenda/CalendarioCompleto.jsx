'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Gavel, User, MapPin, Phone, Clock, Calendar as CalendarIcon, Link as LinkIcon } from 'lucide-react';
import { formatarHoraExibicao, formatarCabecalhoDia } from '@/lib/agendaStore';

export default function CalendarioCompleto({
  audiencias = [],
  atendimentos = [],
  onEditAudiencia,
  onEditAtendimento
}) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // Padrão Agosto/2026
  const [selectedDay, setSelectedDay] = useState(18);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Obter primeiro dia do mês e total de dias
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 (Dom) a 6 (Sáb)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Dias em branco antes do 1º dia
  const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Mapear eventos por dia
  const getEventsForDay = (day) => {
    const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const dayAudiencias = audiencias.filter(a => a.dataHora && a.dataHora.startsWith(targetDateStr));
    const dayAtendimentos = atendimentos.filter(a => a.dataHora && a.dataHora.startsWith(targetDateStr));

    return { dayAudiencias, dayAtendimentos };
  };

  // Eventos do dia selecionado
  const selectedDayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedAudiencias = audiencias.filter(a => a.dataHora && a.dataHora.startsWith(selectedDayDateStr));
  const selectedAtendimentos = atendimentos.filter(a => a.dataHora && a.dataHora.startsWith(selectedDayDateStr));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Controls & Month Title */}
      <div className="card-saas" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalendarIcon size={24} color="#3B82F6" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            {MESES[month]} de {year}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePrevMonth}
            style={{ padding: '8px 12px', fontSize: '0.86rem' }}
          >
            <ChevronLeft size={16} /> Mês Anterior
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              const hoje = new Date();
              setCurrentDate(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
              setSelectedDay(hoje.getDate());
            }}
            style={{ padding: '8px 12px', fontSize: '0.86rem' }}
          >
            Hoje
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleNextMonth}
            style={{ padding: '8px 12px', fontSize: '0.86rem' }}
          >
            Próximo Mês <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Grid Calendário em Tamanho Completo */}
      <div className="card-saas" style={{ padding: '20px', overflowX: 'auto' }}>
        
        {/* Dias da semana (Cabeçalho da tabela de 7 colunas) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
          {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((d) => (
            <div key={d} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Dias do mês em Grid 7 Colunas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          
          {/* Espaços vazios do mês anterior */}
          {paddingDays.map(p => (
            <div key={`pad-${p}`} style={{ backgroundColor: '#070A12', opacity: 0.3, borderRadius: '8px', minHeight: '90px' }} />
          ))}

          {/* Dias do mês */}
          {monthDays.map((day) => {
            const isSelected = selectedDay === day;
            const { dayAudiencias, dayAtendimentos } = getEventsForDay(day);
            const totalEventos = dayAudiencias.length + dayAtendimentos.length;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  backgroundColor: isSelected ? '#131D33' : '#0E1526',
                  border: isSelected ? '2px solid #3B82F6' : '1px solid #1B263B',
                  borderRadius: '10px',
                  padding: '8px',
                  minHeight: '110px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
                className="kanban-card-hover"
              >
                {/* Número do dia */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: isSelected ? '#3B82F6' : '#FFFFFF' }}>
                    {day}
                  </span>
                  {totalEventos > 0 && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, backgroundColor: '#3B82F6', color: '#FFFFFF', padding: '1px 6px', borderRadius: '10px' }}>
                      {totalEventos}
                    </span>
                  )}
                </div>

                {/* Crachás / Badges de Eventos do dia */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  {dayAudiencias.map((aud) => (
                    <div
                      key={aud.id}
                      style={{
                        backgroundColor: '#1E1B4B',
                        borderLeft: '3px solid #818CF8',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        fontSize: '0.68rem',
                        color: '#E0E7FF',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={`Audiência: ${aud.processo} (${formatarHoraExibicao(aud.dataHora)})`}
                    >
                      <strong style={{ color: '#818CF8' }}>{formatarHoraExibicao(aud.dataHora)}</strong> Aud. {aud.cliente || aud.processo}
                    </div>
                  ))}

                  {dayAtendimentos.map((atend) => (
                    <div
                      key={atend.id}
                      style={{
                        backgroundColor: '#064E3B',
                        borderLeft: '3px solid #34D399',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        fontSize: '0.68rem',
                        color: '#D1FAE5',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={`Atendimento: ${atend.nomeAtendido} (${formatarHoraExibicao(atend.dataHora)})`}
                    >
                      <strong style={{ color: '#34D399' }}>{formatarHoraExibicao(atend.dataHora)}</strong> Atend. {atend.nomeAtendido}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Painel Inferior: Detalhes do Dia Selecionado */}
      <div className="card-saas" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={20} color="#3B82F6" />
          Compromissos do Dia: {formatarCabecalhoDia(new Date(year, month, selectedDay))}
        </h3>

        {selectedAudiencias.length === 0 && selectedAtendimentos.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.88rem', fontStyle: 'italic', padding: '20px 0' }}>
            Nenhum compromisso (audiência ou atendimento) agendado para este dia.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            
            {/* Audiências do Dia */}
            {selectedAudiencias.map((aud) => (
              <div key={aud.id} style={{ backgroundColor: '#0E1526', border: '1px solid #1B263B', borderLeft: '4px solid #818CF8', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge-saas badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Gavel size={12} /> Audiência • {aud.tipo}
                  </span>
                  <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.88rem' }}>
                    {formatarHoraExibicao(aud.dataHora)}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px', fontFamily: 'monospace' }}>
                  CNJ: {aud.processo}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '8px' }}>
                  Cliente: <strong>{aud.cliente}</strong>
                </p>

                <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {aud.tipo === 'Online' ? <LinkIcon size={14} color="#A855F7" /> : <MapPin size={14} color="#3B82F6" />}
                  <span>{aud.local || 'Local não informado'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #162035', paddingTop: '10px' }}>
                  <span className={`badge-saas ${aud.status === 'Realizada' ? 'badge-success' : aud.status === 'Não realizada' ? 'badge-danger' : 'badge-warning'}`}>
                    {aud.status}
                  </span>
                  {onEditAudiencia && (
                    <button type="button" onClick={() => onEditAudiencia(aud)} style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.8rem', backgroundColor: 'transparent' }}>
                      Editar →
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Atendimentos do Dia */}
            {selectedAtendimentos.map((atend) => (
              <div key={atend.id} style={{ backgroundColor: '#0E1526', border: '1px solid #1B263B', borderLeft: '4px solid #34D399', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge-saas badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} /> Atendimento
                  </span>
                  <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.88rem' }}>
                    {formatarHoraExibicao(atend.dataHora)}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                  {atend.nomeAtendido}
                </h4>
                {atend.telefone && (
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={13} /> {atend.telefone}
                  </p>
                )}

                {atend.descricao && (
                  <p style={{ fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '12px' }}>
                    {atend.descricao}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #162035', paddingTop: '10px' }}>
                  <span className={`badge-saas ${atend.status === 'Realizado' ? 'badge-success' : atend.status === 'Não realizado' ? 'badge-danger' : 'badge-warning'}`}>
                    {atend.status}
                  </span>
                  {onEditAtendimento && (
                    <button type="button" onClick={() => onEditAtendimento(atend)} style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.8rem', backgroundColor: 'transparent' }}>
                      Editar →
                    </button>
                  )}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}
