
import React from 'react';
import { useParams } from 'react-router-dom';
import PerfilRefugio from '../../components/Refugios/PerfilRefugio';

export default function RefugioPerfil() {
  const { id } = useParams();
  const [refugio, setRefugio] = React.useState<any>(null);
  // Eliminado: animales y setAnimales, no se usan
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Modal para datos bancarios
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Copiado al portapapeles!');
  };
  const handleCopyAll = () => {
    if (!refugio) return;
    const datos = [
      `Banco: ${refugio.banco || ''}`,
      `Tipo de cuenta: ${refugio.tipo_cuenta || refugio.tipoCuenta || ''}`,
      `N° Cuenta: ${refugio.numero_cuenta || refugio.numeroCuenta || ''}`,
      `Nombre titular: ${refugio.titular_cuenta || refugio.titularCuenta || ''}`,
      `RUT titular: ${refugio.rut_titular || refugio.rutTitular || ''}`,
      `Email bancario: ${refugio.email_bancario || refugio.emailBancario || refugio.email || ''}`
    ].join('\n');
    navigator.clipboard.writeText(datos);
    alert('¡Todos los datos bancarios copiados!');
  };

  React.useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setRefugio(null);
      setLoading(false);
      return;
    }
    console.log('RefugioPerfil.tsx - id actual del refugio:', id);
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch refugio
  const refugioRes = await fetch(`${(import.meta as any).env.VITE_API_BASE}/public/refugios/${id}/`);
        if (!refugioRes.ok) throw new Error('No se pudo cargar el refugio');
        const refugioData = await refugioRes.json();

        // Fetch all public animals
  const animalesRes = await fetch(`${(import.meta as any).env.VITE_API_BASE}/public/animales/`);
        let animalesData = await animalesRes.json();
        animalesData = Array.isArray(animalesData) ? animalesData.map((a: any) => ({ ...a, id: a.id_animal })) : [];
        // Log de los primeros 5 animales y sus campos de relación
        console.log('Animales recibidos (primeros 5):', animalesData.slice(0, 5).map((a: any) => ({
          id_animal: a.id_animal,
          refugio: a.refugio,
          refugio_id: a.refugio?.id,
          refugio_id_refugio: a.refugio?.id_refugio
        })));

        // Filter animals belonging to this refuge and ensure main photo logic
        const animalesRefugio = animalesData.filter((a: any) => {
          if (typeof a.refugio === 'object' && a.refugio !== null) {
            return a.refugio.id === Number(id) || a.refugio.id_refugio === Number(id);
          }
          return a.refugio === Number(id);
        }).map((animal: any) => ({
          ...animal,
          imagenes: (animal.imagenes && animal.imagenes.length > 0)
            ? animal.imagenes
            : (animal.fotos && animal.fotos.length > 0 ? animal.fotos : (animal.imagen ? [animal.imagen] : [])),
          descripcion: animal.descripcion || animal.resena || '',
        }));

        // Log los primeros dos animales filtrados
        console.log('Primeros dos animales del refugio:', animalesRefugio.slice(0, 2));

        setRefugio({ ...refugioData, animales: animalesRefugio });
      } catch (err: any) {
        setRefugio(null);
        setError('No se pudo cargar el refugio o sus animales.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!refugio) return <div>{error || 'Refugio no encontrado'}</div>;
  return (
    <>
      <PerfilRefugio refugio={refugio} />
      <button style={{ margin: '18px 0', padding: '10px 22px', background: '#228B22', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }} onClick={handleOpenModal}>
        Dona al refugio
      </button>
      {openModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,139,34,0.15)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleCloseModal}>
          <div className="modal-content" style={{ background: '#fff', padding: 32, borderRadius: 16, maxWidth: 420, width: '90%', boxShadow: '0 4px 24px #228B2288', position: 'relative', border: '3px solid #43a047' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 18, color: '#228B22', fontWeight: 800, fontSize: 26, textAlign: 'center' }}>Datos Bancarios del Refugio</h2>
            {refugio?.banco ? (
              <>
                <div style={{ marginBottom: 10, fontSize: 18 }}><strong>Banco:</strong> {refugio.banco}</div>
                <div style={{ marginBottom: 10, fontSize: 18 }}><strong>Tipo de cuenta:</strong> {refugio.tipo_cuenta || refugio.tipoCuenta || 'No disponible'}</div>
                <div style={{ marginBottom: 10, fontSize: 18 }}><strong>N° Cuenta:</strong> {refugio.numero_cuenta || refugio.numeroCuenta || 'No disponible'}</div>
                <div style={{ marginBottom: 10, fontSize: 18 }}><strong>Nombre titular:</strong> {refugio.titular_cuenta || refugio.titularCuenta || 'No disponible'}</div>
                <div style={{ marginBottom: 10, fontSize: 18 }}><strong>RUT titular:</strong> {refugio.rut_titular || refugio.rutTitular || 'No disponible'}</div>
                <div style={{ marginBottom: 10, fontSize: 18 }}><strong>Email bancario:</strong> {refugio.email_bancario || refugio.emailBancario || refugio.email || 'No disponible'}</div>
                <button onClick={handleCopyAll} style={{ background: '#43a047', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 17, margin: '18px 0 8px 0', cursor: 'pointer', width: '100%' }}>Copiar todos los datos</button>
              </>
            ) : (
              <div>No hay datos bancarios disponibles para este refugio.</div>
            )}
            <button onClick={handleCloseModal} style={{ marginTop: 10, background: '#e3f6ff', color: '#228B22', fontWeight: 600, border: '1.5px solid #43a047', borderRadius: 8, padding: '8px 18px', fontSize: 16, width: '100%', cursor: 'pointer' }}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}
