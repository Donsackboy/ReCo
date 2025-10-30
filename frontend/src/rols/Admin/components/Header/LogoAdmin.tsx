import React from 'react';

interface LogoProps {
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <div className="nav-logo">
      <button onClick={onClick || (() => {})} className="logo-link">
        <div className="logo-container">
          <img 
            src="/Images/reco-logo2.png" 
            alt="ReCo Logo2" 
            className="logo-image-admin"
          />
        </div>
      </button>
    </div>
  );
};

export default Logo;