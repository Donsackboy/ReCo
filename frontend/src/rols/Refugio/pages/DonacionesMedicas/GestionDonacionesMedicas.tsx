import React, { useEffect, useState } from 'react';
import { getDonacionesMedicas, registrarDonacionVacuna } from '../../api/apiRefugio';

// Simulación de función para enviar respuesta (debes implementar en tu API real)
async function responderDonacionMedica(donacionId: number, fotos: File[], comentario: string) {
	const formData = new FormData();
	fotos.forEach((foto, idx) => formData.append(`foto${idx+1}`, foto));
	formData.append('comentario', comentario);
	// Obtener token si es necesario
	const token = localStorage.getItem('token');
	const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";
	const response = await fetch(`${API_BASE}/donaciones-medicas/${donacionId}/respuesta/`, {
		method: 'POST',
		headers: token ? { 'Authorization': `Token ${token}` } : {},
		body: formData,
	});
	if (!response.ok) throw new Error('Error al enviar respuesta');
	return true;
}

const descartarDonacion = async (donacionId: number) => {
	if (!window.confirm('¿Seguro que quieres descartar esta donación?')) return;
	try {
		const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE}/donaciones-medicas/${donacionId}/descartar/`, {
			method: 'POST',
			headers: token ? { 'Authorization': `Token ${token}` } : {},
		});
		if (!response.ok) throw new Error('Error al descartar donación');
		window.location.reload();
	} catch (err) {
		alert('No se pudo descartar la donación.');
	}
};

interface DonacionMedica {
	id: number;
	monto: number;
	animal: { id: number; nombre: string };
	comprobante_url: string;
	comentario: string;
	nombre_vacuna?: string;
	usuario_nombre?: string;
	respuesta_refugio?: {
		fotos: string[];
		comentario: string;
	};
}

const GestionDonacionesMedicas: React.FC = () => {
	const [donaciones, setDonaciones] = useState<DonacionMedica[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [registrarKey, setRegistrarKey] = useState(0);

	useEffect(() => {
		// Obtener la id del refugio desde el usuario logueado
		const user = (() => {
			try {
				return JSON.parse(localStorage.getItem('user') || 'null');
			} catch {
				return null;
			}
		})();
		const refugioId = user?.refugio?.id_refugio;
		if (!refugioId) {
			setError('Refugio no encontrado');
			setLoading(false);
			return;
		}
		getDonacionesMedicas(refugioId)
			.then((data) => {
				setDonaciones(data);
				setLoading(false);
			})
			.catch(() => {
				setError('Error al obtener donaciones médicas');
				setLoading(false);
			});
	}, [registrarKey]);

	return (
		<div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
			<h1 style={{ color: '#228B22', fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Donaciones Médicas</h1>
			{loading ? (
				<div>Cargando donaciones médicas...</div>
			) : error ? (
				<div style={{ color: 'red' }}>{error}</div>
			) : donaciones.length === 0 ? (
				<div>No hay donaciones médicas registradas.</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
					{donaciones.map((donacion) => (
						<div key={donacion.id} style={{ position: 'relative', border: '1px solid #e3eaf3', borderRadius: 12, padding: 20, background: '#f8fbfd', boxShadow: '0 2px 8px #1976d233' }}>
							{/* Etiqueta de estado en la esquina superior derecha */}
							<div style={{ position: 'absolute', top: 12, right: 16 }}>
								<span style={{
									background: donacion.respuesta_refugio ? '#43ea6b' : '#ffe082',
									color: donacion.respuesta_refugio ? '#145214' : '#b8860b',
									fontWeight: 700,
									borderRadius: 8,
									padding: '6px 16px',
									fontSize: '0.98rem',
									boxShadow: '0 1px 6px #43ea6b22',
									border: donacion.respuesta_refugio ? '1.5px solid #43ea6b' : '1.5px solid #ffe082'
								}}>
									{donacion.respuesta_refugio ? 'Respondida' : 'Pendiente'}
								</span>
							</div>
							<div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Animal: {donacion.animal.nombre}</div>
							<div><strong>Vacuna:</strong> {donacion.nombre_vacuna || donacion.vacuna_nombre || 'No especificada'}</div>
							<div><strong>Donador:</strong> {donacion.usuario_nombre || donacion.nombre_donador || 'No especificado'}</div>
							<div><strong>Monto:</strong> ${donacion.monto}</div>
							<div><strong>Comentario:</strong> {donacion.comentario || 'Sin comentario'}</div>
							<div style={{ margin: '10px 0' }}>
								<strong>Comprobante:</strong><br />
								{donacion.comprobante_url ? (
									<img src={donacion.comprobante_url} alt="Comprobante" style={{ maxWidth: 220, borderRadius: 8, marginTop: 6 }} />
								) : (
									<span>No disponible</span>
								)}
							</div>
							{donacion.respuesta_refugio ? (
								<div style={{ marginTop: 10 }}>
									<strong>Respuesta del refugio:</strong>
									<div>
										{donacion.respuesta_refugio.fotos?.map((foto, idx) => (
											<img key={idx} src={foto} alt={`Respuesta ${idx + 1}`} style={{ maxWidth: 120, borderRadius: 6, marginRight: 8 }} />
										))}
									</div>
									<div><strong>Comentario:</strong> {donacion.respuesta_refugio.comentario || 'Sin comentario'}</div>
								</div>
							) : (
								<>
									<RespuestaForm donacionId={donacion.id} onRespondido={() => window.location.reload()} />
									<div style={{ marginTop: 16, textAlign: 'right' }}>
										<button
											style={{
												background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 1px 6px #e5393533', marginRight: 8
											}}
											onClick={() => descartarDonacion(donacion.id)}
										>
											Descartar donación
										</button>
									</div>
								</>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

// Formulario para responder donación médica
const RespuestaForm: React.FC<{ donacionId: number; onRespondido: () => void }> = ({ donacionId, onRespondido }) => {
	const [fotos, setFotos] = useState<File[]>([]);
	const [comentario, setComentario] = useState('');
	const [enviando, setEnviando] = useState(false);
	const [error, setError] = useState('');

	const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const files = Array.from(e.target.files).slice(0, 2); // máximo 2 fotos
		setFotos(files);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setEnviando(true);
		setError('');
		try {
			await responderDonacionMedica(donacionId, fotos, comentario);
			onRespondido();
		} catch {
			setError('Error al enviar respuesta');
		}
		setEnviando(false);
	};

	return (
		<form onSubmit={handleSubmit} style={{ marginTop: 16, background: '#e3f6ff', padding: 16, borderRadius: 8 }}>
			<div style={{ marginBottom: 8 }}>
				<label><strong>Fotos (máx 2):</strong></label><br />
				<input type="file" accept="image/*" multiple onChange={handleFotoChange} disabled={enviando} />
			</div>
			<div style={{ marginBottom: 8 }}>
				<label><strong>Comentario opcional:</strong></label><br />
				<textarea value={comentario} onChange={e => setComentario(e.target.value)} rows={2} style={{ width: '100%', borderRadius: 6, padding: 6 }} disabled={enviando} />
			</div>
			<button type="submit" disabled={enviando} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Enviar respuesta</button>
			{error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
		</form>
	);
};

export default GestionDonacionesMedicas;
