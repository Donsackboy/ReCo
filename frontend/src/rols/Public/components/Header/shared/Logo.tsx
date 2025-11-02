
import "../Logo.css";
import React from 'react';


interface LogoProps {
  onClick?: () => void;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ onClick, className }) => {
  return (
    <div className={className ? className : "nav-logo"}>
      <button onClick={onClick || (() => {})} className="logo-link">
        <div className="logo-container">
          <img 
            src="/Images/reco-logo.png" 
            alt="ReCo Logo" 
            className="logo-image"
          />
          <div className="logo-text-container">
            <div className="logo-text-styled">
              ReCo
            </div>
            <div className="logo-subtitle">
              REFUGIO CONECTADO
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default Logo;