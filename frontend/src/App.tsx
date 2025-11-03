
import HeaderPublic from './rols/Public/components/Header/HeaderPublic';
import HeaderAdmin from './rols/Admin/components/Header/HeaderAdmin';
import HeaderRefugio from './rols/Refugio/components/Header/HeaderRefugio';
import HeaderUsuario from './rols/Usuario/components/Header/HeaderUsuario';
import Home from './rols/Public/pages/Home/Home';
import Footer from './rols/Public/components/Footer/Footer';
import { useEffect } from 'react';

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

  const tipoUsuario = user?.tipo_usuario;
  const pathname = window.location.pathname;


  let headerComponent = <HeaderPublic />;
  if (tipoUsuario === 'admin') {
    if (pathname.startsWith('/admin')) {
      headerComponent = <HeaderAdmin adminName={user?.username || 'Admin'} />;
    } else {
      headerComponent = <HeaderPublic />;
    }
  } else if (tipoUsuario === 'refugio') {
    headerComponent = <HeaderRefugio refugioNombre={user?.username || 'Refugio'} />;
  } else if (tipoUsuario === 'usuario') {
    headerComponent = <HeaderUsuario userName={user?.username || 'Usuario'} />;
  }

  // Detectar si el header es fijo (solo admin en modo admin)
  const isHeaderFixed = tipoUsuario === 'admin' && pathname.startsWith('/admin');
  return (
    <div
      className="app-main-layout"
      style={isHeaderFixed ? { paddingTop: '70px', minHeight: '100vh', display: 'flex', flexDirection: 'column' } : { minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {headerComponent}
      <div style={{ flex: 1 }}>
        <main className="main-content">
          <Home />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App