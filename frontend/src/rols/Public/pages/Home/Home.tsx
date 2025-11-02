import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  const nombreDelRefugio = 'ReCo'
  const numeroAnimales = 25

  return (
    <div className="home">
      <section className="hero-section">
        <h1>¡Bienvenida a {nombreDelRefugio}! 🐾</h1>
        <p>Tenemos {numeroAnimales} animales esperando una familia</p>
        <Link to="/animales" className="btn-primary">Ver Animales</Link>
        <Link to="/postulacion-refugio" className="btn-secondary" style={{marginLeft:16, background:'#7b1fa2', color:'#fff', padding:'10px 22px', borderRadius:8, fontWeight:700, textDecoration:'none'}}>¿Tu refugio quiere ser parte?</Link>
      </section>
      <section className="intro-section">
        <h2>Conectando refugios con familias amorosas</h2>
        <p>En ReCo, facilitamos la adopción responsable y conectamos refugios de animales con familias que buscan dar amor y cuidado a un peludito.</p>
      </section>
    </div>
  )
}

export default Home