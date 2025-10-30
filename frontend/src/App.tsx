import Header from './rols/Public/components/Header/Header'
import HeaderAdmin from './rols/Admin/components/HeaderAdmin';
import Home from './rols/Public/pages/Home/Home'
import Footer from './rols/Public/components/Footer/Footer'
import './App.css'
import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('.footer');
      if (!footer) return;
      const scrollY = window.scrollY + window.innerHeight;
      const pageHeight = document.body.offsetHeight;
      if (scrollY >= pageHeight - 50) {
        footer.classList.add('footer-visible');
      } else {
        footer.classList.remove('footer-visible');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Verificar si el usuario logueado es admin
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();

  const isAdmin = user && user.tipo_usuario === 'admin';

  return (
    <div className="app">
      {isAdmin ? (
        <HeaderAdmin adminName={user?.username || 'Admin'} />
      ) : (
        <Header />
      )}
      <main className="main-content">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App