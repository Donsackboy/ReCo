import React from "react";
import "./HeaderLayout.css";

interface HeaderRefugioProps {
  refugioName?: string;
}

const HeaderRefugio: React.FC<HeaderRefugioProps> = ({ refugioName = "Refugio" }) => {
  return (
    <div className="header-layout">
      {/* Aquí puedes importar Logo, NavMenu, UserProfile, etc. igual que en el header público */}
      <span>{refugioName}</span>
    </div>
  );
};

export default HeaderRefugio;
