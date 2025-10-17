import React from 'react'
import Header from './components/Header/Header'
import './App.css'

function App() {
  const nombreDelRefugio = 'ReCo'
  const numeroAnimales = 25
  
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <h1>¡Bienvenida a {nombreDelRefugio}! 🐾</h1>
        <p>Tenemos {numeroAnimales} animales esperando una familia</p>
        <button className="btn-primary">Ver Animales</button>
      </main>
    </div>
  )
}

export default App