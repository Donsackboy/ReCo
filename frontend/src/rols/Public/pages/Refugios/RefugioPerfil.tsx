import React from 'react';
import { useParams } from 'react-router-dom';

import PerfilRefugio from '../../components/Refugios/PerfilRefugio';

export default function RefugioPerfil() {
  const { id } = useParams();
  const [refugio, setRefugio] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Validar que el id existe y es un número
    if (!id || isNaN(Number(id))) {
      setRefugio(null);
      setLoading(false);
      return;
    }
    async function fetchRefugio() {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/public/refugios/${id}/`);
        if (!res.ok) throw new Error('No se pudo cargar el refugio');
        const data = await res.json();
        setRefugio(data);
      } catch (err) {
        setRefugio(null);
      } finally {
        setLoading(false);
      }
    }
    fetchRefugio();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!refugio) return <div>Refugio no encontrado</div>;
  return <PerfilRefugio refugio={refugio} />;
}
