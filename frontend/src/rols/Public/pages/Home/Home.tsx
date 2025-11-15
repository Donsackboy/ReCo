import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnimalesCount, getAnimalesCarousel } from '../../Api/ApiPublic.js';
import AnimalCard from '../../components/Animales/AnimalCard';
import './Home.css';

const eventos = [
  { id: 1, titulo: 'Jornada de Adopción', fecha: '10 Nov', descripcion: 'Ven a conocer a nuestros peluditos y encuentra a tu nuevo mejor amigo.', imagen: '/Images/eventos/jornada.jpg' },
  { id: 2, titulo: 'Charla: Tenencia Responsable', fecha: '15 Nov', descripcion: 'Aprende sobre el compromiso de adoptar y cuidar.', imagen: '/Images/eventos/charla.jpg' },
  { id: 3, titulo: 'Fiesta Canina', fecha: '20 Nov', descripcion: 'Un día de juegos y diversión para toda la familia.', imagen: '/Images/eventos/fiesta.jpg' },
];

function Home() {
  const nombreDelRefugio = 'ReCo';
  const [numeroAnimales, setNumeroAnimales] = useState<number | null>(null);
  const [animalesCarousel, setAnimalesCarousel] = useState<any[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(2); // El central

  useEffect(() => {
    getAnimalesCount()
      .then((count: number) => setNumeroAnimales(count))
      .catch(() => setNumeroAnimales(null));
    getAnimalesCarousel()
  .then((data: any[]) => setAnimalesCarousel(data))
      .catch(() => setAnimalesCarousel([]));
  }, []);

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? animalesCarousel.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCarouselIndex((prev) => (prev === animalesCarousel.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="home">
      <section className="hero-section">
        <h1>¡Bienvenida a {nombreDelRefugio}! 🐾</h1>
        <p>
          {numeroAnimales === null
            ? 'Cargando animales...'
            : ` ${numeroAnimales} peluditos esperando una familia`}
        </p>
        {/* Carrusel simple de animales */}
        {animalesCarousel.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'nowrap', margin: '32px 0' }}>
            {animalesCarousel.slice(0, 4).map((animal) => {
              const animalCardData = {
                id: animal.id,
                nombre: animal.nombre,
                sexo: animal.sexo || '',
                edad: animal.edad || '',
                tipo_edad: animal.tipo_edad || '',
                tamano: animal.tamano || '',
                refugio: animal.refugio || '',
                region: animal.region || '',
                diasEnRefugio: animal.diasEnRefugio || 0,
                imagenes: animal.foto_principal ? [animal.foto_principal] : ['/Images/animales/placeholder.png'],
                resena: animal.resena || '',
              };
              return (
                <div key={animal.id} style={{ minWidth: '300px', maxWidth: '340px', flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
                  <AnimalCard animal={animalCardData} />
                </div>
              );
            })}
          </div>
        )}
        <Link to="/animales" className="btn-primary" style={{marginTop:'2.5rem'}}>Ver Animales</Link>
      </section>

      {/* Tarjeta especial para postulación de refugios */}
      <section className="refugio-apply-section">
        <div className="refugio-apply-card">
          <h2>¿Tu refugio quiere ser parte?</h2>
          <p>
            Si tienes un refugio y quieres sumarte a ReCo, puedes rellenar un formulario para que tus animales sean parte de nuestra red y reciban más visibilidad y apoyo.
          </p>
          <ul>
            <li>✔️ Refugios legalmente constituidos, en proceso de formalización, o grupos con entre 15 y 20 animales bajo cuidado.</li>
            <li>✔️ Compromiso con el bienestar animal y la adopción responsable.</li>
            <li>✔️ Disposición para colaborar y compartir información de los animales.</li>
          </ul>
          <p style={{marginTop:8}}>El formulario será evaluado por el equipo de ReCo. Posteriormente, la persona responsable será contactada para confirmar ciertos detalles y continuar el proceso.</p>
          <Link to="/postulacion-refugio" className="btn-secondary" style={{background:'#7b1fa2', color:'#fff', padding:'10px 22px', borderRadius:8, fontWeight:700, textDecoration:'none', display:'inline-block', marginTop:16}}>Rellenar formulario</Link>
        </div>
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