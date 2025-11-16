// components/Admin/RefugiosAdmin.tsx
import React, { useState, useEffect } from "react";
import type { Refugio, RefugioFormData } from "../../../../types/Refugio";
import { refugioService } from "../../../../services/refugioService";
import RefugioForm from "./RefugioForm";
import RefugioList from "./RefugioList";
import "./RefugiosAdmin.css";

const RefugiosAdmin: React.FC = () => {
  const [refugios, setRefugios] = useState<Refugio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRefugio, setEditingRefugio] = useState<Refugio | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  useEffect(() => {
    loadRefugios();
  }, []);

  const loadRefugios = async () => {
    try {
      setError(null);
      const data = await refugioService.getRefugiosAdmin();
      setRefugios(data);
    } catch (error) {
      console.error("Error loading refugios:", error);
      setError(
        "Error al cargar los refugios. Verifica tu conexión y permisos."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRefugio(null);
    setShowForm(true);
    setError(null);
  };

  const handleEdit = (refugio: Refugio) => {
    setEditingRefugio(refugio);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este refugio?")) {
      try {
        await refugioService.deleteRefugio(id);
        setRefugios(refugios.filter((r) => r.id_refugio !== id));
        setError(null);
      } catch (error) {
        console.error("Error deleting refugio:", error);
        setError("Error al eliminar el refugio.");
      }
    }
  };

  const handleFormSubmit = async (formData: RefugioFormData) => {
    try {
      setError(null);
      if (editingRefugio) {
        const updated = await refugioService.updateRefugio(
          editingRefugio.id_refugio!,
          formData
        );
        setRefugios(
          refugios.map((r) =>
            r.id_refugio === updated.id_refugio ? updated : r
          )
        );
      } else {
        const newRefugio = await refugioService.createRefugio(formData);
        setRefugios([...refugios, newRefugio]);
      }
      setShowForm(false);
      setEditingRefugio(null);
    } catch (error) {
      console.error("Error saving refugio:", error);
      setError(
        "Error al guardar el refugio. Verifica los datos e intenta nuevamente."
      );
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRefugio(null);
    setError(null);
  };

  const handleRetry = () => {
    setLoading(true);
    loadRefugios();
  };

  // Filtrado
  const filteredRefugios = refugios.filter((refugio) => {
    const matchesSearch = refugio.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRegion =
      regionFilter === "" || refugio.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  if (loading) {
    return (
      <div className="refugios-admin-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando refugios...</p>
        </div>
      </div>
    );
  }

  if (error && !showForm) {
    return (
      <div className="refugios-admin-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn-retry" onClick={handleRetry}>
            Reintentar
          </button>
          <button className="btn-create" onClick={handleCreate}>
            Crear Primer Refugio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="refugios-admin-container">
      <div className="admin-header">
        <div className="header-title">
          <h1>Gestión de Refugios</h1>
          <p className="subtitle">
            {refugios.length} refugio{refugios.length !== 1 ? "s" : ""}{" "}
            registrado{refugios.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn-create" onClick={handleCreate}>
          + Crear Nuevo Refugio
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button className="btn-close-error" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {showForm ? (
        <RefugioForm
          refugio={editingRefugio}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <RefugioList
          refugios={filteredRefugios}
          searchTerm={searchTerm}
          regionFilter={regionFilter}
          onSearchChange={setSearchTerm}
          onRegionFilterChange={setRegionFilter}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {!showForm && filteredRefugios.length === 0 && refugios.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h3>No hay refugios registrados</h3>
          <p>Comienza creando el primer refugio en el sistema.</p>
          <button className="btn-create" onClick={handleCreate}>
            Crear Primer Refugio
          </button>
        </div>
      )}

      {!showForm && filteredRefugios.length === 0 && refugios.length > 0 && (
        <div className="no-results-state">
          <div className="no-results-icon">🔍</div>
          <h3>No se encontraron refugios</h3>
          <p>Intenta ajustar los filtros de búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default RefugiosAdmin;
