// components/Admin/RefugioForm.tsx
import React, { useState, useEffect } from "react";
import type { Refugio, RefugioFormData } from "../../../../types/Refugio";

interface RefugioFormProps {
  refugio?: Refugio | null;
  onSubmit: (data: RefugioFormData) => void;
  onCancel: () => void;
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

const RefugioForm: React.FC<RefugioFormProps> = ({
  refugio,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<RefugioFormData>({
    nombre: "",
    direccion: "",
    correo_contacto: "",
    telefono: "",
    descripcion: "",
    latitud: "",
    longitud: "",
    direccion_completa: "",
    comuna: "",
    region: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (refugio) {
      setFormData({
        nombre: refugio.nombre || "",
        direccion: refugio.direccion || "",
        correo_contacto: refugio.correo_contacto || "",
        telefono: refugio.telefono || "",
        descripcion: refugio.descripcion || "",
        latitud: refugio.latitud?.toString() || "",
        longitud: refugio.longitud?.toString() || "",
        direccion_completa: refugio.direccion_completa || "",
        comuna: refugio.comuna || "",
        region: refugio.region || "",
      });
    }
  }, [refugio]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.direccion.trim())
      newErrors.direccion = "La dirección es requerida";
    if (!formData.correo_contacto.trim())
      newErrors.correo_contacto = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.correo_contacto))
      newErrors.correo_contacto = "Correo inválido";
    if (!formData.telefono.trim())
      newErrors.telefono = "El teléfono es requerido";
    if (!formData.descripcion.trim())
      newErrors.descripcion = "La descripción es requerida";
    if (!formData.comuna.trim()) newErrors.comuna = "La comuna es requerida";
    if (!formData.region.trim()) newErrors.region = "La región es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="refugio-form-container">
      <h2>{refugio ? "Editar Refugio" : "Crear Nuevo Refugio"}</h2>

      <form onSubmit={handleSubmit} className="refugio-form">
        {/* Nombre y Correo */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Refugio *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? "error" : ""}
              placeholder="Ej: Refugio Esperanza"
            />
            {errors.nombre && (
              <span className="error-message">{errors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="correo_contacto">Correo de Contacto *</label>
            <input
              type="email"
              id="correo_contacto"
              name="correo_contacto"
              value={formData.correo_contacto}
              onChange={handleChange}
              className={errors.correo_contacto ? "error" : ""}
              placeholder="ejemplo@refugio.com"
            />
            {errors.correo_contacto && (
              <span className="error-message">{errors.correo_contacto}</span>
            )}
          </div>
        </div>

        {/* Teléfono y Región */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefono">Teléfono *</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={errors.telefono ? "error" : ""}
              placeholder="+56 9 1234 5678"
            />
            {errors.telefono && (
              <span className="error-message">{errors.telefono}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="region">Región *</label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={errors.region ? "error" : ""}
            >
              <option value="">Selecciona una región</option>
              {regiones.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.region && (
              <span className="error-message">{errors.region}</span>
            )}
          </div>
        </div>

        {/* Dirección */}
        <div className="form-group">
          <label htmlFor="direccion">Dirección *</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className={errors.direccion ? "error" : ""}
            placeholder="Calle Principal #123"
          />
          {errors.direccion && (
            <span className="error-message">{errors.direccion}</span>
          )}
        </div>

        {/* Dirección Completa */}
        <div className="form-group">
          <label htmlFor="direccion_completa">Dirección Completa</label>
          <input
            type="text"
            id="direccion_completa"
            name="direccion_completa"
            value={formData.direccion_completa}
            onChange={handleChange}
            placeholder="Calle, número, departamento, referencias..."
          />
        </div>

        {/* Comuna y Coordenadas */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="comuna">Comuna *</label>
            <input
              type="text"
              id="comuna"
              name="comuna"
              value={formData.comuna}
              onChange={handleChange}
              className={errors.comuna ? "error" : ""}
              placeholder="Ej: Providencia"
            />
            {errors.comuna && (
              <span className="error-message">{errors.comuna}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="latitud">Latitud</label>
            <input
              type="number"
              step="any"
              id="latitud"
              name="latitud"
              value={formData.latitud}
              onChange={handleChange}
              placeholder="-33.448890"
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitud">Longitud</label>
            <input
              type="number"
              step="any"
              id="longitud"
              name="longitud"
              value={formData.longitud}
              onChange={handleChange}
              placeholder="-70.669265"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="descripcion">Descripción *</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            className={errors.descripcion ? "error" : ""}
            placeholder="Describe los servicios, misión y visión del refugio..."
          />
          {errors.descripcion && (
            <span className="error-message">{errors.descripcion}</span>
          )}
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            {refugio ? "Actualizar" : "Crear"} Refugio
          </button>
        </div>
      </form>
    </div>
  );
};

export default RefugioForm;
