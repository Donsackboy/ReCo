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
  imagen: string;
  logo?: string;
  eventos: Evento[];
  animales: any[];
  banco?: string;
  tipo_cuenta?: string;
  numero_cuenta?: string;
  nombre_titular?: string;
  rut_titular?: string;
  correo_donacion?: string;
}

interface PerfilRefugioProps {
  refugio: Refugio;
}

const PerfilRefugio: React.FC<PerfilRefugioProps> = ({ refugio }) => {
  const [showModal, setShowModal] = useState(false);
  const datosDonacion = [
    { label: 'Banco', value: refugio.banco },
    { label: 'Tipo de cuenta', value: refugio.tipo_cuenta },
    { label: 'Número de cuenta', value: refugio.numero_cuenta },
    { label: 'Nombre titular', value: refugio.nombre_titular },
    { label: 'RUT titular', value: refugio.rut_titular },
    { label: 'Correo para donación', value: refugio.correo_donacion },
  ];
  const tieneDatosDonacion = datosDonacion.some(d => d.value);

  // Usar logo si existe, si no mostrar imagen por defecto
  const logoUrl = refugio.logo || refugio.imagen || '/default-logo.png';
  return (
    <div className="perfil-refugio-container">
      <div className="perfil-refugio-header">
        <img className="perfil-refugio-img" src={logoUrl} alt={refugio.nombre} onError={e => { (e.target as HTMLImageElement).src = '/default-logo.png'; }} />
        <div className="perfil-refugio-info">
          <h2 className="perfil-refugio-nombre">{refugio.nombre}</h2>
          <div className="perfil-refugi o-region">{refugio.region}</div>
          <p className="perfil-refugio-descripcion">{refugio.descripcion}</p>
          <button className="perfil-refugio-donar" onClick={() => setShowModal(true)}>Donar al refugio</button>
        </div>
      </div>
      {showModal && (
        <div className="perfil-refugio-modal-bg" onClick={() => setShowModal(false)}>
          <div className="perfil-refugio-modal" onClick={e => e.stopPropagation()}>
            <h3 className="perfil-refugio-modal-titulo">Datos para donar por transferencia</h3>
            {tieneDatosDonacion ? (
              <ul className="perfil-refugio-modal-lista">
                {datosDonacion.map((dato, idx) => (
                  dato.value ? (
                    <li key={idx} className="perfil-refugio-modal-item">
                      <strong>{dato.label}:</strong> {dato.value}
                    </li>
                  ) : null
                ))}
              </ul>
            ) : (
              <div className="perfil-refugio-modal-placeholder" style={{ color: '#888', fontSize: '1.08rem', marginBottom: '16px', textAlign: 'center' }}>
                El refugio aún no ha ingresado sus datos para donaciones por transferencia.
              </div>
            )}
            <button className="perfil-refugio-modal-cerrar" onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
      <h3 className="perfil-refugio-eventos-titulo">Eventos activos</h3>
      <ul className="perfil-refugio-eventos-lista">
        {(refugio.eventos ?? []).map(ev => (
          <li key={ev.id}>{ev.nombre} - {ev.fecha}</li>
        ))}
      </ul>
      <div className="perfil-refugio-animales-header">
        <h3 className="perfil-refugio-animales-titulo">Animales del refugio</h3>
        <Link
          to={`/animales?refugio=${encodeURIComponent(refugio.nombre)}`}
          className="perfil-refugio-ver-todos"
        >
          Ver todos
        </Link>
      </div>
      <div className="perfil-refugio-animales-lista">
        {(refugio.animales ?? []).slice(0, 10).map(animal => (
          <AnimalCard key={animal.id} animal={{
            id: animal.id,
            nombre: animal.nombre,
            sexo: animal.sexo || '',
            edad: animal.edad || 0,
            tamano: animal.tamano || '',
            refugio: animal.refugio || refugio.nombre,
            region: animal.region || refugio.region,
            diasEnRefugio: animal.diasEnRefugio || 0,
            imagenes: animal.imagenes || [animal.imagen],
            resena: animal.resena || '',
          }} />
        ))}
      </div>
    </div>
  );
};

export default PerfilRefugio;
