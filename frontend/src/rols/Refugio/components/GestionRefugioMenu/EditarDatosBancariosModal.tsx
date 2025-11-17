import React, { useState } from 'react';

interface EditarDatosBancariosModalProps {
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  rutTitular: string;
  onClose: () => void;
  onConfirm: (datos: {
    banco: string;
    tipoCuenta: string;
    numeroCuenta: string;
    rutTitular: string;
  }) => void;
}

const EditarDatosBancariosModal: React.FC<EditarDatosBancariosModalProps> = ({ banco, tipoCuenta, numeroCuenta, rutTitular, onClose, onConfirm }) => {
  const [form, setForm] = useState({ banco, tipoCuenta, numeroCuenta, rutTitular });
  const [confirm, setConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirm(true);
  };

  const handleFinalConfirm = () => {
    onConfirm(form);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0002', position: 'relative' }}>
        <h2>Editar datos bancarios</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input name="banco" value={form.banco} onChange={handleChange} placeholder="Banco" required />
          <input name="tipoCuenta" value={form.tipoCuenta} onChange={handleChange} placeholder="Tipo de cuenta" required />
          <input name="numeroCuenta" value={form.numeroCuenta} onChange={handleChange} placeholder="Número de cuenta" required />
          <input name="rutTitular" value={form.rutTitular} onChange={handleChange} placeholder="RUT titular" required />
          <button type="submit" style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Guardar cambios</button>
          <button type="button" onClick={onClose} style={{ marginTop: 8, background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 500, fontSize: '0.98rem', cursor: 'pointer' }}>Cancelar</button>
        </form>
        {confirm && (
          <div style={{ marginTop: 18, background: '#fffde7', borderRadius: 8, padding: 14, color: '#b8860b', fontWeight: 500 }}>
            ¿Confirmar cambios bancarios?<br />
            <button onClick={handleFinalConfirm} style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: 10 }}>Confirmar</button>
            <button onClick={onClose} style={{ marginLeft: 12, background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: '0.98rem', cursor: 'pointer', marginTop: 10 }}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarDatosBancariosModal;
