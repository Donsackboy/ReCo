import React from "react";
import "./HeaderLayout.css";

interface HeaderUsuarioProps {
  userName?: string;
}

const HeaderUsuario: React.FC<HeaderUsuarioProps> = ({ userName = "Usuario" }) => {
  return (
    <div className="header-layout">
      {/* Aquí puedes importar Logo, NavMenu, UserProfile, etc. igual que en el header público */}
      <span>{userName}</span>
    </div>
  );
};

export default HeaderUsuario;
