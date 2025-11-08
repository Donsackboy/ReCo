import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DonarMonetariaOpciones.css';

const DonarMonetariaOpciones: React.FC = () => {
  const navigate = useNavigate();

  const goTransferencia = () => {
    navigate('/donar-monetaria/transferencia');
  };

  const goMercadoPago = () => {
    // Por ahora mostrar aviso; en el futuro dirigir al flujo de MercadoPago
    alert('MercadoPago: en desarrollo');
  };

  return (
    <div className="opciones-container">
      <h2>Elige un método de pago</h2>
      <div className="opciones-buttons">
        <div className="opcion-wrapper">
          <button className="opcion-button opcion-transferencia" onClick={goTransferencia}>
            Transferencia
          </button>
        </div>

        <div className="opcion-wrapper">
          <button className="opcion-button opcion-mercadopago" onClick={goMercadoPago} aria-label="MercadoPago (en desarrollo)">
            <img src="/Images/mercadopago-logo.png" alt="MercadoPago" className="mp-logo" />
          </button>
          <div className="mp-dev-below">(en desarrollo)</div>
        </div>
      </div>
    </div>
  );
};

export default DonarMonetariaOpciones;
