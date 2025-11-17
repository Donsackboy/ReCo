import React, { useState } from 'react';
import { vacunasPorEspecie } from '../../../Refugio/pages/MisAnimales/components/FichaMedica/Utils/vacunasEspecies';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const DonarVacuna = () => {
  const query = useQuery();
  const animalId = query.get('animalId');
  const refugio = query.get('refugio');
  const vacunaPreseleccionada = query.get('vacuna');
  const [animal, setAnimal] = useState<any>(null);
  const [vacuna, setVacuna] = useState(vacunaPreseleccionada || '');
  const [monto, setMonto] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [imagen, setImagen] = useState<File | null>(null);
  const [errorImg, setErrorImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Calcular especie y vacunasOpciones después de definir animal
  const especie = animal?.especie ? String(animal.especie).toLowerCase().trim() : '';
  const vacunasOpciones = especie && vacunasPorEspecie[especie] ? vacunasPorEspecie[especie] : [];

  // Si tienes precios en la base de datos, obtén el precio aquí. Por ahora, solo muestra el nombre.
  let precioVacuna = 0;
  if (vacuna) {
    const vacunaObj = vacunasOpciones.find((v: any) => v.nombre === vacuna);
    // Si el objeto tiene precio, úsalo; si no, deja en 0
    precioVacuna = vacunaObj && 'precio' in vacunaObj ? (vacunaObj as any).precio : 0;
  }

  React.useEffect(() => {
    if (!animalId) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE}/public/animales/${animalId}/`)
      .then(res => res.json())
      .then(data => {
        setAnimal({ ...data, id_animal: data.id_animal });
      })
      .catch(() => setAnimal(null))
      .finally(() => setLoading(false));
  }, [animalId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorImg(null);
    // Confirmación antes de enviar
    const confirmar = window.confirm('¿Estás seguro que deseas enviar esta donación?');
    if (!confirmar) return;
    if (!imagen) {
      setErrorImg('Debes subir el pantallazo de la transferencia.');
      return;
    }
    const formData = new FormData();
    formData.append('imagen', imagen);
    formData.append('nombre_vacuna', vacuna);
    formData.append('id_animal', animal?.id_animal || '');
    formData.append('id_refugio', animal?.refugio?.id_refugio || refugio || '');
    formData.append('tipo_vacuna', 'unica'); // O ajustar según selección
    formData.append('fecha_aplicacion', new Date().toISOString().slice(0, 10));
    formData.append('monto', monto || `${precioVacuna}`);
    // Obtener id_usuario del localStorage
    let userId = '';
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      userId = user?.id || user?.id_usuario || '';
    } catch {}
    formData.append('id_usuario', userId);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/registrar_donacion_vacuna/`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Token ${token}` } : {},
        body: formData,
      });
      if (!response.ok) {
        setErrorImg('Error al registrar la donación.');
        return;
      }
      // Cambiar estado a finalizado tras respuesta exitosa
      setEnviado('finalizado');
    } catch (err) {
      setErrorImg('Error de conexión al registrar la donación.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Cargando información del animal...</div>;
  }

  if (enviado) {
    // Obtener nombre del refugio correctamente
    let refugioNombre = '';
    if (animal && animal.refugio) {
      if (typeof animal.refugio === 'object') {
        refugioNombre = animal.refugio.nombre || '';
      } else {
        refugioNombre = animal.refugio;
      }
    } else {
      refugioNombre = refugio || '';
    }
    return (
      <div style={{ maxWidth: '500px', margin: '40px auto', background: '#eaffea', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ color: '#228B22' }}>¡Donación registrada!</h2>
        <p>Tu donación para la vacuna <strong>{vacuna}</strong> está en estado <strong>finalizado</strong>.<br />El refugio <strong>{refugioNombre}</strong> recibirá la notificación en la sección de donaciones de vacunas.</p>
        <div style={{ marginTop: '18px', background: '#fffde7', borderRadius: '10px', padding: '14px', boxShadow: '0 1px 6px #ffe08288', color: '#b8860b', fontWeight: 500, fontSize: '1.01rem' }}>
          Puedes revisar el estado de tu donación y cualquier respuesta, imagen o comentario del refugio sobre la aplicación de la vacuna en la sección <strong>Mis Donaciones</strong>.
        </div>
        <button onClick={() => window.location.href = '/'} style={{ marginTop: '24px', background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22' }}>
          Volver al inicio
        </button>
      </div>
    );
  }

  // Eliminar obtención de token, no se usa

  return (
    <>
      <div style={{ maxWidth: '500px', margin: '40px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
        <h2 style={{ color: '#145214', marginBottom: '18px' }}>Donar vacuna</h2>
        {animal && (
          <div style={{ background: '#eaffea', borderRadius: '12px', padding: '16px', marginBottom: '18px', boxShadow: '0 1px 6px #43ea6b22', display: 'flex', alignItems: 'center', gap: '18px' }}>
            <img src={animal.fotos?.[0] || animal.imagenes?.[0] || '/Images/animales/placeholder.png'} alt={animal.nombre} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 1px 6px #43ea6b22' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#145214' }}>{animal.nombre}</div>
              <div style={{ color: '#228B22', fontSize: '1rem' }}>{animal.sexo} • {animal.edad} años • {animal.tamano}</div>
              <div style={{ color: '#145214', fontSize: '0.98rem' }}>Refugio: {typeof animal.refugio === 'object' ? animal.refugio.nombre : animal.refugio} {animal.refugio?.region ? `(${animal.refugio.region})` : animal.region ? `(${animal.region})` : ''}</div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Selecciona la vacuna a donar</label>
          <select value={vacuna} onChange={e => setVacuna(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }}>
            <option value="">Elige una vacuna</option>
            {vacunasOpciones.map((v: any, idx: number) => (
              <option key={idx} value={v.nombre}>
                {v.nombre} {v.precioReferencial ? `- $${v.precioReferencial}` : ''}
              </option>
            ))}
          </select>
          {vacuna && (
            <>
              <div style={{ background: '#fffde7', borderRadius: '10px', padding: '14px', margin: '10px 0 18px 0', boxShadow: '0 1px 6px #ffe08288', color: '#b8860b', fontWeight: 500, fontSize: '1.01rem' }}>
                Puedes donar parcialmente el valor de la vacuna, pero se recomienda donar el monto completo para que el animal reciba la vacuna y obtengas un feedback (imagen y comentario) cuando se le aplique.
              </div>
              <div style={{ color: '#228B22', fontWeight: 600, fontSize: '1.08rem', marginTop: '8px' }}>
                Precio sugerido: {(() => {
                  const vacunaObj = vacunasOpciones.find((v: any) => v.nombre === vacuna);
                  return vacunaObj && vacunaObj.precioReferencial ? `$${vacunaObj.precioReferencial}` : 'A convenir con el refugio';
                })()}
              </div>
              <div style={{ marginTop: '12px' }}>
                <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Monto a donar</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={monto}
                  onChange={e => setMonto(e.target.value)}
                  placeholder={`Ej: ${vacunasOpciones.find((v: any) => v.nombre === vacuna)?.precioReferencial || ''}`}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }}
                  required
                />
                <div style={{ color: '#b8860b', fontSize: '0.98rem', marginTop: '4px' }}>
                  Puedes ingresar el monto que deseas donar para esta vacuna.<br />
                  <span style={{ color: '#b8860b', fontWeight: 600 }}>
                    <u>Este monto es referencial y debe coincidir con el comprobante de transferencia que subas.</u>
                  </span>
                </div>
              </div>
            </>
          )}
          {/* Datos bancarios para transferencia */}
          <div style={{
            background: 'linear-gradient(135deg, #eaffea 0%, #f0fff4 100%)',
            borderRadius: '16px',
            padding: '22px 24px',
            margin: '18px 0 24px 0',
            boxShadow: '0 4px 18px #43ea6b22',
            color: '#145214',
            fontWeight: 500,
            fontSize: '1.08rem',
            border: '1.5px solid #43ea6b',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>💸</span>
              <span style={{ fontWeight: 700, fontSize: '1.15rem', color: '#228B22' }}>Datos para transferencia bancaria</span>
            </div>
            <div id="datos-transferencia" style={{ lineHeight: '2', fontSize: '1.08rem', marginBottom: '10px' }}>
              <div><span style={{ fontWeight: 600 }}>Banco:</span> <span style={{ color: '#228B22' }}>Banco Estado</span></div>
              <div><span style={{ fontWeight: 600 }}>Tipo de cuenta:</span> <span style={{ color: '#228B22' }}>Cuenta Vista</span></div>
              <div><span style={{ fontWeight: 600 }}>N° de cuenta:</span> <span style={{ color: '#228B22' }}>123456789</span></div>
              <div><span style={{ fontWeight: 600 }}>Rut:</span> <span style={{ color: '#228B22' }}>12.345.678-9</span></div>
              <div><span style={{ fontWeight: 600 }}>Nombre:</span> <span style={{ color: '#228B22' }}>Refugio Animal ReCo</span></div>
              <div><span style={{ fontWeight: 600 }}>Correo:</span> <span style={{ color: '#228B22' }}>donaciones@refugio.cl</span></div>
              <div><span style={{ fontWeight: 600 }}>Comentario:</span> <span style={{ color: '#228B22' }}>Donación vacuna {vacuna || ''} para animal {animal?.nombre || ''}</span></div>
            </div>
            <button type="button" onClick={() => {
              const text = document.getElementById('datos-transferencia')?.innerText;
              if (text) {
                navigator.clipboard.writeText(text);
                  alert('Datos bancarios copiados al portapapeles');
                }
              }} style={{
                marginTop: '10px',
                background: '#43ea6b',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 24px',
                fontWeight: 700,
                fontSize: '1.08rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px #43ea6b22',
                transition: 'background 0.2s'
              }}>
                <span style={{ fontSize: '1.15rem', marginRight: '8px' }}>📋</span>Copiar datos
            </button>
          </div>
          <div style={{ marginTop: '8px' }}>
            <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Sube el pantallazo de tu transferencia</label>
            <input type="file" accept="image/*" onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setImagen(e.target.files[0]);
              }
            }} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }} />
            {errorImg && <div style={{ color: 'red', marginTop: '6px' }}>{errorImg}</div>}
          </div>
          <button type="submit"
            disabled={!imagen}
            style={{ background: !imagen ? '#bdbdbd' : '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 0', fontWeight: 700, fontSize: '1.08rem', cursor: !imagen ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginTop: '12px' }}>
            Donar vacuna
          </button>
        </form>
        {/* Eliminado WebpayDonacion, solo transferencia bancaria */}
      </div>
      {/* Modal de registro removido, ya no se muestra aquí */}
    </>
  );
};

export default DonarVacuna;
