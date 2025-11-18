import React, { useState, useEffect } from "react";
import "./FichaMedica.css";
import GeneralSection from "./GeneralSection/GeneralSection";
// Si necesitas el tipo FichaMedica, defínelo aquí o impórtalo de un archivo de tipos
import {
  updateFichaMedica,
  getVacunas,
  createVacuna,
  updateVacuna,
  deleteVacuna,
  getCirugias,
  createCirugia,
  updateCirugia,
  deleteCirugia,
} from "../../../../Api/ApiRefugio";
import VacunasSection from "./Vacunas/VacunasSection";
import CirugiasSection from "./Cirugias/CirugiasSection";
import type { Cirugia } from "./Cirugias/CirugiaForm";
import TratamientosSection from "./Tratamientos/TratamientosSection";
import AlergiasCondicionesSection from "./AlegiasyCondicionesCronicas/AlegiasCondicionesSection";

interface FichaMedicaModalProps {
  animalId: number | string;
  onClose: () => void;
  especie?: string;
}

const FichaMedicaModal: React.FC<FichaMedicaModalProps> = ({
  animalId,
  onClose,
  especie,
}) => {
  const [vacunas, setVacunas] = useState<any[]>([]);
  const [vacunasEliminadas, setVacunasEliminadas] = useState<number[]>([]);
  useEffect(() => {
    let isMounted = true;
    async function fetchVacunas() {
      try {
        const token = localStorage.getItem("token") || "";
        const data = await getVacunas(token, Number(animalId));
        if (isMounted && vacunas.length === 0) setVacunas(data);
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchVacunas();
    return () => {
      isMounted = false;
    };
  }, [animalId]);
  const [cirugias, setCirugias] = useState<Cirugia[]>([]);
  const [form, setForm] = useState<any>({
    tratamientos: Array.isArray([]) ? [] : [],
    alergias: Array.isArray([]) ? [] : [],
    archivos: Array.isArray([]) ? [] : [],
  });
  const [ficha, setFicha] = useState<any>({
    estado_salud: "",
    peso_actual: "",
    fecha_ultimo_control: "",
    veterinario_responsable: "",
    clinica: "",
    recomendaciones: "",
    observaciones: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token") || "";
      // --- VACUNAS CRUD ---
      const vacunasOriginales = await getVacunas(token, Number(animalId));
      const vacunasOriginalesIds = vacunasOriginales.map((v: any) => v.id);
      // Eliminar vacunas marcadas para eliminar
      for (const id of vacunasEliminadas) {
        await deleteVacuna(token, Number(animalId), id);
      }
      // Crear nuevas vacunas (sin id de backend)
      const vacunasNuevas = vacunas.filter(
        (v: any) => !vacunasOriginalesIds.includes(v.id)
      );
      for (const v of vacunasNuevas) {
        // Construir payload correcto
        const payload: any = { ...v, animal: Number(animalId) };
        delete payload.id;
        // fecha_refuerzo solo si tiene valor y formato correcto
        if (
          !payload.fecha_refuerzo ||
          String(payload.fecha_refuerzo).trim() === ""
        ) {
          delete payload.fecha_refuerzo;
        }
        await createVacuna(token, Number(animalId), payload);
      }
      // Editar vacunas existentes
      const vacunasEditadas = vacunas.filter((v: any) =>
        vacunasOriginalesIds.includes(v.id)
      );
      for (const v of vacunasEditadas) {
        const original = vacunasOriginales.find((o: any) => o.id === v.id);
        if (original && JSON.stringify(v) !== JSON.stringify(original)) {
          const payload = { ...v };
          delete payload.id;
          await updateVacuna(token, Number(animalId), v.id, payload);
        }
      }

      // --- CIRUGIAS CRUD ---
      const cirugiasOriginales = await getCirugias(token, Number(animalId));
      const cirugiasOriginalesIds = cirugiasOriginales.map(
        (c: any) => c.id_cirugia
      );
      const cirugiasNuevasIds = cirugias.map((c: any) => c.id_cirugia);
      const cirugiasEliminadas = cirugiasOriginales.filter(
        (c: any) => !cirugiasNuevasIds.includes(c.id_cirugia)
      );
      const cirugiasNuevas = cirugias.filter(
        (c: any) => !cirugiasOriginalesIds.includes(c.id_cirugia)
      );
      const cirugiasEditadas = cirugias.filter((c: any) =>
        cirugiasOriginalesIds.includes(c.id_cirugia)
      );
      for (const c of cirugiasEliminadas) {
        await deleteCirugia(c.id_cirugia, token);
      }
      for (const c of cirugiasNuevas) {
        // Solo enviar campos válidos y no id_cirugia, id_animal como número
        const { id_cirugia, ...rest } = c;
        const validKeys = [
          "id_animal",
          "tipo",
          "otro_nombre",
          "motivo",
          "fecha",
          "costo",
          "veterinario",
          "observaciones",
          "pago_estado",
          "monto_pagado",
          "adjunto",
        ];
        let payload: any = Object.fromEntries(
          Object.entries(rest).filter(
            ([k, v]) => v !== undefined && v !== null && validKeys.includes(k)
          )
        );
        if (typeof payload.id_animal !== "number") {
          payload.id_animal = Number(c.id_animal);
        }
        // Si adjunto es un File, usar FormData
        if (
          payload.adjunto &&
          typeof payload.adjunto === "object" &&
          payload.adjunto instanceof File
        ) {
          const formData = new FormData();
          Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (value instanceof File) {
                formData.append(key, value);
              } else {
                formData.append(key, String(value));
              }
            }
          });
          await createCirugia(formData, token);
        } else {
          await createCirugia(payload, token);
        }
      }
      for (const c of cirugiasEditadas) {
        const original = cirugiasOriginales.find(
          (o: any) => o.id_cirugia === c.id_cirugia
        );
        if (original && JSON.stringify(c) !== JSON.stringify(original)) {
          const { id_cirugia, ...rest } = c;
          const validKeys = [
            "id_animal",
            "tipo",
            "otro_nombre",
            "motivo",
            "fecha",
            "costo",
            "veterinario",
            "observaciones",
            "pago_estado",
            "monto_pagado",
            "adjunto",
          ];
          let payload: any = Object.fromEntries(
            Object.entries(rest).filter(
              ([k, v]) => v !== undefined && v !== null && validKeys.includes(k)
            )
          );
          if (typeof payload.id_animal !== "number") {
            payload.id_animal = Number(c.id_animal);
          }
          if (typeof c.id_cirugia === "number") {
            if (
              payload.adjunto &&
              typeof payload.adjunto === "object" &&
              payload.adjunto instanceof File
            ) {
              const formData = new FormData();
              Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                  if (value instanceof File) {
                    formData.append(key, value);
                  } else {
                    formData.append(key, String(value));
                  }
                }
              });
              await updateCirugia(c.id_cirugia, formData, token);
            } else {
              await updateCirugia(c.id_cirugia, payload, token);
            }
          }
        }
      }

      // --- FICHA MEDICA ---
      const fichaCompleta = {
        ...ficha,
        tratamientos: form.tratamientos,
        alergias: form.alergias,
        archivos: form.archivos,
      };
      await updateFichaMedica(token, Number(animalId), fichaCompleta);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      setError("Error al guardar ficha médica");
    }
    setLoading(false);
  };

  return (
    <div className="ficha-overlay">
      <div className="ficha-modal">
        <div className="ficha-medica-content">
          <h2 className="ficha-title">Ficha Médica del Animal</h2>

          <GeneralSection
            animalId={Number(animalId)}
            token={localStorage.getItem("token") || ""}
            ficha={ficha}
            setFicha={setFicha}
          />

          <VacunasSection
            especie={especie ?? ""}
            vacunas={vacunas}
            setVacunas={setVacunas}
            vacunasEliminadas={vacunasEliminadas}
            setVacunasEliminadas={setVacunasEliminadas}
          />

          {/* <CirugiasSection
            cirugias={cirugias}
            setCirugias={setCirugias}
            animalId={Number(animalId)}
            especie={especie}
          /> */}

          {/* <TratamientosSection tratamientos={form.tratamientos} setTratamientos={t => setForm((f: typeof form) => ({ ...f, tratamientos: t }))} /> */}

          {/* <AlergiasCondicionesSection
            alergias={form.alergias}
            setForm={setForm}
            animalId={animalId}
          /> */}

          {/* Archivos adjuntos ocultos */}
          {/*
          <div className="section-card">
            <h3 className="section-title">Archivos adjuntos</h3>
            {(form.archivos?.length ?? 0) === 0 && (
              <div className="empty-state">
                <span role="img" aria-label="archivo" className="emoji">📎</span>
                No hay archivos adjuntos
              </div>
            )}
            <div style={{ color: '#888' }}>(Funcionalidad de archivos pendiente)</div>
          </div>
          */}

          <div className="actions-row">
            <button
              className="button-primary"
              onClick={handleSave}
              disabled={loading}
            >
              Guardar cambios
            </button>
            <button className="button-secondary" onClick={onClose}>
              Cancelar
            </button>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          </div>
          {showSuccess && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#f8fbfd",
                color: "#1976d2",
                borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                padding: "24px 36px",
                fontSize: "1.15rem",
                fontWeight: 500,
                zIndex: 9999,
                textAlign: "center",
                border: "1px solid #e3eaf3",
                animation: "fadeInOut 1.8s",
                letterSpacing: "0.5px",
              }}
            >
              <span
                role="img"
                aria-label="check"
                style={{
                  fontSize: "1.7rem",
                  marginRight: 10,
                  verticalAlign: "middle",
                }}
              >
                ✅
              </span>
              <span style={{ verticalAlign: "middle" }}>
                Ficha médica guardada con éxito
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FichaMedicaModal;
