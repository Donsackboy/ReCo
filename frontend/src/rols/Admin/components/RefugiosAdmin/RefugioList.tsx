// components/Admin/RefugioList.tsx
import React from "react";
import type { Refugio } from "../../../../types/Refugio";

interface RefugioListProps {
  refugios: Refugio[];
  searchTerm: string;
  regionFilter: string;
  onSearchChange: (value: string) => void;
  onRegionFilterChange: (value: string) => void;
  onEdit: (refugio: Refugio) => void;
  onDelete: (id: number) => void;
}

const regiones = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
];

const RefugioList: React.FC<RefugioListProps> = ({
  refugios,
  searchTerm,
  regionFilter,
  onSearchChange,
  onRegionFilterChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="refugio-list-container">
      {/* Filtros */}
      <div className="filters-container">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Buscar refugio..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="region-filter">
          <select
            value={regionFilter}
            onChange={(e) => onRegionFilterChange(e.target.value)}
            className="region-select"
          >
            <option value="">Todas las regiones</option>
            {regiones.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de refugios */}
      <div className="refugios-grid">
        {refugios.length === 0 ? (
          <div className="no-results">No se encontraron refugios</div>
        ) : (
          refugios.map((refugio) => (
            <div key={refugio.id_refugio} className="refugio-card-admin">
              <div className="refugio-card-header">
                <h3>{refugio.nombre}</h3>
                <div className="refugio-actions">
                  <button onClick={() => onEdit(refugio)} className="btn-edit">
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(refugio.id_refugio!)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="refugio-details">
                <p>
                  <strong>Región:</strong> {refugio.region}
                </p>
                <p>
                  <strong>Comuna:</strong> {refugio.comuna}
                </p>
                <p>
                  <strong>Dirección:</strong> {refugio.direccion}
                </p>
                <p>
                  <strong>Teléfono:</strong> {refugio.telefono}
                </p>
                <p>
                  <strong>Email:</strong> {refugio.correo_contacto}
                </p>
                <p>
                  <strong>Descripción:</strong> {refugio.descripcion}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RefugioList;
