import React, { useState, useEffect } from 'react';
import './UsuarioPerfil.css';

interface Usuario {
	nombre: string;
	apellidos: string;
	correo: string;
	telefono: string;
	username: string;
}

function UsuarioPerfil() {
	const [usuario, setUsuario] = useState<Usuario | null>(null);
	const [editando, setEditando] = useState<boolean>(false);
	const [editandoPassword, setEditandoPassword] = useState<boolean>(false);
	const [form, setForm] = useState<Usuario | null>(null);
	const [error, setError] = useState<string>('');
	const [passwordForm, setPasswordForm] = useState<{ password: string; password2: string }>({ password: '', password2: '' });
	const [passwordError, setPasswordError] = useState<string>('');

	const API_URL = `${import.meta.env.VITE_API_BASE}/api/auth/profile/`;

	// Cambios del formulario de perfil
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm(f => {
			if (!f) return f;
			// Si se cambia username o nombre, ambos se actualizan al mismo valor
			if (name === "username" || name === "nombre") {
				return { ...f, username: value, nombre: value };
			}
			return { ...f, [name]: value };
		});
	};

	// Cambios del formulario de contraseña
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswordForm(f => ({ ...f, [name]: value }));
	};

	// Activar edición perfil
	const handleEditar = () => {
		if (!usuario) return;
		setForm({ ...usuario });
		setEditando(true);
		setEditandoPassword(false);
		setError('');
	};

	// Activar edición contraseña
	const handleEditarPassword = () => {
		setEditandoPassword(true);
		setEditando(false);
		setPasswordError('');
		setPasswordForm({ password: '', password2: '' });
	};

	// Cancelar edición perfil
	const handleCancelar = () => {
		setEditando(false);
		setError('');
	};

	// Cancelar edición contraseña
	const handleCancelarPassword = () => {
		setEditandoPassword(false);
		setPasswordError('');
		setPasswordForm({ password: '', password2: '' });
	};

	// Guardar cambios de perfil
	const handleGuardar = async () => {
		if (!form) return;

		try {
			const token = localStorage.getItem('token');
			const payload: any = {
				username: form.username,
				email: form.correo,
				first_name: form.nombre,
				last_name: form.apellidos,
				telefono: form.telefono,
			};

			const res = await fetch(API_URL, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Token ${token}`,
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				setError(err.detail || 'Error al guardar');
				return;
			}

			const data = await res.json();

			setUsuario({
				nombre: data.first_name || '',
				apellidos: data.last_name || '',
				correo: data.email || '',
				telefono: data.telefono || '',
				username: data.username || '',
			});

			setEditando(false);
			setError('');

		} catch (e) {
			setError('Error de red');
		}
	};

	// Guardar nueva contraseña
	const handleGuardarPassword = async () => {
		setPasswordError('');
		if (passwordForm.password !== passwordForm.password2) {
			setPasswordError('Las contraseñas no coinciden');
			return;
		}
		if (!passwordForm.password) {
			setPasswordError('La contraseña no puede estar vacía');
			return;
		}
		try {
			const token = localStorage.getItem('token');
			const payload: any = {
				password: passwordForm.password,
			};
			const res = await fetch(API_URL, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Token ${token}`,
				},
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const err = await res.json();
				setPasswordError(err.detail || 'Error al cambiar la contraseña');
				return;
			}
			setPasswordForm({ password: '', password2: '' });
			setPasswordError('Contraseña actualizada correctamente');
		} catch (e) {
			setPasswordError('Error de red');
		}
	};

	// Cargar datos del usuario al iniciar
	useEffect(() => {
		const fetchUsuario = async () => {
			const token = localStorage.getItem('token');

			if (!token) {
				setError('No hay sesión iniciada');
				return;
			}

			try {
				const res = await fetch(API_URL, {
					headers: { 'Authorization': `Token ${token}` },
				});

				if (!res.ok) {
					setError('No se pudo cargar el perfil');
					return;
				}

				const data = await res.json();
				setUsuario({
					nombre: data.username || '',
					apellidos: data.last_name || '',
					correo: data.email || '',
					telefono: data.telefono || '',
                    username: data.username || '',
				});

			} catch {
				setError('Error de red');
			}
		};

		fetchUsuario();
	}, []);

	return (
		<div className="usuario-perfil-container">

			{/* Carga inicial */}
			{!usuario && !error && <div>Cargando...</div>}

			{/* Error general solo si no está editando */}
			{error && !editando && <div style={{ color: '#e53935', marginTop: 16 }}>{error}</div>}

			{/* Vista normal */}
			{usuario && !editando && !editandoPassword && !error && (
				<div className="usuario-info">                    
					<div><strong>Nombre:</strong> {usuario.nombre}</div>
					<div><strong>Apellidos:</strong> {usuario.apellidos}</div>
					<div><strong>Correo:</strong> {usuario.correo}</div>
					<div><strong>Teléfono:</strong> {usuario.telefono}</div>

					<div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
						<button className="form-boton-btn" onClick={handleEditar}>
							Editar perfil
						</button>
						<button className="form-boton-btn" style={{ background: '#229954' }} onClick={handleEditarPassword}>
							Editar contraseña
						</button>
					</div>
				</div>
			)}

			{/* Formulario edición perfil */}
			{editando && (
				<div className="usuario-editar-form">
					<div className="form-row">
						<label>Nombre</label>
						<input type="text" name="nombre" value={form?.nombre || ''} onChange={handleChange} />
					</div>
					<div className="form-row">
						<label>Apellidos</label>
						<input type="text" name="apellidos" value={form?.apellidos || ''} onChange={handleChange} />
					</div>
					<div className="form-row">
						<label>Correo</label>
						<input type="email" name="correo" value={form?.correo || ''} onChange={handleChange} />
					</div>
					<div className="form-row">
						<label>Teléfono</label>
						<span style={{ fontSize: '0.9em', color: '#888' }}>
							Ejemplo: +56912345678 o 912345678
						</span>
						<input type="text" name="telefono" value={form?.telefono || ''} onChange={handleChange} />
					</div>
					{error && <div className="form-error">{error}</div>}
					<div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
						<button className="form-boton-btn" onClick={handleGuardar}>Guardar cambios</button>
						<button className="form-boton-btn cancelar-btn" onClick={handleCancelar}>Cancelar</button>
					</div>
				</div>
			)}

			{/* Formulario edición contraseña */}
			{editandoPassword && (
				<div className="usuario-editar-form" style={{ margin: '32px auto 0 auto', maxWidth: 400, border: '2px solid #27ae60', borderRadius: 16, background: '#f6fff6', boxShadow: '0 2px 8px rgba(39, 174, 96, 0.08)', padding: 32 }}>
					<h3 style={{ marginBottom: 16, color: '#229954' }}>Cambiar contraseña</h3>
					<div className="form-row">
						<label>Nueva contraseña</label>
						<input type="password" name="password" value={passwordForm.password} onChange={handlePasswordChange} />
					</div>
					<div className="form-row">
						<label>Repetir contraseña</label>
						<input type="password" name="password2" value={passwordForm.password2} onChange={handlePasswordChange} />
					</div>
					{passwordError && <div className="form-error">{passwordError}</div>}
					<div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
						<button className="form-boton-btn" onClick={handleGuardarPassword}>Actualizar contraseña</button>
						<button className="form-boton-btn cancelar-btn" onClick={handleCancelarPassword}>Cancelar</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default UsuarioPerfil;
