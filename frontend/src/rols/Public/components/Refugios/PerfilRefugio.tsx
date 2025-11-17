import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimalCard from '../Animales/AnimalCard';
import './PerfilRefugio.css';

// Animal type is now imported from AnimalCard props

interface Evento {
  id: number;
  nombre: string;
  fecha: string;
}

interface Refugio {
  id: number;
  nombre: string;
  descripcion: string;
  region: string;
  comuna?: string;
  imagen?: string;
  logo?: string;
  eventos: Evento[];
  animales: any[];
  telefono?: string;
  correo?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  sitio_web?: string;
  horario?: string;
}

interface PerfilRefugioProps {
  refugio: Refugio;
}

const PerfilRefugio: React.FC<PerfilRefugioProps> = ({ refugio }) => {
  return (
    <div className="perfil-refugio">
      <div className="refugio-header">
        <img
          src={
            refugio.logo && refugio.logo !== ''
              ? refugio.logo
              : refugio.imagen && refugio.imagen !== ''
              ? refugio.imagen
              : '/Images/animales/placeholder.png'
          }
          alt={refugio.nombre}
          className="refugio-logo"
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/Images/animales/placeholder.png';
          }}
        />
        <div className="refugio-info">
          <h2>{refugio.nombre}</h2>
          <div className="region-comuna">
            <span className="region">{refugio.region}</span>
            {refugio.comuna && <span className="comuna">, {refugio.comuna}</span>}
          </div>
          <p className="descripcion">{refugio.descripcion}</p>

          <div className="contacto-redes" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            {refugio.telefono && (
              <span className="contacto-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" stroke="#228B22" strokeWidth="2"/></svg>
                <a href={`tel:${refugio.telefono}`} style={{ color: '#228B22', textDecoration: 'none' }}>{refugio.telefono}</a>
              </span>
            )}
            {refugio.correo && (
              <span className="contacto-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm0 0l8 8 8-8" stroke="#228B22" strokeWidth="2"/></svg>
                <a href={`mailto:${refugio.correo}`} style={{ color: '#228B22', textDecoration: 'none' }}>{refugio.correo}</a>
              </span>
            )}
            {refugio.horario && (
              <span className="contacto-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#228B22" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="#228B22" strokeWidth="2"/></svg>
                <span style={{ color: '#228B22' }}>{refugio.horario}</span>
              </span>
            )}
            <div className="redes-sociales" style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
              {refugio.instagram && (
                <a href={refugio.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" stroke="#C13584" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="#C13584" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="#C13584"/></svg>
                </a>
              )}
              {refugio.facebook && (
                <a href={refugio.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" stroke="#1877F3" strokeWidth="2"/><path d="M16 12h-2v8h-4v-8H8v-3h2V7.5A3.5 3.5 0 0113.5 4H16v3h-2.5A.5.5 0 0013 7.5V9h3l-.5 3z" fill="#1877F3"/></svg>
                </a>
              )}
              {refugio.twitter && (
                <a href={refugio.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" stroke="#1DA1F2" strokeWidth="2"/><path d="M19 7.5a6.5 6.5 0 01-1.89.52A3.3 3.3 0 0018.5 6a6.56 6.56 0 01-2.08.8A3.28 3.28 0 007.5 9.5c0 .26.03.52.08.76A9.32 9.32 0 015 7.5s-4 9 7 13c8.5-3.5 7-13 7-13z" fill="#1DA1F2"/></svg>
                </a>
              )}
              {refugio.tiktok && (
                <a href={refugio.tiktok} target="_blank" rel="noopener noreferrer" title="TikTok">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" stroke="#000" strokeWidth="2"/><path d="M16 8.5V14a4 4 0 11-4-4h1" stroke="#000" strokeWidth="2"/><circle cx="16" cy="7" r="1" fill="#000"/></svg>
                </a>
              )}
              {refugio.sitio_web && (
                <a href={refugio.sitio_web} target="_blank" rel="noopener noreferrer" title="Sitio web">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#228B22" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#228B22" strokeWidth="2"/></svg>
                </a>
              )}
            </div>
          </div>
          <DonarModal refugio={refugio} />
        </div>
      </div>

      <h3 style={{ color: '#145214', marginBottom: '10px' }}>Eventos activos</h3>
      {(refugio.eventos && refugio.eventos.length > 0) ? (
        <ul className="eventos-lista">
          {refugio.eventos.map(ev => (
            <li key={ev.id}>{ev.nombre} - {ev.fecha}</li>
          ))}
        </ul>
      ) : (
        <p className="sin-eventos">Aún no hay eventos activos. ¡Pronto habrán novedades!</p>
      )}

      <div className="animales-header">
        <h3>Animales del refugio</h3>
        <Link
          to={`/animales?refugio=${encodeURIComponent(refugio.id)}`}
          className="boton-ver-todos"
        >
          Ver todos
        </Link>
      </div>

      <div className="animales-grid">
        {(refugio.animales ?? []).slice(0, 10).map(animal => (
          <AnimalCard
            key={animal.id}
            animal={{
              id: animal.id,
              nombre: animal.nombre,
              sexo: animal.sexo || '',
              edad: animal.edad || 0,
              tipo_edad: animal.tipo_edad,
              tamano: animal.tamano || '',
              refugio: animal.refugio || refugio.nombre,
              region: animal.region || refugio.region,
              diasEnRefugio: animal.diasEnRefugio || 0,
              imagenes: animal.imagenes || [animal.imagen],
              resena: animal.resena || '',
              descripcion: animal.descripcion || '',
            }}
          />
        ))}
      </div>
    </div>
  );
};




// Modal y botón sin MUI
const DonarModal: React.FC<{ refugio: any }> = ({ refugio }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCopyAll = () => {
    if (!refugio) return;
    const datos = [
      `Banco: ${refugio.banco || ''}`,
      `Tipo de cuenta: ${refugio.tipo_cuenta || refugio.tipoCuenta || ''}`,
      `N° Cuenta: ${refugio.numero_cuenta || refugio.numeroCuenta || ''}`,
      `Nombre titular: ${refugio.titular_cuenta || refugio.titularCuenta || ''}`,
      `RUT titular: ${refugio.rut_titular || refugio.rutTitular || ''}`,
      `Email bancario: ${refugio.email_bancario || refugio.emailBancario || refugio.email || ''}`
    ].join('\n');
    navigator.clipboard.writeText(datos);
    alert('¡Todos los datos bancarios copiados!');
  };
  return (
    <>
      <button className="boton-donar" onClick={handleOpen}>Donar al refugio</button>
      {open && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 9999 }} onClick={handleClose}>
          <div className="modal-content" style={{ background: '#fff', padding: 32, borderRadius: 12, maxWidth: 400, margin: '80px auto', boxShadow: '0 2px 16px #0002', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 18 }}>Datos Bancarios del Refugio</h2>
            {refugio?.banco ? (
              <>
                <div style={{ marginBottom: 10 }}><strong>Banco:</strong> {refugio.banco}</div>
                <div style={{ marginBottom: 10 }}><strong>Tipo de cuenta:</strong> {refugio.tipo_cuenta || refugio.tipoCuenta || 'No disponible'}</div>
                <div style={{ marginBottom: 10 }}><strong>N° Cuenta:</strong> {refugio.numero_cuenta || refugio.numeroCuenta || 'No disponible'}</div>
                <div style={{ marginBottom: 10 }}><strong>Nombre titular:</strong> {refugio.titular_cuenta || refugio.titularCuenta || 'No disponible'}</div>
                <div style={{ marginBottom: 10 }}><strong>RUT titular:</strong> {refugio.rut_titular || refugio.rutTitular || 'No disponible'}</div>
                <div style={{ marginBottom: 10 }}><strong>Email bancario:</strong> {refugio.email_bancario || refugio.emailBancario || refugio.email || 'No disponible'}</div>
                <button onClick={handleCopyAll} style={{ background: '#43a047', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 17, margin: '18px 0 8px 0', cursor: 'pointer', width: '100%' }}>Copiar todos los datos</button>
              </>
            ) : (
              <div>No hay datos bancarios disponibles para este refugio.</div>
            )}
            <button onClick={handleClose} style={{
              marginTop: 10,
              background: '#e3f6ff',
              color: '#228B22',
              fontWeight: 600,
              border: '1.5px solid #43a047',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 16,
              width: '100%',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s'
            }}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PerfilRefugio;
