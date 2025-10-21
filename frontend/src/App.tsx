import Header from './components/Header/Header'
import Home from './pages/Home/Home'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Home />
      </main>
    </div>
  )
}

export default App