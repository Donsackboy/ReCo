import React, { useEffect, useState } from "react";
import {
  getDonacionesMedicas,
  registrarDonacionVacuna,
} from "../../Api/ApiRefugio";

// Simulación de función para enviar respuesta (debes implementar en tu API real)
async function responderDonacionMedica(
  donacionId: number,
  fotos: File[],
  comentario: string
) {
  const formData = new FormData();
  fotos.forEach((foto, idx) => formData.append(`foto${idx + 1}`, foto));
  formData.append("comentario", comentario);
  // Obtener token si es necesario
  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";
  const response = await fetch(
    `${API_BASE}/donaciones-medicas/${donacionId}/respuesta/`,
    {
      method: "POST",
      headers: token ? { Authorization: `Token ${token}` } : {},
      body: formData,
    }
  );
  if (!response.ok) throw new Error("Error al enviar respuesta");
  return true;
}

const descartarDonacion = async (
  donacionId: number,
  motivo: string,
  setDonaciones: React.Dispatch<React.SetStateAction<DonacionMedica[]>>
) => {
  if (!window.confirm("¿Seguro que quieres descartar esta donación?")) return;
  try {
    const API_BASE =
      import.meta.env.VITE_API_BASE || "http://localhost:8000/api";
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE}/donaciones-medicas/${donacionId}/descartar/`,
      {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Token ${token}` } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ motivo_descartar: motivo }),
      }
    );
    if (!response.ok) throw new Error("Error al descartar donación");
    // Actualizar estado local eliminando la donación descartada
    setDonaciones((prev) => prev.filter((d) => d.id !== donacionId));
  } catch (err) {
    alert("No se pudo descartar la donación.");
  }
};

interface DonacionMedica {
  id: number;
  monto: number;
  animal: {
    id: number;
    nombre: string;
    foto?: string;
  };
  comprobante_url: string;
  comprobante_refugio_1?: string;
  comprobante_refugio_2?: string;
  comentario: string;
  nombre_vacuna?: string;
  vacuna_nombre?: string;
  usuario_nombre?: string;
  donador_nombre?: string;
  respuesta_refugio?: {
    fotos: string[];
    comentario: string;
  };
  estado_uso: string;
  fecha_creacion: string;
}

const GestionDonacionesMedicas: React.FC = () => {
  const [donaciones, setDonaciones] = useState<DonacionMedica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHistorial, setShowHistorial] = useState(false);
  const [modalDonacion, setModalDonacion] = useState<DonacionMedica | null>(
    null
  );
  const [motivoDescartar, setMotivoDescartar] = useState<string>("");
  const [motivoError, setMotivoError] = useState<string>("");
  const [modalImagen, setModalImagen] = useState<string | null>(null);

  // Obtener la id del refugio desde el usuario logueado
  const getRefugioId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      return user?.refugio?.id_refugio;
    } catch {
      return null;
    }
  };

  const fetchDonaciones = async () => {
    const refugioId = getRefugioId();
    if (!refugioId) {
      setError("Refugio no encontrado");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getDonacionesMedicas(refugioId);
      setDonaciones(data);
    } catch {
      setError("Error al obtener donaciones médicas");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonaciones();
  }, []);

  // Actualiza la donación tras responder, consultando el backend
  const handleRespondido = async () => {
    await fetchDonaciones();
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      {/* Modal global para mostrar imagen grande */}
      {modalImagen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#000000bb",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              background: "transparent",
              borderRadius: 12,
              padding: 0,
            }}
          >
            <button
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#fff",
                color: "#e53935",
                border: "none",
                borderRadius: 20,
                width: 36,
                height: 36,
                fontSize: 22,
                fontWeight: 700,
                cursor: "pointer",
                zIndex: 2,
                boxShadow: "0 2px 8px #0002",
              }}
              aria-label="Cerrar imagen"
              onClick={() => setModalImagen(null)}
            >
              ×
            </button>
            <img
              src={modalImagen}
              alt="Comprobante grande"
              style={{
                maxWidth: "80vw",
                maxHeight: "80vh",
                borderRadius: 12,
                boxShadow: "0 4px 24px #0006",
                background: "#fff",
              }}
            />
          </div>
        </div>
      )}
      <h1
        style={{
          color: "#228B22",
          fontWeight: 800,
          fontSize: 32,
          marginBottom: 18,
        }}
      >
        Donaciones Médicas
      </h1>
      <button
        style={{
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 18px",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
          marginBottom: 18,
        }}
        onClick={() => setShowHistorial(true)}
      >
        Ver historial
      </button>

      {showHistorial && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#00000055",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              maxWidth: 700,
              width: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 4px 24px #1976d233",
              position: "relative",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "#e53935",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 14px",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
              }}
              onClick={() => setShowHistorial(false)}
            >
              Cerrar
            </button>
            <h2
              style={{
                color: "#1976d2",
                fontWeight: 700,
                fontSize: 24,
                marginBottom: 18,
              }}
            >
              Historial de donaciones respondidas y descartadas
            </h2>
            {donaciones.filter(
              (d) =>
                d.estado_uso === "respondida" || d.estado_uso === "descartado"
            ).length === 0 ? (
              <div>No hay donaciones respondidas ni descartadas.</div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                {donaciones
                  .filter(
                    (d) =>
                      d.estado_uso === "respondida" ||
                      d.estado_uso === "descartado"
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.fecha_creacion).getTime() -
                      new Date(a.fecha_creacion).getTime()
                  )
                  .map((donacion) => (
                    <div
                      key={donacion.id}
                      style={{
                        border: "1px solid #e3eaf3",
                        borderRadius: 10,
                        padding: 16,
                        background: "#f8fbfd",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: 18 }}>
                          Animal: {donacion.animal.nombre}
                        </span>
                        <span
                          style={{
                            background:
                              donacion.estado_uso === "respondida"
                                ? "#43ea6b"
                                : "#e53935",
                            color:
                              donacion.estado_uso === "respondida"
                                ? "#145214"
                                : "#fff",
                            fontWeight: 700,
                            borderRadius: 8,
                            padding: "6px 16px",
                            fontSize: "0.98rem",
                            boxShadow: "0 1px 6px #43ea6b22",
                            border:
                              donacion.estado_uso === "respondida"
                                ? "1.5px solid #43ea6b"
                                : "1.5px solid #e53935",
                          }}
                        >
                          {donacion.estado_uso === "respondida"
                            ? "Respondida"
                            : "Descartada"}
                        </span>
                        {modalImagen && (
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100vw",
                              height: "100vh",
                              background: "#000000bb",
                              zIndex: 2000,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                position: "relative",
                                background: "transparent",
                                borderRadius: 12,
                                padding: 0,
                              }}
                            >
                              <button
                                style={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                  background: "#fff",
                                  color: "#e53935",
                                  border: "none",
                                  borderRadius: 20,
                                  width: 36,
                                  height: 36,
                                  fontSize: 22,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  zIndex: 2,
                                  boxShadow: "0 2px 8px #0002",
                                }}
                                aria-label="Cerrar imagen"
                                onClick={() => setModalImagen(null)}
                              >
                                ×
                              </button>
                              <img
                                src={modalImagen}
                                alt="Comprobante grande"
                                style={{
                                  maxWidth: "80vw",
                                  maxHeight: "80vh",
                                  borderRadius: 12,
                                  boxShadow: "0 4px 24px #0006",
                                  background: "#fff",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <strong>Vacuna:</strong>{" "}
                        {donacion.nombre_vacuna || "No especificada"}
                      </div>
                      <div>
                        <strong>Donador:</strong>{" "}
                        {donacion.donador_nombre || "No especificado"}
                      </div>
                      <div>
                        <strong>Monto:</strong> ${donacion.monto}
                      </div>
                      <div>
                        <strong>Comentario:</strong>{" "}
                        {donacion.comentario || "Sin comentario"}
                      </div>
                      <div>
                        <strong>Fecha:</strong>{" "}
                        {donacion.fecha_creacion
                          ? new Date(donacion.fecha_creacion).toLocaleString()
                          : "Sin fecha"}
                      </div>
                      <div style={{ margin: "10px 0" }}>
                        <strong>Comprobante del donador:</strong>
                        <br />
                        {donacion.comprobante_url ? (
                          <img
                            src={donacion.comprobante_url}
                            alt="Comprobante"
                            style={{
                              maxWidth: 180,
                              borderRadius: 8,
                              marginTop: 6,
                            }}
                          />
                        ) : (
                          <span>No disponible</span>
                        )}
                      </div>
                      {donacion.estado_uso === "respondida" &&
                        donacion.respuesta_refugio && (
                          <div style={{ marginTop: 10 }}>
                            <strong>Respuesta del refugio:</strong>
                            <div>
                              {donacion.respuesta_refugio.fotos?.map(
                                (foto, idx) =>
                                  foto ? (
                                    <img
                                      key={idx}
                                      src={foto}
                                      alt={`Respuesta ${idx + 1}`}
                                      style={{
                                        maxWidth: 100,
                                        borderRadius: 6,
                                        marginRight: 8,
                                      }}
                                    />
                                  ) : null
                              )}
                            </div>
                            <div>
                              <strong>Comentario:</strong>{" "}
                              {donacion.respuesta_refugio.comentario ||
                                "Sin comentario"}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de detalles de donación pendiente */}
      {modalDonacion && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#00000055",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              maxWidth: 600,
              width: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 4px 24px #1976d233",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* X fija arriba derecha */}
            <button
              style={{
                position: "absolute",
                top: 18,
                right: 22,
                background: "transparent",
                color: "#888",
                border: "none",
                fontSize: 28,
                fontWeight: 700,
                cursor: "pointer",
                zIndex: 2,
              }}
              aria-label="Cerrar"
              onClick={() => setModalDonacion(null)}
            >
              ×
            </button>
            <h2
              style={{
                color: "#1976d2",
                fontWeight: 700,
                fontSize: 22,
                marginBottom: 18,
              }}
            >
              Detalles de donación para{" "}
              <span style={{ color: "#228B22" }}>
                {modalDonacion.animal.nombre}
              </span>
            </h2>
            <div
              style={{
                display: "flex",
                gap: 18,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              {modalDonacion.animal.foto ? (
                <img
                  src={modalDonacion.animal.foto}
                  alt={modalDonacion.animal.nombre}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "2px solid #e3eaf3",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 120,
                    background: "#eee",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                  }}
                >
                  Sin foto
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>
                  {modalDonacion.animal.nombre}
                </div>
                <div>
                  <strong>Monto:</strong> ${modalDonacion.monto}
                </div>
                <div>
                  <strong>Vacuna:</strong>{" "}
                  <span style={{ color: "#1976d2" }}>
                    {modalDonacion.vacuna_nombre || "No especificada"}
                  </span>
                </div>
                <div>
                  <strong>Donador:</strong>{" "}
                  <span style={{ color: "#1976d2" }}>
                    {modalDonacion.donador_nombre || "No especificado"}
                  </span>
                </div>
                <div>
                  <strong>Comentario:</strong>{" "}
                  {modalDonacion.comentario || "Sin comentario"}
                </div>
                <div>
                  <strong>Fecha:</strong>{" "}
                  {modalDonacion.fecha_creacion
                    ? new Date(modalDonacion.fecha_creacion).toLocaleString()
                    : "Sin fecha"}
                </div>
              </div>
            </div>
            <div style={{ margin: "10px 0" }}>
              <strong>Comprobante del donador:</strong>
              <br />
              {modalDonacion.comprobante_url ? (
                <>
                  <img
                    src={modalDonacion.comprobante_url}
                    alt="Comprobante"
                    style={{
                      maxWidth: 220,
                      borderRadius: 8,
                      marginTop: 6,
                      cursor: "pointer",
                      border: "1.5px solid #1976d2",
                    }}
                    onClick={() =>
                      setModalImagen(modalDonacion.comprobante_url)
                    }
                  />
                  <div style={{ fontSize: 13, color: "#1976d2", marginTop: 4 }}>
                    Haz click en la imagen para ver más grande
                  </div>
                </>
              ) : (
                <span>No disponible</span>
              )}
            </div>

            <strong>Comprobante(s) del refugio:</strong>
            <br />

            <div style={{ marginTop: 1 }}>
              <RespuestaForm
                donacionId={modalDonacion.id}
                onRespondido={() => setModalDonacion(null)}
                setModalImagen={setModalImagen}
              />
            </div>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <input
                  type="text"
                  placeholder="Motivo para descartar"
                  value={motivoDescartar}
                  onChange={(e) => {
                    setMotivoDescartar(e.target.value);
                    setMotivoError("");
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1.5px solid #bdbdbd",
                    width: 240,
                    fontSize: "1rem",
                    marginRight: 0,
                    boxShadow: "0 1px 4px #e3eaf355",
                  }}
                />
                <button
                  style={{
                    background: motivoDescartar.trim() ? "#e53935" : "#ccc",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 22px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: motivoDescartar.trim() ? "pointer" : "not-allowed",
                    boxShadow: motivoDescartar.trim()
                      ? "0 2px 8px #e5393533"
                      : "none",
                    transition: "background 0.2s",
                    marginLeft: 0,
                  }}
                  disabled={!motivoDescartar.trim()}
                  onClick={() => {
                    if (!motivoDescartar.trim()) {
                      setMotivoError(
                        "Debes ingresar un motivo para descartar la donación."
                      );
                      return;
                    }
                    descartarDonacion(
                      modalDonacion.id,
                      motivoDescartar,
                      setDonaciones
                    );
                    setModalDonacion(null);
                  }}
                >
                  Descartar donación
                </button>
              </div>
              {motivoError && (
                <div
                  style={{ color: "#e53935", marginTop: 6, fontWeight: 600 }}
                >
                  {motivoError}
                </div>
              )}
            </div>
            {/* Botón cerrar abajo en gris */}
            <button
              style={{
                marginTop: 28,
                background: "#e3eaf3",
                color: "#333",
                border: "none",
                borderRadius: 8,
                padding: "10px 22px",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                alignSelf: "center",
              }}
              onClick={() => setModalDonacion(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Vista principal: tarjetas compactas de donaciones pendientes */}
      {loading ? (
        <div>Cargando donaciones médicas...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : donaciones.filter(
          (d) => d.estado_uso !== "respondida" && d.estado_uso !== "descartado"
        ).length === 0 ? (
        <div>No hay donaciones médicas pendientes.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {donaciones
            .filter(
              (d) =>
                d.estado_uso !== "respondida" && d.estado_uso !== "descartado"
            )
            .map((donacion) => (
              <div
                key={donacion.id}
                style={{
                  position: "relative",
                  border: "1px solid #e3eaf3",
                  borderRadius: 12,
                  padding: 20,
                  background: "#f8fbfd",
                  boxShadow: "0 2px 8px #1976d233",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  minHeight: 170,
                }}
              >
                {/* Etiqueta pendiente arriba derecha */}
                {donacion.estado_uso === "pendiente" && (
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 18,
                      background: "#ffb300",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: "6px 16px",
                      fontSize: "0.98rem",
                      boxShadow: "0 1px 6px #ffb30022",
                      border: "1.5px solid #ffb300",
                      zIndex: 2,
                    }}
                  >
                    Pendiente
                  </span>
                )}
                {/* Foto principal del animal */}
                {donacion.animal.foto ? (
                  <img
                    src={donacion.animal.foto}
                    alt={donacion.animal.nombre}
                    style={{
                      width: 140,
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 14,
                      border: "2.5px solid #e3eaf3",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 140,
                      height: 140,
                      background: "#eee",
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#aaa",
                    }}
                  >
                    Sin foto
                  </div>
                )}
                <div style={{ flex: 1, position: "relative", height: "100%" }}>
                  <div
                    style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}
                  >
                    {donacion.animal.nombre}
                  </div>
                  <div style={{ marginBottom: 2 }}>
                    <strong>Monto:</strong> ${donacion.monto}
                  </div>
                  <div style={{ marginBottom: 2 }}>
                    <strong>Vacuna donada:</strong>{" "}
                    <span style={{ color: "#1976d2" }}>
                      {donacion.vacuna_nombre || "No especificada"}
                    </span>
                  </div>
                  <button
                    style={{
                      position: "absolute",
                      right: 0,
                      bottom: 0,
                      background: "#1976d2",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 18px",
                      fontWeight: 700,
                      fontSize: "1rem",
                      cursor: "pointer",
                      marginLeft: 12,
                      boxShadow: "0 2px 8px #1976d233",
                    }}
                    onClick={() => {
                      setModalDonacion(donacion);
                      setMotivoDescartar("");
                    }}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

// Formulario para responder donación médica
const RespuestaForm: React.FC<{
  donacionId: number;
  onRespondido: () => void;
  setModalImagen: (url: string) => void;
}> = ({ donacionId, onRespondido, setModalImagen }) => {
  const [fotos, setFotos] = useState<(File | undefined)[]>([]);
  const [previews, setPreviews] = useState<(string | undefined)[]>([]);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Actualiza previsualización cuando cambian las fotos
  useEffect(() => {
    setPreviews(fotos.map((f) => (f ? URL.createObjectURL(f) : undefined)));
    return () => {
      previews.forEach((url) => url && URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line
  }, [fotos]);

  const handleFileChange = (idx: number, file?: File) => {
    setFotos((fotos) => {
      const arr = [...fotos];
      arr[idx] = file;
      return arr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotos[0]) {
      setError("Debes subir al menos una imagen de comprobante.");
      return;
    }
    if (
      !window.confirm(
        "¿Estás seguro de que quieres enviar la respuesta? Los cambios serán permanentes."
      )
    ) {
      return;
    }
    setEnviando(true);
    setError("");
    setSuccess("");
    // Filtrar solo archivos definidos
    const comprobantes = fotos.filter((f) => !!f) as File[];
    try {
      const result = await responderDonacionMedica(
        donacionId,
        comprobantes,
        comentario
      );
      if (result === true) {
        setSuccess("¡Respuesta enviada correctamente!");
        onRespondido();
        setFotos([]);
        setComentario("");
      } else {
        setError("El backend no confirmó el guardado de la respuesta.");
      }
    } catch (err) {
      setError(
        "Error al enviar respuesta. Verifica tu conexión o intenta nuevamente."
      );
    }
    setEnviando(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: 16,
        background: "#e3f6ff",
        padding: 16,
        borderRadius: 8,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <label>
          <strong>
            Agregar imagen de comprobante{" "}
            <span style={{ color: "red" }}>*</span>:
          </strong>
        </label>
        <br />
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => handleFileChange(0, e.target.files?.[0])}
          disabled={enviando}
        />
        {previews[0] && (
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 13, color: "#1976d2" }}>
              Previsualización comprobante 1:
            </span>
            <br />
            <img
              src={previews[0]}
              alt="Previsualización 1"
              style={{
                maxWidth: 120,
                borderRadius: 8,
                marginTop: 4,
                border: "1.5px solid #1976d2",
                cursor: "pointer",
              }}
              onClick={() => setModalImagen(previews[0]!)}
            />
          </div>
        )}
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>
          <strong>Agregar otra imagen (opcional):</strong>
        </label>
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(1, e.target.files?.[0])}
          disabled={enviando}
        />
        {previews[1] && (
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 13, color: "#1976d2" }}>
              Previsualización comprobante 2:
            </span>
            <br />
            <img
              src={previews[1]}
              alt="Previsualización 2"
              style={{
                maxWidth: 120,
                borderRadius: 8,
                marginTop: 4,
                border: "1.5px solid #1976d2",
                cursor: "pointer",
              }}
              onClick={() => setModalImagen(previews[1]!)}
            />
          </div>
        )}
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>
          <strong>Comentario (opcional):</strong>
        </label>
        <br />
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={2}
          style={{ width: "100%", borderRadius: 6, padding: 6 }}
          disabled={enviando}
        />
      </div>
      <button
        type="submit"
        disabled={enviando}
        style={{
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Enviar respuesta
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
    </form>
  );
};

export default GestionDonacionesMedicas;
