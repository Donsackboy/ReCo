import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type Refugio = {
  id_refugio?: number;
  nombre?: string;
  logo?: string | null;
  datos_donacion_titular?: string | null;
  datos_donacion_banco?: string | null;
  datos_donacion_tipo_cuenta?: string | null;
  datos_donacion_numero_cuenta?: string | null;
  datos_donacion_rut?: string | null;
  datos_donacion_instrucciones?: string | null;
  datos_donacion_links?: string[] | null;
};

const DonarTransferencia: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateAny: any = (location && (location as any).state) || {};
  const initialRefugio: Refugio | undefined = stateAny.refugio;

  function normalizeRefugio(raw: any): Refugio {
    if (!raw) return {} as Refugio;
    return {
      id_refugio: raw.id_refugio ?? raw.id ?? raw.pk ?? null,
      nombre: raw.nombre ?? raw.nombre_refugio ?? raw.title ?? '',
      logo: raw.logo ?? null,
  // No usar `raw.nombre` como fallback: el titular de la donación debe venir
  // de `nombre_titular` o `datos_donacion_titular` exclusivamente.
      datos_donacion_titular: raw.nombre_titular ?? raw.datos_donacion_titular ?? null,
      datos_donacion_banco: raw.banco ?? raw.datos_donacion_banco ?? null,
      datos_donacion_tipo_cuenta: raw.tipo_cuenta ?? raw.datos_donacion_tipo_cuenta ?? null,
      datos_donacion_numero_cuenta: raw.numero_cuenta ?? raw.datos_donacion_numero_cuenta ?? null,
      datos_donacion_rut: raw.rut_titular ?? raw.datos_donacion_rut ?? null,
      datos_donacion_instrucciones: raw.datos_donacion_instrucciones ?? raw.instrucciones ?? null,
      datos_donacion_links: raw.datos_donacion_links ?? raw.links ?? null,
    };
  }

  const [refugios, setRefugios] = useState<Refugio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Refugio | null>(initialRefugio ? normalizeRefugio(initialRefugio) : null);

  useEffect(() => {
    setLoading(true);
    const base = (import.meta as any).env?.VITE_API_BASE || '';
    fetch(`${base}/public/refugios/`)
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching refugios');
        return res.json();
      })
      .then((data: any) => {
        const mapped = (data || []).map((r: any) => normalizeRefugio(r));
        setRefugios(mapped || []);
      })
      .catch((e: any) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  function formatDonationText(r: Refugio | null) {
    if (!r) return '';
    return `Titular: ${r.datos_donacion_titular || '-'}\nBanco: ${r.datos_donacion_banco || '-'}\nTipo: ${r.datos_donacion_tipo_cuenta || '-'}\nCuenta: ${r.datos_donacion_numero_cuenta || '-'}\nRUT: ${r.datos_donacion_rut || '-'}`;
  }

  return (
    <div style={{ maxWidth: 980, margin: '28px auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>Transferencia bancaria</h2>
      <p>Puedes donar a la página o donar directamente a uno de los refugios listados abajo.</p>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Left column: list of refugios (vertical) */}
        <div style={{ width: 360, background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h3 style={{ marginTop: 0 }}>Refugios</h3>
          {loading && <div>Cargando refugios...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {!loading && refugios.length === 0 && <div>No hay refugios disponibles.</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {refugios.map((r) => (
              <div key={r.id_refugio} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 8, borderRadius: 8, border: selected?.id_refugio === r.id_refugio ? '1px solid #2e7d32' : '1px solid #eee' }}>
                <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {r.logo ? <img src={r.logo} alt={r.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ color: '#999' }}>Sin logo</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: '#145214' }}>{r.nombre}</div>
                </div>
                <div>
                  <button onClick={() => setSelected(r)} style={{ background: '#2e7d32', color: '#fff', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Donar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: selected refugio donation details (or general page donation) */}
        <div style={{ flex: 1, background: '#fff', padding: 18, borderRadius: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          {!selected && (
            <div>
              <h3 style={{ marginTop: 0 }}>Donar a la página</h3>
              <ul>
                <li><strong>Titular:</strong> Nombre Refugio</li>
                <li><strong>Banco:</strong> Banco Ejemplo</li>
                <li><strong>Tipo de cuenta:</strong> Cuenta Corriente</li>
                <li><strong>Número de cuenta:</strong> 1234567890</li>
                <li><strong>RUT:</strong> 12.345.678-9</li>
              </ul>
              <p>Cuando realices la transferencia, por favor envía el comprobante al correo del refugio.</p>
            </div>
          )}

          {selected && (
            <div>
              <h3 style={{ marginTop: 0 }}>{selected.nombre} — Datos de donación</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><strong>Titular:</strong> {selected.datos_donacion_titular || '—'}</div>
                <div><strong>Banco:</strong> {selected.datos_donacion_banco || '—'}</div>
                <div><strong>Tipo cuenta:</strong> {selected.datos_donacion_tipo_cuenta || '—'}</div>
                <div><strong>Número cuenta:</strong> {selected.datos_donacion_numero_cuenta || '—'}</div>
                <div><strong>RUT:</strong> {selected.datos_donacion_rut || '—'}</div>
              </div>
              <div style={{ marginTop: 14 }}>
                <button onClick={() => navigator.clipboard?.writeText(formatDonationText(selected))} style={{ marginRight: 8, padding: '8px 12px', borderRadius: 8, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}>Copiar datos</button>
                <button onClick={() => setSelected(null)} style={{ padding: '8px 12px', borderRadius: 8, background: '#eee', color: '#333', border: 'none', cursor: 'pointer' }}>Cerrar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonarTransferencia;
