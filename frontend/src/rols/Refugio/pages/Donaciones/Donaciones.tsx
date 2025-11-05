import React, { useEffect, useState } from 'react';
import './Donaciones.css';

const Donaciones: React.FC = () => {
  const [refugio, setRefugio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    banco: '',
    tipo_cuenta: '',
    numero_cuenta: '',
    rut_titular: '',
    nombre_titular: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRefugio = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Sesión no iniciada');
          setLoading(false);
          return;
        }
        // @ts-ignore: Dynamic import to align with existing api.js usage
        const api = await import('../../../../api.js');
        const API_BASE = api.API_BASE;

        const res = await fetch(`${API_BASE}/refugio/me`, {
          headers: { 'Authorization': `Token ${token}`, 'Accept': 'application/json' },
        });
        let data: any = null;
        try {
          data = await res.json();
        } catch {
          setError('La respuesta no es un JSON válido');
          setLoading(false);
          return;
        }
        if (!res.ok) {
          setError(data?.detail || data?.error || 'Error al obtener los datos del refugio');
          setRefugio(data);
          setLoading(false);
          return;
        }
        setRefugio(data);
        setForm({
          banco: data.banco || '',
          tipo_cuenta: data.tipo_cuenta || '',
          numero_cuenta: data.numero_cuenta || '',
          rut_titular: data.rut_titular || '',
          nombre_titular: data.nombre_titular || '',
        });
        setLoading(false);
      } catch {
        setError('No se pudo conectar con el backend');
        setLoading(false);
      }
    };
    fetchRefugio();
  }, []);

  // Detectar si los datos de transferencia están completos
  const transferenciaCampos = [
    'banco',
    'tipo_cuenta',
    'numero_cuenta',
    'rut_titular',
    'nombre_titular',
  ];
  const transferenciaFaltante = refugio && transferenciaCampos.some(campo => !refugio[campo] || refugio[campo].trim() === '');

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      // @ts-ignore: Dynamic import
      const api = await import('../../../../api.js');
      const API_BASE = api.API_BASE;
      const res = await fetch(`${API_BASE}/refugio/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || 'Error al guardar los datos');
      setRefugio(data);
      setEditOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error al guardar los datos');
    }
    setSaving(false);
  };

  return (
    <div className="donaciones-container">
      {loading ? (
        <span className="donaciones-loading">Cargando nombre del refugio...</span>
      ) : refugio && refugio.nombre ? (
        <span className="refugio-nombre">Refugio: <strong>{refugio.nombre}</strong></span>
      ) : (
        <span className="donaciones-error">{error || 'No se encontró el nombre del refugio'}</span>
      )}
      <div className="donaciones-transferencia">
        <strong>Datos de transferencia</strong><br/>
        {!loading && refugio && transferenciaFaltante ? (
          <span className="donaciones-faltante">
            El refugio no tiene configurados todos los datos para recibir donaciones por transferencia.<br/>
            <span className="donaciones-faltan-campos">
              (Faltan: {transferenciaCampos.filter(campo => !refugio[campo] || refugio[campo].trim() === '').join(', ')})
            </span>
          </span>
        ) : (!loading && refugio) ? (
          <div className="donaciones-datos-box">
            <div><b>Banco:</b> {refugio.banco}</div>
            <div><b>Tipo de cuenta:</b> {refugio.tipo_cuenta}</div>
            <div><b>Número de cuenta:</b> {refugio.numero_cuenta}</div>
            <div><b>RUT:</b> {refugio.rut_titular}</div>
            <div><b>Nombre titular:</b> {refugio.nombre_titular}</div>
          </div>
        ) : null}
        {!loading && refugio && (
          <button className="donaciones-edit-btn" onClick={handleEditOpen}>
            {transferenciaFaltante ? 'Agregar datos de transferencia' : 'Editar datos de transferencia'}
          </button>
        )}
      </div>

      {/* Modal de edición de datos de transferencia */}
      {editOpen && (
        <div className="donaciones-modal-bg">
          <form className="donaciones-modal-form" onSubmit={handleFormSubmit}>
            <h3>Editar datos de transferencia</h3>
            <label>Banco:<br/>
              <input name="banco" value={form.banco} onChange={handleFormChange} required type="text" />
            </label><br/>
            <label>Tipo de cuenta:<br/>
              <select name="tipo_cuenta" value={form.tipo_cuenta} onChange={handleFormChange} required>
                <option value="">Selecciona tipo de cuenta</option>
                <option value="Corriente">Cuenta Corriente</option>
                <option value="Vista">Cuenta Vista</option>
                <option value="Ahorro">Cuenta de Ahorro</option>
                <option value="RUT">Cuenta RUT</option>
              </select>
            </label><br/>
            <label>Número de cuenta:<br/>
              <input name="numero_cuenta" value={form.numero_cuenta} onChange={handleFormChange} required type="text" />
            </label><br/>
            <label>RUT:<br/>
              <input name="rut_titular" value={form.rut_titular} onChange={handleFormChange} required type="text" />
            </label><br/>
            <label>Nombre titular:<br/>
              <input name="nombre_titular" value={form.nombre_titular} onChange={handleFormChange} required type="text" />
            </label><br/>
            <div className="donaciones-modal-btns">
              <button type="submit" disabled={saving} className="donaciones-save-btn">Guardar</button>
              <button type="button" onClick={handleEditClose} className="donaciones-cancel-btn">Cancelar</button>
            </div>
            {saving && <div className="donaciones-guardando">Guardando...</div>}
          </form>
        </div>
      )}
      {/* Mostrar el JSON de la respuesta para depuración */}
      {!loading && refugio && (
        <pre className="donaciones-json">
          {JSON.stringify(refugio, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Donaciones;

