import { useNavigate } from 'react-router-dom';
import './AnimalEditPerfil.css';
import { useState, useEffect } from 'react';
import FichaMedicaModal from './FichaMedica/FichaMedicaModal';
import EstructuraPDF from '../../HistorialMedico/EstructuraPDF';
import { updateAnimal, getCirugias } from '../../../api/ApiRefugio';
import { getVacunas, createVacuna, deleteVacuna } from '../../../api/ApiRefugio';
// Tipo local Vacuna
export type Vacuna = {
  id: number;
  nombre: string;
  tipo: string;
  fecha_aplicacion: string;
  fecha_refuerzo?: string;
  observaciones?: string;
  animal: number;
};

// Tipos mínimos para evitar errores
type AnimalType = {
  id_animal?: number;
  nombre?: string;
  edad?: string | number;
  tipo_edad?: string;
  especie?: string;
  descripcion?: string;
  estado?: string;
  sexo?: string;
  tamano?: string;
  fecha_ingreso?: string;
  fecha_cumpleanos?: string;
  ubicacion_actual?: string;
  busca_hogar_temporal?: boolean;
  refugio?: any;
  esterilizado?: boolean;
  desparasitado?: boolean;
  vacunas?: Vacuna[];
  fotos?: string[];
};
type AnimalAdmin = AnimalType & { id_animal: number; };

interface AnimalEditPerfilProps {
  animal: AnimalType | AnimalAdmin;
  onClose: () => void;
  onSave: (updated?: AnimalType | AnimalAdmin) => void;
}


export default function AnimalEditPerfil({ animal, onClose, onSave }: AnimalEditPerfilProps) {
  const navigate = useNavigate();
  // Estado para el modal de ficha médica
  const [fichaModalOpen, setFichaModalOpen] = useState(false);
  const [showPreviewPDF, setShowPreviewPDF] = useState(false);
  const [fichaMedica, setFichaMedica] = useState<any>({
    general: {
      estadoSalud: '',
      peso: '',
      ultimoControl: '',
      veterinario: '',
    },
    vacunas: animal.vacunas || [],
    cirugias: [],
    tratamientos: [],
    alergias: [],
    condicionesCronicas: [],
    recomendaciones: '',
    archivos: [],
  });

  // Solo consulta cirugías cuando se abre el modal, no en cada render ni cambio de animal
  useEffect(() => {
    let isMounted = true;
    setFichaMedica((prev: any) => prev); // No reinicializar vacunas ni ficha médica al abrir/cerrar modal
    async function fetchCirugias() {
      try {
        const token = localStorage.getItem('token');
        if (!token || !animal.id_animal) return;
        const cirugias = await getCirugias(token, animal.id_animal);
        if (isMounted) setFichaMedica((f: any) => ({ ...f, cirugias: Array.isArray(cirugias) ? cirugias : [] }));
      } catch (err) {
        if (isMounted) setFichaMedica((f: any) => ({ ...f, cirugias: [] }));
      }
    }
    fetchCirugias();
    return () => { isMounted = false; };
  }, []); // Solo al montar

  // Estado para edición de animal
  const [form, setForm] = useState({
    nombre: animal.nombre || '',
    edad: animal.edad || '',
  tipo_edad: animal.tipo_edad || 'anios',
    especie: animal.especie || '',
    descripcion: animal.descripcion || '',
    estado: animal.estado || 'disponible',
    sexo: animal.sexo || '',
    tamano: animal.tamano || '',
    fecha_ingreso: animal.fecha_ingreso || '',
    fecha_cumpleanos: animal.fecha_cumpleanos || '',
    ubicacion_actual: animal.ubicacion_actual || 'refugio',
    busca_hogar_temporal: animal.busca_hogar_temporal || false,
    refugio: animal.refugio,
    esterilizado: animal.esterilizado || false,
    desparasitado: animal.desparasitado || false,
    vacunas: (animal.vacunas as Vacuna[]) || [],
    fotos: Array.isArray((animal as any).fotos) ? (animal as any).fotos : [],
    // Campos generales de ficha médica
  estadoSalud: fichaMedica.general?.estadoSalud || '',
  peso: fichaMedica.general?.peso || '',
  ultimoControl: fichaMedica.general?.ultimoControl || '',
  veterinario: fichaMedica.general?.veterinario || '',
  });

  // Estado para la foto actual
  // (ya está declarado, eliminar duplicado si existe más abajo)

  // Mover foto actual a la izquierda
  const handleMoveFotoLeft = () => {
    if (form.fotos.length < 2 || currentFoto === 0) return;
    setForm((f: typeof form) => {
      const fotos = [...f.fotos];
      [fotos[currentFoto - 1], fotos[currentFoto]] = [fotos[currentFoto], fotos[currentFoto - 1]];
      return { ...f, fotos };
    });
    setCurrentFoto((prev: number) => Math.max(0, prev - 1));
  };

  // Mover foto actual a la derecha
  const handleMoveFotoRight = () => {
    if (form.fotos.length < 2 || currentFoto === form.fotos.length - 1) return;
    setForm((f: typeof form) => {
      const fotos = [...f.fotos];
      [fotos[currentFoto + 1], fotos[currentFoto]] = [fotos[currentFoto], fotos[currentFoto + 1]];
      return { ...f, fotos };
    });
    setCurrentFoto((prev: number) => Math.min(form.fotos.length - 1, prev + 1));
  };
  // Eliminar foto del array
  const handleRemoveFoto = (idx: number) => {
    setForm((f: typeof form) => ({ ...f, fotos: f.fotos.filter((_: string, i: number) => i !== idx) }));
    if (idx === currentFoto && currentFoto > 0) setCurrentFoto(currentFoto - 1);
    else if (idx === currentFoto && currentFoto === form.fotos.length - 1) setCurrentFoto(0);
  };

  // Agregar nuevas fotos (máx 3 en total)
  const handleAddFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const restantes = 3 - form.fotos.length;
    const fileArr = Array.from(files).slice(0, restantes);
    const readers = fileArr.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(urls => {
      setForm((f: typeof form) => ({ ...f, fotos: [...(f.fotos || []), ...urls].slice(0, 3) }));
      setCurrentFoto(form.fotos.length); // Muestra la última agregada
    });
  };

  // Carrusel de fotos
  const [currentFoto, setCurrentFoto] = useState(0);
  const handlePrevFoto = () => {
    setCurrentFoto((f: number) => f === 0 ? form.fotos.length - 1 : f - 1);
  };
  const handleNextFoto = () => {
    setCurrentFoto((f: number) => f === form.fotos.length - 1 ? 0 : f + 1);
  };
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const name = target.name;
    const type = target.type;
    const value = target.value;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Elimina handlers locales de vacunas. Usa funciones de ApiRefugio si necesitas manipular vacunas.

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('token') || '';
      // Enviar fechas como null si están vacías
      const dataToSend = {
        ...form,
        fecha_ingreso: form.fecha_ingreso ? form.fecha_ingreso : null,
        fecha_cumpleanos: form.fecha_cumpleanos ? form.fecha_cumpleanos : null,
        tipo_edad: form.tipo_edad,
        // Agregar los datos generales de ficha médica
        estadoSalud: form.estadoSalud,
        peso: form.peso,
        ultimoControl: form.ultimoControl,
        veterinario: form.veterinario,
      };
    await updateAnimal(animal.id_animal ?? 0, dataToSend, token);
      setSuccess(true);
      if (onSave && typeof animal.id_animal === 'number') {
        onSave({
          ...form,
          ...dataToSend,
          id_animal: animal.id_animal,
          fecha_ingreso: dataToSend.fecha_ingreso ?? undefined,
          fecha_cumpleanos: dataToSend.fecha_cumpleanos ?? undefined,
        });
      }
    } catch (err) {
      setError('Error al guardar cambios');
    }
    setLoading(false);
  };

  // Estado para mostrar el modal de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Eliminar animal con confirmación visual
  const handleDeleteAnimal = async () => {
    setShowDeleteModal(true);
  };
  const confirmDeleteAnimal = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/animales/${animal.id_animal ?? 0}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const text = await response.text();
        setError(`Error al eliminar el animal: ${response.status} ${text}`);
        setLoading(false);
        return;
      }
      setSuccess(true);
      if (onSave) onSave();
      onClose();
    } catch (err) {
      setError('Error al eliminar el animal');
    }
    setLoading(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="animal-edit-modal-overlay">
      <div className="animal-edit-modal-card">
        {/* Botón X de cerrar/cancelar arriba a la derecha */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 28,
            background: 'none',
            color: '#e74c3c',
            fontSize: '2.2rem',
            fontWeight: 900,
            border: 'none',
            cursor: 'pointer',
            zIndex: 10001,
            lineHeight: 1
          }}
          aria-label="Cerrar edición"
        >×</button>
  <div className="animal-edit-modal-content">
          <h2 style={{ color: '#145214', marginBottom: 18, textAlign: 'center', fontWeight: 800, letterSpacing: 1.5, fontSize: '2.2rem' }}>Editar Perfil de {form.nombre}</h2>
          <form onSubmit={handleSubmit} style={{ overflowY: 'auto', maxHeight: '70vh' }}>
            {/* FORMULARIO PRINCIPAL */}
            <div className="animal-edit-form-grid">
              {/* Primera fila: Ubicación actual, Nombre, Edad y tipo de edad */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Ubicación actual:</label>
                <select name="ubicacion_actual" value={form.ubicacion_actual} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', background: '#fff' }}>
                  <option value="refugio">Refugio</option>
                  <option value="hogar_temporal">Hogar temporal</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Nombre:</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', boxShadow: '0 1px 6px #90EE9022' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Especie:</label>
                <select name="especie" value={form.especie} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', background: '#fff' }}>
                  <option value="">Selecciona especie</option>
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                  <option value="conejo">Conejo</option>
                  <option value="caballo">Caballo</option>
                  <option value="ave">Ave</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Edad:</label>
                  <input name="edad" value={form.edad} onChange={handleChange} type="number" min="0" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', boxShadow: '0 1px 6px #90EE9022' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Tipo de edad:</label>
                  <select name="tipo_edad" value={form.tipo_edad} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', marginTop: 0 }}>
                    <option value="anios">Años</option>
                    <option value="meses">Meses</option>
                  </select>
                </div>
              </div>
              {/* Segunda fila: Tamaño, Fecha ingreso, Fecha cumpleaños */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Tamaño:</label>
                <select name="tamano" value={form.tamano} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', background: '#fff' }}>
                  <option value="">Selecciona tamaño</option>
                  <option value="Pequeño">Pequeño</option>
                  <option value="Pequeño-Grande">Pequeño-Grande</option>
                  <option value="Mediano">Mediano</option>
                  <option value="Mediano-Grande">Mediano-Grande</option>
                  <option value="Grande">Grande</option>
                  <option value="Gigante">Gigante</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Fecha de ingreso:</label>
                <input name="fecha_ingreso" value={form.fecha_ingreso} onChange={handleChange} type="date" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', boxShadow: '0 1px 6px #90EE9022' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Fecha de cumpleaños (opcional):</label>
                <input name="fecha_cumpleanos" value={form.fecha_cumpleanos} onChange={handleChange} type="date" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', boxShadow: '0 1px 6px #90EE9022' }} />
              </div>
              {/* Salud, esterilizado, desparasitado y botón ficha médica */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1 / span 3' }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Salud:</label>
                <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'nowrap', marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, color: '#145214', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Esterilizado <input type="checkbox" name="esterilizado" checked={!!form.esterilizado} onChange={handleChange} />
                  </label>
                  <label style={{ fontWeight: 500, color: '#145214', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Desparasitado <input type="checkbox" name="desparasitado" checked={!!form.desparasitado} onChange={handleChange} />
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: 10 }}>
                  <button
                    type="button"
                    onClick={() => setFichaModalOpen(true)}
                    style={{
                      background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      padding: '10px 24px',
                      fontWeight: 700,
                      fontSize: '1.08rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px #2193b022',
                      marginTop: 0,
                      alignSelf: 'flex-start',
                    }}
                  >Editar ficha médica</button>
                  <button
                    type="button"
                    onClick={() => {
                      const idAnimal = animal.id_animal ?? (animal as any).id;
                      navigate(`/refugio/historial-medico?id=${encodeURIComponent(idAnimal)}&preview=true`);
                    }}
                    style={{
                      background: 'linear-gradient(90deg, #43ea6b 0%, #2980b9 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      padding: '10px 24px',
                      fontWeight: 700,
                      fontSize: '1.08rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px #2980b922',
                      marginTop: 0,
                      alignSelf: 'flex-start',
                    }}
                  >Ver previsualización ficha médica</button>
                </div>
              </div>
  {/* Modal de ficha médica: renderizado fuera del modal principal para evitar desmontaje por re-render del padre */}
  {fichaModalOpen && (
    <FichaMedicaModal
      animalId={animal.id_animal ?? ''}
      onClose={() => setFichaModalOpen(false)}
      especie={form.especie}
    />
  )}
      {/* Modal de previsualización PDF ficha médica */}
      {showPreviewPDF && (
        <EstructuraPDF animal={{
          id: (animal as any).id ?? animal.id_animal,
          id_animal: animal.id_animal,
          nombre: form.nombre,
          especie: form.especie,
          edad: form.edad?.toString(),
          estado_salud: (form as any).estadoSalud,
          historial: (animal as any).historial ?? [],
          foto_url: Array.isArray(form.fotos) && form.fotos.length > 0 ? form.fotos[0] : undefined,
        }} onClose={() => setShowPreviewPDF(false)} />
      )}
            </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Sexo:</label>
            <select name="sexo" value={form.sexo} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', background: '#fff' }}>
              <option value="">Selecciona sexo</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
        </div>
        <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #90EE90' }} />
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, color: '#145214' }}>Descripción:</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px solid #90EE90', fontSize: '1rem', marginTop: 4, boxShadow: '0 1px 6px #90EE9022' }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, color: '#145214' }}>
            <input type="checkbox" name="busca_hogar_temporal" checked={form.busca_hogar_temporal} onChange={handleChange} style={{ marginRight: 8 }} />
            ¿Busca hogar temporal?
          </label>
        </div>
        <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #90EE90' }} />
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 10, fontSize: '1.3rem', letterSpacing: 1 }}>Vacunas</h3>
          <div style={{ background: 'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)', border: '1.5px solid #90caf9', borderRadius: 12, padding: '14px 16px', marginBottom: 10, color: '#1976d2', fontWeight: 600, fontSize: '1.08rem', boxShadow: '0 2px 8px #90caf922', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span role="img" aria-label="vacuna" style={{ fontSize: '1.5rem', marginRight: 6 }}>💉</span>
            Para agregar o eliminar vacunas, ve a la <span style={{ color: '#1976d2', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>Ficha Médica</span> del animal.
          </div>
          <ul style={{ marginTop: 8 }}>
            {!form.vacunas || form.vacunas.length === 0 ? (
              <li style={{ color: '#888' }}>No hay vacunas registradas.</li>
            ) : (
              form.vacunas.map((v: Vacuna, idx: number) => {
                const nombreVacuna = v.nombre || v.tipo || 'Sin nombre';
                const fechaAplicacion = v.fecha_aplicacion || '-';
                return (
                  <li key={idx} style={{
                    marginBottom: 10,
                    background: '#e3f2fd',
                    border: '1.5px solid #90caf9',
                    borderRadius: 10,
                    padding: '10px 16px',
                    color: '#1976d2',
                    fontWeight: 500,
                    boxShadow: '0 1px 6px #90caf922',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <span role="img" aria-label="vacuna" style={{ fontSize: '1.3rem', marginRight: 8 }}>💉</span>
                    <span style={{ fontWeight: 700 }}>{nombreVacuna}</span>
                    <span style={{ color: '#1976d2', marginLeft: 10 }}>Fecha de aplicación: <span style={{ color: '#145214', fontWeight: 600 }}>{fechaAplicacion}</span></span>
                    {v.tipo === 'unica' && <span style={{ marginLeft: 10, color: '#388e3c', fontWeight: 600, fontSize: '0.98em' }}>(Única aplicación)</span>}
                    {v.tipo === 'refuerzo' && <span style={{ marginLeft: 10, color: '#0288d1', fontWeight: 600, fontSize: '0.98em' }}>Refuerzo: <span style={{ color: '#145214' }}>{v.fecha_refuerzo || '-'}</span></span>}
                  </li>
                );
              })
            )}
          </ul>
        </div>
        <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #90EE90' }} />
        {/* Gestión de fotos con carrusel */}
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ color: '#145214', fontWeight: 700, marginBottom: 10, fontSize: '1.3rem' }}>Fotos del animal</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, marginBottom: 12, width: '100%' }}>
            {!form.fotos || form.fotos.length === 0 ? (
              <div style={{ color: '#888', fontSize: 15 }}>No hay fotos registradas.</div>
            ) : (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: 270, height: 240, borderRadius: 18, boxShadow: '0 2px 12px #90EE9022', border: '2.5px solid #90EE90', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  {/* Left arrow */}
                  {form.fotos.length > 1 && (
                    <button type="button" onClick={handlePrevFoto} style={{ position: 'absolute', left: -80, top: '50%', transform: 'translateY(-50%)', background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, fontWeight: 700, fontSize: '2rem', cursor: 'pointer', boxShadow: '0 1px 6px #43ea6b22', zIndex: 2 }}>{'<'}</button>
                  )}
                  <img
                    src={form.fotos[currentFoto]}
                    alt={`Foto ${currentFoto+1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, transition: 'transform 0.2s', cursor: 'pointer' }}
                    onClick={() => setFullscreenImg(form.fotos[currentFoto])}
                  />
                  <button type="button" onClick={() => handleRemoveFoto(currentFoto)} style={{ position: 'absolute', top: 8, right: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 1px 6px #e74c3c22', transition: 'box-shadow 0.2s', zIndex: 2 }}>×</button>
                  <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#145214', borderRadius: 8, padding: '2px 10px', fontWeight: 600, fontSize: 14, boxShadow: '0 1px 6px #90EE9022', zIndex: 2 }}>{currentFoto+1} / {form.fotos.length}</div>
                  {/* Right arrow */}
                  {form.fotos.length > 1 && (
                    <button type="button" onClick={handleNextFoto} style={{ position: 'absolute', right: -80, top: '50%', transform: 'translateY(-50%)', background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, fontWeight: 700, fontSize: '2rem', cursor: 'pointer', boxShadow: '0 1px 6px #43ea6b22', zIndex: 2 }}>{'>'}</button>
                  )}
                </div>
                {/* Modal de pantalla completa */}
                {fullscreenImg && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100vw',
                      height: '100vh',
                      background: 'rgba(0,0,0,0.85)',
                      zIndex: 10000,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => setFullscreenImg(null)}
                  >
                    <img
                      src={fullscreenImg}
                      alt="Foto animal pantalla completa"
                      style={{
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        borderRadius: 24,
                        boxShadow: '0 4px 32px #000a',
                        border: '4px solid #90EE90',
                      }}
                    />
                    <button
                      onClick={() => setFullscreenImg(null)}
                      style={{
                        position: 'absolute',
                        top: 32,
                        right: 48,
                        background: 'none',
                        color: '#fff',
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 10001,
                        textShadow: '0 2px 8px #000a',
                      }}
                    >×</button>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginBottom: 8 }}>
                  <button type="button" onClick={handleMoveFotoLeft} disabled={currentFoto === 0} style={{ background: currentFoto === 0 ? '#eee' : '#43ea6b', color: currentFoto === 0 ? '#aaa' : '#fff', border: 'none', borderRadius: '8px', padding: '6px 18px', fontWeight: 700, fontSize: '1.08rem', cursor: currentFoto === 0 ? 'not-allowed' : 'pointer', boxShadow: '0 1px 6px #43ea6b22' }}>← Mover</button>
                  <button type="button" onClick={handleMoveFotoRight} disabled={currentFoto === form.fotos.length - 1} style={{ background: currentFoto === form.fotos.length - 1 ? '#eee' : '#43ea6b', color: currentFoto === form.fotos.length - 1 ? '#aaa' : '#fff', border: 'none', borderRadius: '8px', padding: '6px 18px', fontWeight: 700, fontSize: '1.08rem', cursor: currentFoto === form.fotos.length - 1 ? 'not-allowed' : 'pointer', boxShadow: '0 1px 6px #43ea6b22' }}>Mover →</button>
                </div>
              </div>
            )}
            {form.fotos.length < 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <input type="file" accept="image/*" multiple onChange={handleAddFotos} style={{ width: 90, marginBottom: 4 }} />
                <div style={{ fontSize: 13, color: '#888' }}>Agregar foto</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 24, justifyContent: 'center' }}>
          <button type="submit" disabled={loading} style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 38px', fontWeight: 800, fontSize: '1.12rem', cursor: 'pointer', boxShadow: '0 2px 12px #43ea6b33', transition: 'box-shadow 0.2s' }}>Guardar cambios</button>
          <button type="button" onClick={onClose} style={{ background: '#fff', color: '#228B22', border: '2px solid #43ea6b', borderRadius: '12px', padding: '14px 38px', fontWeight: 800, fontSize: '1.12rem', cursor: 'pointer', boxShadow: '0 2px 12px #43ea6b22', transition: 'box-shadow 0.2s' }}>Cancelar</button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 14, textAlign: 'center', fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 14, textAlign: 'center', fontWeight: 600 }}>¡Cambios guardados correctamente!</div>}
      </form>
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(20, 20, 20, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }}>
          <div className="confirm-delete-modal" style={{
            background: '#fff',
            borderRadius: 22,
            boxShadow: '0 12px 48px #228b2244',
            padding: '44px 54px',
            minWidth: 400,
            maxWidth: 520,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
            border: '2.5px solid #e74c3c22',
            position: 'relative'
          }}>
            <span style={{ fontSize: 48, color: '#e74c3c', marginBottom: 8 }}>⚠️</span>
            <h2 style={{ color: '#e74c3c', fontWeight: 900, marginBottom: 8, fontSize: '2rem' }}>¿Eliminar animal?</h2>
            <p style={{ color: '#333', fontSize: '1.15rem', marginBottom: 10 }}>
              Esta acción eliminará el animal y <b>toda su información asociada</b>:
            </p>
            <ul style={{ textAlign: 'left', margin: '18px auto', color: '#145214', fontSize: '1.08rem', lineHeight: 1.7, fontWeight: 600, background: '#f6fff6', borderRadius: 10, padding: '18px 24px', boxShadow: '0 2px 8px #90EE9022', border: '1.5px solid #90EE90' }}>
              <li>Formularios de adopción pendientes y su historial</li>
              <li>Ficha médica</li>
              <li>Vacunas</li>
              <li>Cirugías</li>
              <li>Alergias y condiciones crónicas</li>
            </ul>
            <span style={{ color: '#e74c3c', fontWeight: 800, fontSize: '1.08rem', marginBottom: 8 }}>Esta acción no se puede deshacer.</span>
            <div style={{ display: 'flex', gap: 28, justifyContent: 'center', marginTop: 18 }}>
              <button
                type="button"
                onClick={confirmDeleteAnimal}
                style={{ background: 'linear-gradient(90deg,#e74c3c 60%,#ffb3b3 100%)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 800, fontSize: '1.15rem', cursor: 'pointer', boxShadow: '0 2px 12px #e74c3c33', letterSpacing: 1 }}
              >Eliminar</button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                style={{ background: 'linear-gradient(90deg,#90EE90 60%,#eaffea 100%)', color: '#145214', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 800, fontSize: '1.15rem', cursor: 'pointer', boxShadow: '0 2px 12px #90EE9033', letterSpacing: 1 }}
              >Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {/* Botón para eliminar animal */}
      <button
        type="button"
        onClick={handleDeleteAnimal}
        style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', marginTop: 18 }}
      >
        Eliminar animal
      </button>
    </div>
  </div>
  </div>
  );
}
