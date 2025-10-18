import React from 'react';
import HeaderPublic from './variants/HeaderPublic';
import HeaderRefugio from './variants/HeaderRefugio';
import HeaderUsuario from './variants/HeaderUsuario';
import HeaderAdmin from './variants/HeaderAdmin';

// Tipos de usuario según tu enum de la base de datos
export type UserType = 'public' | 'usuario' | 'refugio' | 'admin' | 'veterinario' | null;

interface User {
  id?: number;
  nombre?: string;
  tipo_usuario?: UserType;
  refugio_nombre?: string; // Para usuarios de tipo refugio
}

interface HeaderWrapperProps {
  user?: User | null;
  onNavigateHome?: () => void;
  onLogout?: () => void;
}

const HeaderWrapper: React.FC<HeaderWrapperProps> = ({ 
  user = null, 
  onNavigateHome, 
  onLogout 
}) => {
  
  // Si no hay usuario logueado, mostrar header público
  if (!user || !user.tipo_usuario) {
    return <HeaderPublic onNavigateHome={onNavigateHome} />;
  }

  // Seleccionar header según tipo de usuario
  switch (user.tipo_usuario) {
    case 'refugio':
      return (
        <HeaderRefugio
          onNavigateHome={onNavigateHome}
          refugioNombre={user.refugio_nombre || user.nombre}
          onLogout={onLogout}
        />
      );
      
    case 'usuario':
      return (
        <HeaderUsuario
          onNavigateHome={onNavigateHome}
          userName={user.nombre}
          onLogout={onLogout}
        />
      );
      
    case 'admin':
      return (
        <HeaderAdmin
          onNavigateHome={onNavigateHome}
          adminName={user.nombre}
          onLogout={onLogout}
        />
      );
      
    case 'veterinario':
      // Por ahora usar el header de usuario, más adelante se puede crear uno específico
      return (
        <HeaderUsuario
          onNavigateHome={onNavigateHome}
          userName={`Dr. ${user.nombre}`}
          onLogout={onLogout}
        />
      );
      
    default:
      // Fallback al header público si el tipo no es reconocido
      return <HeaderPublic onNavigateHome={onNavigateHome} />;
  }
};

export default HeaderWrapper;