
import React from 'react';
import { useParams } from 'react-router-dom';
import PerfilRefugio from '../../components/Refugios/PerfilRefugio';

export default function RefugioPerfil() {
  const { id } = useParams();
  const [refugio, setRefugio] = React.useState<any>(null);
  // Eliminado: animales y setAnimales, no se usan
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setRefugio(null);
      setLoading(false);
      return;
    }
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

        // Filter animals belonging to this refuge and ensure main photo logic
        const animalesRefugio = animalesData.filter((a: any) => {
          if (typeof a.refugio === 'object' && a.refugio !== null && typeof a.refugio.id === 'number') {
            return a.refugio.id === Number(id);
          }
          return a.refugio === Number(id);
        }).map((animal: any) => ({
          ...animal,
          imagenes: (animal.imagenes && animal.imagenes.length > 0)
            ? animal.imagenes
            : (animal.fotos && animal.fotos.length > 0 ? animal.fotos : (animal.imagen ? [animal.imagen] : [])),
          descripcion: animal.descripcion || animal.resena || '',
        }));

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
  return <PerfilRefugio refugio={refugio} />;
}
