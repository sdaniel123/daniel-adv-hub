'use client';

import React, { useState } from 'react';
import { Folder, Plus, Download, FileText, Upload, X } from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

const mockDocs = [
  { id: '1', title: 'Procuração Ad Judicia 2026', categoria: 'Procurações', formato: 'DOCX', tamanho: '42 KB', arquivos: 12 },
  { id: '2', title: 'Modelo Petição Inicial Cível', categoria: 'Petições', formato: 'DOCX', tamanho: '85 KB', arquivos: 34 },
  { id: '3', title: 'Contrato de Honorários Advocatícios', categoria: 'Contratos', formato: 'PDF', tamanho: '120 KB', arquivos: 8 },
  { id: '4', title: 'Réplica Trabalhista Padrão', categoria: 'Trabalhista', formato: 'DOCX', tamanho: '64 KB', arquivos: 15 },
];

export default function DocumentosPage() {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [docName, setDocName] = useState('');

  const handleUpload = (e) => {
    e.preventDefault();
    setToast(`Documento ${docName || 'Novo'} adicionado ao repositório!`);
    setShowModal(false);
    setDocName('');
  };

  const handleDownload = (title) => {
    setToast(`Baixando modelo: ${title}...`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Repositório Digital
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 800 }}>
            Documentos & Gestão
          </h1>
        </div>

        <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
          <Upload size={18} />
          <span>Upload de Arquivo</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {mockDocs.map((doc) => (
          <div key={doc.id} className="card-saas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'var(--primary-light)' }}>
                <Folder size={24} color="var(--primary)" />
              </div>
              <button
                type="button"
                onClick={() => handleDownload(doc.title)}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', color: 'var(--primary)' }}
                title="Download do modelo"
              >
                <Download size={18} />
              </button>
            </div>

            <span className="badge-saas badge-primary" style={{ marginBottom: '8px' }}>{doc.categoria}</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              {doc.title}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Formato {doc.formato} • {doc.tamanho}
            </p>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ fontWeight: 600 }}>{doc.arquivos} Arquivos</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Acessar pasta →</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="sidebar-overlay open" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-popup" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '440px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>Upload de Documento</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Nome do Documento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Minuta de Acordo Cível..."
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Confirmar Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
