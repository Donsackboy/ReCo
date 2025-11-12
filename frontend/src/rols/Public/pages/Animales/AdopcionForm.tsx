import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import LoginModal from '../../components/Header/LoginModal';
import RegisterModal from '../../components/Header/RegisterModal';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const preguntas = [
  '¿Ha tenido antes una mascota? ¿Durante cuánto tiempo? ¿Qué pasó con él/ellos?',
  '¿Qué tipo de vivienda tiene (casa, departamento, parcela)?',
  '¿En qué parte viviría el perro? ¿De cuanta superficie podría disfrutar? ¿Lo sacaran a pasear?',
  '¿Planea mudarse en el futuro? ¿Cómo lo haría si tiene una animalito a su cargo?',
  '¿Hay otro tipo de animales en casa?',
  '¿Conoce las tarifas de los veterinarios? ¿Están dispuestos a tener la cartilla de vacunaciones del perro al día, llevarlo al veterinario cuando se muestre enfermo, pagar por tratamientos, operaciones, etc.?',
  '¿Qué tipo de comida le daría y con que frecuencia?',
  '¿Qué piensa de la esterilización de perros domésticos?',
  '¿Por qué se decide por la vía de la adopción y no opta por comprar una mascota?',
  'Solicitamos un seguimiento post adopción. ¿Está usted dispuesto a contarnos, luego de la adopción como se adapta la mascota a su hogar?',
  '¿Piensa adoptar a algún otro perro, perro u otro animal después de este?',
  'Ante una inadaptación o problema de comportamiento en el perro que adopte, ¿qué hará usted?',
  '¿A través de qué medio nos ha conocido (otro adoptante, Instagram, Facebook, etc.)?',
  '¿Qué nombre tiene para el nuevo integrante?'
];

const AdopcionForm = () => {
  // All hooks at the top
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [showLogin, setShowLogin] = useState(!token);
  const [showRegister, setShowRegister] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const query = useQuery();
  const animalId = query.get('animalId');
  const refugio = query.get('refugio');
  const [animal, setAnimal] = useState<any>(null);
  const [animalLoading, setAnimalLoading] = useState(true);
  const [animalError, setAnimalError] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    rolFamilia: '',
    respuestas: Array(preguntas.length).fill(''),
  });
  const [enviado, setEnviado] = useState(false);

  // Effects
  React.useEffect(() => {
    if (!animalId || isNaN(Number(animalId))) {
      setAnimal(null);
      setAnimalLoading(false);
      setAnimalError('ID de animal inválido.');
      return;
    }
    async function fetchAnimal() {
      setAnimalLoading(true);
      setAnimalError('');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/public/animales/${animalId}/`);
        if (!res.ok) {
          setAnimalError('No se pudo cargar el animal.');
          setAnimal(null);
          return;
        }
        const data = await res.json();
        setAnimal({ ...data, id: data.id_animal ?? data.id });
      } catch (err) {
        setAnimal(null);
        setAnimalError('Error de conexión al cargar el animal.');
      } finally {
        setAnimalLoading(false);
      }
    }
    fetchAnimal();
  }, [animalId]);

  React.useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    } catch {
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        nombre: user?.username || '',
        email: user?.email || ''
      }));
    }
  }, [user]);

  // Handlers
  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    if (!localStorage.getItem('token')) {
      setRedirecting(true);
      navigate('/');
    }
  };
  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };
  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleRespuesta = (idx: number, value: string) => {
    const nuevas = [...form.respuestas];
    nuevas[idx] = value;
    setForm({ ...form, respuestas: nuevas });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    if (!token) {
      setShowLogin(true);
      return;
    }
    if (!animalId || isNaN(Number(animalId))) {
      setErrorMsg('No se ha seleccionado un animal válido para la adopción.');
      return;
    }
    // Construir el payload para el backend (incluyendo usuario)
    const payload = {
      nombre: form.nombre,
      direccion: form.direccion,
      fecha_nacimiento: form.fechaNacimiento, // debe ser YYYY-MM-DD
      telefono: form.telefono,
      email: form.email,
      rol_familia: form.rolFamilia,
      respuestas: form.respuestas,
      animal: Number(animalId), // aseguramos que sea un número
      usuario: user?.id // <-- Agregado el id del usuario
    };
    console.log('Payload enviado:', payload);
    try {
      const res = await fetch('http://localhost:8000/api/adopciones/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEnviado(true);
      } else {
        const data = await res.json();
        // Show full error object for debugging
        setErrorMsg(
          typeof data === 'string' ? data :
          data?.detail ? data.detail :
          JSON.stringify(data, null, 2)
        );
      }
    } catch (err) {
      setErrorMsg('Error de conexión al enviar la solicitud.');
    }
  };

  // Conditional returns after all hooks
  if (!animalId || isNaN(Number(animalId)) || animalLoading) {
    return (
      <div style={{ maxWidth: '650px', margin: '40px auto', background: '#fff0f0', borderRadius: '18px', boxShadow: '0 2px 12px #ea434322', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ color: '#228B22' }}>Cargando información del animal...</h2>
        {animalError && (
          <div style={{ color: '#f44336', marginTop: '18px', fontWeight: 600 }}>{animalError}</div>
        )}
      </div>
    );
  }
  if (!animal) {
    return (
      <div style={{ maxWidth: '650px', margin: '40px auto', background: '#fff0f0', borderRadius: '18px', boxShadow: '0 2px 12px #ea434322', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ color: '#f44336' }}>No se ha encontrado el animal seleccionado.</h2>
        {animalError && (
          <div style={{ color: '#f44336', marginTop: '18px', fontWeight: 600 }}>{animalError}</div>
        )}
        <p>Por favor, selecciona un animal desde la página de animales antes de iniciar el proceso de adopción.</p>
        <button style={{ marginTop: '28px', background: '#ea4343', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 32px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #ea434322' }}
          onClick={() => navigate('/animales')}>
          Volver a Animales
        </button>
      </div>
    );
  }
  if (redirecting) {
    return null;
  }
  if (showLogin || showRegister) {
    return (
      <>
        <LoginModal
          isOpen={showLogin}
          onClose={closeModals}
          onSwitchToRegister={switchToRegister}
        />
        <RegisterModal
          isOpen={showRegister}
          onClose={closeModals}
          onSwitchToLogin={switchToLogin}
        />
        <div style={{textAlign:'center',marginTop:40}}>
          <h2 style={{color:'#228B22'}}>Debes iniciar sesión para adoptar</h2>
          <p>Por favor inicia sesión o regístrate para poder completar el formulario de adopción.</p>
        </div>
      </>
    );
  }
  if (enviado) {
    return (
      <div style={{ maxWidth: '650px', margin: '40px auto', background: '#eaffea', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ color: '#228B22' }}>¡Solicitud enviada!</h2>
        <p>Tu solicitud de adopción ha sido enviada al refugio <strong>{refugio}</strong>.<br />Pronto te contactarán para continuar el proceso.</p>
        <button style={{ marginTop: '28px', background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 32px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22' }}
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
      <h2 style={{ color: '#145214', marginBottom: '18px' }}>
        Formulario de adopción para <strong>{animal ? animal.nombre : 'este animal'}</strong>
      </h2>
      {animal && (
        <div style={{ background: '#eaffea', borderRadius: '12px', padding: '16px', marginBottom: '18px', boxShadow: '0 1px 6px #43ea6b22' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <img src={animal.fotos?.[0] || animal.imagen || animal.imagenes?.[0] || '/Images/placeholder.png'} alt={animal.nombre} style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 1px 6px #43ea6b22' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#145214' }}>{animal.nombre}</div>
              <div style={{ color: '#228B22', fontSize: '1.08rem' }}>
                {animal.sexo} • {animal.edad} años • {animal.tamano}
              </div>
              <div style={{ color: '#145214', fontSize: '1rem' }}>
                Refugio: {animal.refugio?.nombre || ''} ({animal.refugio?.region || animal.region || ''})
              </div>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h3 style={{ color: '#145214', marginBottom: '8px' }}>Datos personales</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>Nombre y Apellidos</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>Dirección</label>
            <input name="direccion" value={form.direccion} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>Fecha de Nacimiento</label>
            <input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>Teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>E-mail de Contacto</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>¿Cuál es su rol en la familia?</label>
            <input name="rolFamilia" value={form.rolFamilia} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
        </div>
        <hr style={{ margin: '18px 0', border: 'none', borderTop: '1.5px solid #43ea6b22' }} />
        <h3 style={{ color: '#145214', marginBottom: '8px' }}>Preguntas</h3>
        {preguntas.map((pregunta, idx) => (
          <div key={idx}>
            <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>{idx + 1}. {pregunta}</label>
            <textarea value={form.respuestas[idx]} onChange={e => handleRespuesta(idx, e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', marginTop: '4px', minHeight: '60px' }} />
          </div>
        ))}
        <button type="submit" style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginTop: '12px' }}>Enviar solicitud</button>
      </form>
      {errorMsg && (
        <div style={{ color: '#f44336', background: '#fff0f0', borderRadius: '8px', padding: '10px', marginBottom: '12px', fontWeight: 600 }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
};

export default AdopcionForm;
