import React, { useState } from "react";
import { API_BASE } from "../../../Api/apiBase.js";

interface WebpayDonacionProps {
  monto: number;
  token: string;
}

interface WebpayResponse {
  token: string;
  url: string;
}

const WebpayDonacion: React.FC<WebpayDonacionProps> = ({ monto, token }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/webpay/iniciar/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ monto }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "No autorizado: Verifica tus credenciales o intenta más tarde."
          );
          return;
        }
        throw new Error("Error al iniciar la donación");
      }
      const data: WebpayResponse = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("No se recibió la URL de Webpay");
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="webpay-donacion">
      <h2>Donar con Webpay Plus</h2>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={loading || !monto}>
          {loading ? "Procesando..." : "Ir a Webpay"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default WebpayDonacion;
