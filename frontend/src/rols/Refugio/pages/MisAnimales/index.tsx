import React, { useState } from 'react';
import AnimalList from './components/AnimalList';
import AnimalForm from './components/AnimalForm';
import AnimalProfile from './components/AnimalProfile';
import AnimalPhotos from './components/AnimalPhotos';

const MisAnimales: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <h1>Mis Animales</h1>
      <AnimalList />
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 18px #228b2233', padding: 32, minWidth: 350, maxWidth: 420, position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 12, right: 18, color: '#e74c3c', fontWeight: 700, fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            <AnimalForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default MisAnimales;
