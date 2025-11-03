import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnimalesCount, getAnimalesCarousel } from '../../../../api.js';
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
            : `Tenemos ${numeroAnimales} animales esperando una familia`}
        </p>
        {/* Carrusel de animales */}
        {animalesCarousel.length > 0 && (
          <div className="carousel-container">
            <button className="carousel-arrow" onClick={handlePrev}>&#8592;</button>
            <div className="carousel-track">
              {animalesCarousel.map((animal, idx) => {
                const pos = idx - carouselIndex;
                // Adaptar datos para AnimalCard
                const animalCardData = {
                  id: animal.id,
                  nombre: animal.nombre,
                  sexo: animal.sexo || '',
                  edad: animal.edad || '',
                  tamano: animal.tamano || '',
                  refugio: animal.refugio || '',
                  region: animal.region || '',
                  diasEnRefugio: animal.diasEnRefugio || 0,
                  imagenes: animal.foto_principal ? [animal.foto_principal] : ['/Images/animales/placeholder.png'],
                  resena: animal.resena || '',
                };
                let style: React.CSSProperties = {
                  zIndex: 5 - Math.abs(pos),
                  position: 'absolute',
                  left: `calc(50% + ${pos * 120}px - 90px)`,
                  top: pos === 0 ? '0px' : '30px',
                  width: pos === 0 ? '320px' : '220px',
                  height: pos === 0 ? '500px' : '340px',
                  opacity: Math.abs(pos) > 2 ? 0 : 1,
                  transition: 'all 0.4s cubic-bezier(.77,.2,.32,1.01)',
                  pointerEvents: Math.abs(pos) > 2 ? 'none' : 'auto',
                };
                // Tarjeta principal (centrada)
                if (pos === 0) {
                  return (
                    <div key={animal.id} style={{...style, height:'400px', width:'320px', display:'flex', alignItems:'center', justifyContent:'center'}} className="carousel-item active">
                      <div style={{display:'flex', flexDirection:'column', alignItems:'center', height:'100%', justifyContent:'space-between', width:'100%'}}>
                        <div style={{position:'absolute', top:0, right:18, background:'#eaffea', color:'#228B22', borderRadius:10, padding:'6px 12px', fontWeight:600, fontSize:'0.95rem'}}>
                          {animal.diasEnRefugio} días en el refugio
                        </div>
                        <img src={animal.foto_principal || '/Images/animales/placeholder.png'} alt={animal.nombre + ' portada'} style={{width:'260px', height:'250px', objectFit:'cover', borderRadius:'18px', margin:'16px auto 0 auto', boxShadow:'0 4px 18px rgba(44,151,69,0.57)', display:'block'}} />
                        <h3 style={{fontSize:'1.2rem', color:'#3e1452ff', margin:'8px 0 0px'}}>{animal.nombre}</h3>
                        <div style={{color:'#228B22', fontSize:'1rem', marginBottom:'8px'}}>{animal.edad} años • {animal.refugio}</div>
                        <Link to={`/animales/${animal.id}`} style={{marginTop:'auto', background:'#43ea6b', color:'#fff', border:'none', borderRadius:'8px', padding:'8px 18px', fontWeight:600, cursor:'pointer', textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', width:'40%', textAlign:'center'}}>
                          <span style={{width:'100%', textAlign:'center', display:'block', whiteSpace:'nowrap'}}>Ver perfil</span>
                        </Link>
                      </div>
                    </div>
                  );
                }
                // Tarjetas laterales
                return (
                  <div key={animal.id} style={style} className="carousel-item">
                    <AnimalCard animal={animalCardData} />
                  </div>
                );
              })}
            </div>
            <button className="carousel-arrow" onClick={handleNext}>&#8594;</button>
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