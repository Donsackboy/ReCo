import React from 'react';
import { useParams } from 'react-router-dom';
import PerfilRefugio from '../../components/Refugios/PerfilRefugio';
import { animales } from '../Animales/animalesData';

// Simulación de datos de refugio y animales
const refugios = [
  {
    id: 1,
    nombre: 'Refugio Esperanza',
    descripcion: 'Refugio dedicado al rescate y rehabilitación de animales en situación de abandono. Trabajamos con voluntarios y hogares temporales.',
    region: 'Metropolitana',
    imagen: '/Images/refugios/refugio-esperanza.png',
    eventos: [
      { id: 1, nombre: 'Jornada de adopción', fecha: '2025-11-10' },
      { id: 2, nombre: 'Campaña de vacunación', fecha: '2025-12-05' }
    ],
    animales: animales.filter(a => a.refugio === 'Refugio Esperanza').map(a => ({
      ...a
    }))
  },
  {
    id: 2,
    nombre: 'Refugio Patitas',
    descripcion: 'Refugio dedicado al rescate y rehabilitación de animales en situación de abandono. Trabajamos con voluntarios y hogares temporales.',
    region: 'Valparaíso',
    imagen: '/Images/refugios/refugio-patitas.png',
    eventos: [
      { id: 3, nombre: 'Jornada de adopción', fecha: '2025-11-20' },
      { id: 4, nombre: 'Campaña de vacunación', fecha: '2025-12-15' }
    ],
    animales: animales.filter(a => a.refugio === 'Refugio Patitas').map(a => ({
      ...a
    }))
  }
  // ...otros refugios
];

export default function RefugioPerfil() {
  const { id } = useParams();
  const refugio = refugios.find(r => r.id === Number(id));
  if (!refugio) return <div>Refugio no encontrado</div>;
  return <PerfilRefugio refugio={refugio} />;
}
