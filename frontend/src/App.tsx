import Header from './rols/Public/components/Header/Header'
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
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App