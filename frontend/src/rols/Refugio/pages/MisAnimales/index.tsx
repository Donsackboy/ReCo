import React, { useState } from 'react';
import AnimalList from './components/AnimalList';
import AnimalForm from './components/AnimalForm';
import AnimalProfile from './components/AnimalProfile';
import AnimalPhotos from './components/AnimalPhotos';

const MisAnimales: React.FC = () => {
  // Estado para mostrar el formulario, perfil, etc.
  const [view, setView] = useState<'list' | 'form' | 'profile' | 'photos'>('list');

  // Handlers vacíos
  const handleCreate = () => setView('form');
  const handleEdit = () => setView('form');
  const handleViewProfile = () => setView('profile');
  const handleViewPhotos = () => setView('photos');
  const handleBack = () => setView('list');

  return (
    <div>
      <h1>Mis Animales</h1>
      {view === 'list' && <>
        <button onClick={handleCreate}>Crear Animal</button>
        <AnimalList />
      </>}
      {view === 'form' && <>
        <button onClick={handleBack}>Volver</button>
        <AnimalForm />
      </>}
      {view === 'profile' && <>
        <button onClick={handleBack}>Volver</button>
        <AnimalProfile />
      </>}
      {view === 'photos' && <>
        <button onClick={handleBack}>Volver</button>
        <AnimalPhotos />
      </>}
    </div>
  );
};

export default MisAnimales;
