import React, { useState } from "react";
import { createPortal } from "react-dom";
import "../AuthModals.css";

interface AuthenticatedUser {
  id: number;
  email: string;
  tipo_usuario?: string;
  username?: string;
  [key: string]: unknown;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onLoginSuccess?: (user: AuthenticatedUser) => void;
}

interface FormData {
  email: string;
  password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLoginSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("¡Login exitoso!");

        if (onLoginSuccess) {
          onLoginSuccess(data.user);
          onClose();
          return;
        }

        // Redireccionar dependiendo de autoridad de usuario
        const user = JSON.parse(localStorage.getItem("user") || "null");
        console.log("[DEBUG] user en localStorage:", user);
        console.log("[DEBUG] tipo_usuario:", user?.tipo_usuario);
        if (user?.tipo_usuario === "admin") {
          console.log("[DEBUG] Redirigiendo a /admin");
          window.location.href = "/admin";
        } else {
          console.log("[DEBUG] No es admin, recargando página normal");
          onClose();
          window.location.reload();
        }


      } else {
        alert("Error en login: Credenciales incorrectas");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Ingresar
          </button>
        </form>
        <p className="switch-auth">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            className="switch-button"
            onClick={() => onSwitchToRegister?.()}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
