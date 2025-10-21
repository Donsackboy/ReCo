import Header from '../../components/Header/Header'
import './Home.css'

function Home() {
  const nombreDelRefugio = 'ReCo'
  const numeroAnimales = 25

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="home">
          <section className="hero-section">
            <h1>¡Bienvenida a {nombreDelRefugio}! 🐾</h1>
            <p>Tenemos {numeroAnimales} animales esperando una familia</p>
            <button className="btn-primary">Ver Animales</button>
          </section>
          
          <section className="intro-section">
            <h2>Conectando refugios con familias amorosas</h2>
            <p>En ReCo, facilitamos la adopción responsable y conectamos refugios de animales con familias que buscan dar amor y cuidado a una mascota.</p>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home