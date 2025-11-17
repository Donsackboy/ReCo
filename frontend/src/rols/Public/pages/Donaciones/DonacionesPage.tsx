import { Link } from 'react-router-dom';

const DonacionesPage = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
      <h2 style={{ color: '#145214', marginBottom: '18px' }}>Donaciones</h2>
      <div style={{ background: '#d6f5e6', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px', boxShadow: '0 1px 8px #43ea6b22' }}>
        <h3 style={{ color: '#145214', marginBottom: '10px', fontSize: '1.15rem' }}>¿Por qué donar?</h3>
        <ul style={{ color: '#228B22', fontSize: '1.05rem', marginLeft: '18px', marginBottom: '0' }}>
          <li>Tu aporte ayuda a alimentar, cuidar y salvar animales en situación vulnerable.</li>
          <li>Las donaciones monetarias permiten financiar campañas, tratamientos y emergencias.</li>
          <li>Los insumos y servicios donados mejoran la calidad de vida de los animales y el funcionamiento del refugio.</li>
        </ul>
        <div style={{ color: '#145214', marginTop: '12px', fontSize: '0.98rem' }}>
          <b>¡Gracias por tu generosidad!</b>
        </div>
      </div>
      <div style={{ marginBottom: '18px', color: '#228B22', fontSize: '1.08rem', textAlign: 'center' }}>
        Elige el tipo de donación que quieres realizar:
      </div>
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/donar-monetaria" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#eaffea', borderRadius: '14px', padding: '24px', minWidth: '220px', maxWidth: '260px', boxShadow: '0 1px 6px #43ea6b22', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <span role="img" aria-label="monetaria" style={{ fontSize: '2.2rem', marginBottom: '12px' }}>💸</span>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#145214', marginBottom: '6px' }}>Donación Monetaria</div>
            <div style={{ color: '#228B22', fontSize: '0.98rem', textAlign: 'center' }}>Aporta dinero para el refugio, campañas o animales específicos.</div>
          </div>
        </Link>
        <Link to="/donar-insumo" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#eaffea', borderRadius: '14px', padding: '24px', minWidth: '220px', maxWidth: '260px', boxShadow: '0 1px 6px #43ea6b22', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <span role="img" aria-label="insumo" style={{ fontSize: '2.2rem', marginBottom: '12px' }}>📦</span>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#145214', marginBottom: '6px' }}>Donación de Insumos</div>
            <div style={{ color: '#228B22', fontSize: '0.98rem', textAlign: 'center' }}>Comida, ropa, juguetes, medicamentos, etc. Puedes enviar por BlueExpress, Correos, etc.</div>
          </div>
        </Link>
        <Link to="/donar-servicio" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#eaffea', borderRadius: '14px', padding: '24px', minWidth: '220px', maxWidth: '260px', boxShadow: '0 1px 6px #43ea6b22', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <span role="img" aria-label="servicio" style={{ fontSize: '2.2rem', marginBottom: '12px' }}>🤝</span>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#145214', marginBottom: '6px' }}>Donación de Servicios</div>
            <div style={{ color: '#228B22', fontSize: '0.98rem', textAlign: 'center' }}>Ofrece transporte, veterinario, difusión, voluntariado, etc.</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DonacionesPage;
