
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnimales } from '../../../../api.js';
import './Home.css';

const eventos = [
  { id: 1, titulo: 'Jornada de Adopción', fecha: '10 Nov', descripcion: 'Ven a conocer a nuestros peluditos y encuentra a tu compañero.', imagen: '/Images/eventos/adopcion.jpg' },
  { id: 2, titulo: 'Charla: Tenencia Responsable', fecha: '15 Nov', descripcion: 'Aprende sobre el compromiso de adoptar y cuidar.', imagen: '/Images/eventos/charla.jpg' },
  { id: 3, titulo: 'Fiesta Canina', fecha: '20 Nov', descripcion: 'Un día de juegos y diversión para toda la familia.', imagen: '/Images/eventos/fiesta.jpg' },
];

function Home() {
  const nombreDelRefugio = 'ReCo';
  const [numeroAnimales, setNumeroAnimales] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    getAnimales(token).then((data: any) => {
      setNumeroAnimales(Array.isArray(data) ? data.length : 0);
    }).catch(() => setNumeroAnimales(null));
  }, []);

  return (
    <div className="home">
      <section className="hero-section">
        <h1>¡Bienvenida a {nombreDelRefugio}! 🐾</h1>
        <p>
          {numeroAnimales === null
            ? 'Cargando animales...'
            : `Tenemos ${numeroAnimales} animales esperando una familia`}
        </p>
        <Link to="/animales" className="btn-primary">Ver Animales</Link>
        <Link to="/postulacion-refugio" className="btn-secondary" style={{marginLeft:16, background:'#7b1fa2', color:'#fff', padding:'10px 22px', borderRadius:8, fontWeight:700, textDecoration:'none'}}>¿Tu refugio quiere ser parte?</Link>
      </section>

      <section className="info-section">
        <h2>¿Quiénes pueden postular?</h2>
        <div className="info-cards">
          <div className="info-card">
            <span className="info-icon">👨‍👩‍👧‍👦</span>
            <div>
              <strong>Familias responsables</strong>
              <p>Personas mayores de edad, con compromiso y amor por los animales.</p>
            </div>
          </div>
          <div className="info-card">
            <span className="info-icon">🏡</span>
            <div>
              <strong>Hogar adecuado</strong>
              <p>Espacio seguro y tiempo para dedicar a la adaptación del animal.</p>
            </div>
          </div>
          <div className="info-card">
            <span className="info-icon">📝</span>
            <div>
              <strong>Compromiso real</strong>
              <p>La adopción no es para devolver al animal, sino para integrarlo a tu familia.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="advice-section">
        <h2>Información a considerar</h2>
        <ul className="advice-list">
          <li>🐶 Los animalitos pueden demorar en adaptarse a un nuevo hogar.</li>
          <li>😢 Es normal que lloren o estén nerviosos los primeros días.</li>
          <li>💚 La paciencia y el cariño son clave para su bienestar.</li>
          <li>🚫 La adopción es un compromiso, no una prueba temporal.</li>
        </ul>
      </section>

      <section className="event-section">
        <h2>Próximos eventos</h2>
        <div className="event-cards">
          {eventos.map(ev => (
            <div className="event-card" key={ev.id}>
              <img src={ev.imagen} alt={ev.titulo} className="event-img" />
              <div className="event-info">
                <span className="event-date">{ev.fecha}</span>
                <h3>{ev.titulo}</h3>
                <p>{ev.descripcion}</p>
                <Link to="/eventos" className="event-link">Ver más eventos</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="donation-section">
        <h2>¿Quieres ayudar?</h2>
        <div className="donation-info">
          <span className="donation-icon">💸</span>
          <p>Tu donación permite que más animales reciban atención, alimento y cariño mientras esperan una familia. ¡Cada aporte cuenta!</p>
          <Link to="/donaciones" className="btn-donation">Ir a Donaciones</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;