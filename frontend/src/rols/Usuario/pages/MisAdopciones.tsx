import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Adopcion {
  id: number;
  animal: string;
  estado: string;
  fecha: string;
}

const MisAdopciones: React.FC = () => {
  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  fetch("/adopciones/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAdopciones(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="mis-adopciones-container">
      <h2>Mis Solicitudes de Adopción</h2>
      {adopciones.length === 0 ? (
        <div className="bandeja-vacia">No se han recibido formularios de adopción.</div>
      ) : (
        <ul className="adopciones-list">
          {adopciones.map((adopcion) => {
            let estadoColor = "#999";
            let estadoTexto = "Pendiente";
            if (adopcion.estado === "aceptada") {
              estadoColor = "#4caf50";
              estadoTexto = "Aceptada";
            } else if (adopcion.estado === "rechazada") {
              estadoColor = "#f44336";
              estadoTexto = "Rechazada";
            }
            return (
              <li key={adopcion.id} className="adopcion-item">
                <strong>Animal:</strong> {adopcion.animal} <br />
                <strong>Estado:</strong> <span style={{ color: estadoColor, fontWeight: "bold" }}>{estadoTexto}</span> <br />
                <strong>Fecha:</strong> {adopcion.fecha}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MisAdopciones;
