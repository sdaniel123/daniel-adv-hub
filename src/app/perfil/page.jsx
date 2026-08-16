'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Save, Key, Bell, Moon, Sun } from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

export default function PerfilPage() {
  const [nome, setNome] = useState('Dr. Daniel G. Simões');
  const [oab, setOab] = useState('000.000/SP');
  const [email, setEmail] = useState('daniel.simoes@advocacia.com.br');
  const [phone, setPhone] = useState('(11) 99999-8888');
  const [especialidade, setEspecialidade] = useState('Direito Cível & Empresarial');
  const [toast, setToast] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setToast('Perfil atualizado com sucesso!');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Configurações da Conta
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 800 }}>
            Editar Perfil do Advogado
          </h1>
        </div>

        <button type="submit" form="profile-form" className="btn-primary">
          <Save size={18} />
          <span>Salvar Alterações</span>
        </button>
      </div>

      <form id="profile-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div className="card-saas">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '84px', height: '84px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', border: '3px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <User size={40} />
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>{nome}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>OAB {oab} • {especialidade}</p>
              <button type="button" className="btn-secondary" style={{ marginTop: '10px', padding: '6px 14px', fontSize: '0.8rem' }}>
                Alterar Foto de Perfil
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Nome Completo</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Número de Inscrição OAB</label>
              <input
                type="text"
                required
                value={oab}
                onChange={(e) => setOab(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>E-mail Corporativo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Telefone / WhatsApp</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Shield size={20} color="var(--primary)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>Especialidades e Preferências</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Área de Atuação Principal</label>
              <input
                type="text"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>
          </div>
        </div>
      </form>

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
