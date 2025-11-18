import React, { useEffect, useState } from 'react';

interface DonacionMedica {
	id: number;
	nombre_vacuna: string;
	monto_unitario: number;
	estado_uso: string;
	fecha_creacion: string;
	animal: {
		nombre: string;
		foto?: string;
	};
	comentario: string;
	comprobante_url: string;
	comprobante_donador?: string;
	comentario_donador?: string;
	respuesta_refugio?: {
		fotos: string[];
		comentario: string;
	};
}

const MisDonaciones: React.FC = () => {
	const [donaciones, setDonaciones] = useState<DonacionMedica[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [donacionSeleccionada, setDonacionSeleccionada] = useState<DonacionMedica | null>(null);
    
	const [comprobanteModal, setComprobanteModal] = useState<string | null>(null);
	useEffect(() => {
		const fetchDonaciones = async () => {
			setLoading(true);
			setError('');
			try {
				const user = JSON.parse(localStorage.getItem('user') || 'null');
				const userId = user?.id || user?.id_usuario || '';
				const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";
				const token = localStorage.getItem('token');
				const response = await fetch(`${API_BASE}/donaciones-medicas-usuario/${userId}/`, {
					headers: {
						'Authorization': `Token ${token}`,
					},
				});
				if (!response.ok) throw new Error('No se pudo obtener donaciones');
				const data = await response.json();
				setDonaciones(data);
			} catch {
				setError('Error al obtener tus donaciones.');
			}
			setLoading(false);
		};
		fetchDonaciones();
	}, []);

	return (
		<div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
			<h1 style={{ color: '#228B22', fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Mis Donaciones Médicas</h1>
			<p style={{ marginBottom: 24, color: '#1976d2', fontWeight: 500 }}>
				Aquí puedes ver las donaciones de vacunas que has enviado y su estado actual.
			</p>
			{loading ? (
				<div>Cargando donaciones...</div>
			) : error ? (
				<div style={{ color: 'red' }}>{error}</div>
			) : donaciones.length === 0 ? (
				<div>No has realizado donaciones médicas aún.</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
					{donaciones.map((donacion) => (
						<div key={'donacion-' + donacion.id} style={{ position: 'relative', border: '1px solid #e3eaf3', borderRadius: 12, padding: 20, background: '#f8fbfd', boxShadow: '0 2px 8px #1976d233', display: 'flex', alignItems: 'center', gap: 18 }}>
							{/* Etiqueta de estado */}
							<span style={{ position: 'absolute', top: 12, right: 18, padding: '4px 14px', borderRadius: 16, fontWeight: 700, fontSize: 15, background: donacion.estado_uso === 'respondida' ? '#e6f4ea' : donacion.estado_uso === 'pendiente' ? '#fffbe6' : donacion.estado_uso === 'aprobado' ? '#e6f4ea' : donacion.estado_uso === 'descartado' ? '#ffe6e6' : donacion.estado_uso === 'utilizado' ? '#e6f4ea' : donacion.estado_uso === 'parcial' ? '#fffbe6' : donacion.estado_uso === 'en proceso' ? '#e6f4ea' : '#e3eaf3', color: donacion.estado_uso === 'respondida' ? '#228B22' : donacion.estado_uso === 'pendiente' ? '#b8860b' : donacion.estado_uso === 'aprobado' ? '#228B22' : donacion.estado_uso === 'descartado' ? '#e53935' : donacion.estado_uso === 'utilizado' ? '#228B22' : donacion.estado_uso === 'parcial' ? '#b8860b' : donacion.estado_uso === 'en proceso' ? '#228B22' : '#1976d2', border: '2px solid #e3eaf3', zIndex: 2 }}>
								{
									donacion.estado_uso === 'pendiente' ? 'Pendiente' :
									donacion.estado_uso === 'respondida' ? 'Respondida' :
									donacion.estado_uso === 'aprobado' ? 'Aprobado' :
									donacion.estado_uso === 'descartado' ? 'Descartado' :
									donacion.estado_uso === 'utilizado' ? 'Utilizado' :
									donacion.estado_uso === 'parcial' ? 'Parcial' :
									donacion.estado_uso === 'en proceso' ? 'En proceso' :
									donacion.estado_uso
								}
							</span>
							{donacion.animal && donacion.animal.foto ? (
								<img src={donacion.animal.foto} alt={donacion.animal.nombre || 'Animal'} style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 14, border: '2px solid #e3eaf3' }} />
							) : (
								<div style={{ width: 140, height: 140, background: '#eee', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 18 }}>Sin foto</div>
							)}
							<div style={{ flex: 1 }}>
								<div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{donacion.animal?.nombre || 'Sin datos de animal'}</div>
								<div><strong>Vacuna:</strong> {donacion.nombre_vacuna}</div>
								<div><strong>Monto:</strong> {donacion.monto_unitario ? donacion.monto_unitario.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : '$0'}</div>
								<div><strong>Fecha:</strong> {donacion.fecha_creacion ? new Date(donacion.fecha_creacion).toLocaleString() : 'Sin fecha'}</div>
								<button style={{ marginTop: 12, padding: '6px 18px', borderRadius: 8, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={() => { setDonacionSeleccionada(donacion); setModalOpen(true); }}>Ver detalles</button>
							</div>
						</div>
					))}
					{/* Modal de detalles */}
					{modalOpen && donacionSeleccionada && (
						<>
						<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModalOpen(false)}>
							<div style={{ background: '#fff', borderRadius: 18, padding: 32, minWidth: 350, maxWidth: 480, boxShadow: '0 4px 24px #1976d299', position: 'relative' }} onClick={e => e.stopPropagation()}>
								<button style={{ position: 'absolute', top: 18, right: 18, background: '#eee', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }} onClick={() => setModalOpen(false)}>Cerrar</button>
								<h2 style={{ color: '#228B22', fontWeight: 800, fontSize: 22, marginBottom: 12 }}>
									Detalle de donación para {donacionSeleccionada.animal?.nombre || '---'}
								</h2>
								<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
								{donacionSeleccionada.animal && donacionSeleccionada.animal.foto ? (
									<img src={donacionSeleccionada.animal.foto} alt={donacionSeleccionada.animal.nombre || 'Animal'} style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 18, border: '2px solid #e3eaf3' }} />
								) : (
									<div style={{ width: 180, height: 180, background: '#eee', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 22 }}>Sin foto</div>
								)}
								</div>
								<div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{donacionSeleccionada.animal?.nombre || 'Sin datos de animal'}</div>
								<div><strong>Vacuna:</strong> {donacionSeleccionada.nombre_vacuna}</div>
								<div><strong>Monto:</strong> {donacionSeleccionada.monto_unitario ? donacionSeleccionada.monto_unitario.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : '$0'}</div>
								<div><strong>Fecha:</strong> {donacionSeleccionada.fecha_creacion ? new Date(donacionSeleccionada.fecha_creacion).toLocaleString() : 'Sin fecha'}</div>
								<div><strong>Comentario del donador:</strong> {donacionSeleccionada.comentario_donador || 'Sin comentario'}</div>
								<div style={{ marginTop: 10 }}><strong>Comprobante enviado:</strong><br />
									{donacionSeleccionada.comprobante_donador ? (
										<img src={donacionSeleccionada.comprobante_donador} alt="Comprobante donador" style={{ maxWidth: 180, borderRadius: 8, marginTop: 6, background: '#eee', padding: 4, cursor: 'pointer' }} onClick={() => donacionSeleccionada.comprobante_donador ? setComprobanteModal(donacionSeleccionada.comprobante_donador) : undefined} />
									) : (
										<span>No disponible</span>
									)}
								</div>
								{donacionSeleccionada.comprobante_url && (
									<div style={{ marginTop: 10 }}><strong>Comprobante de uso:</strong><br />
										<img src={donacionSeleccionada.comprobante_url} alt="Comprobante uso" style={{ maxWidth: 180, borderRadius: 8, marginTop: 6 }} />
									</div>
								)}
								{donacionSeleccionada.respuesta_refugio && (
									<div style={{ marginTop: 10 }}>
										<strong>Respuesta del refugio:</strong><br />
										{donacionSeleccionada.respuesta_refugio.fotos?.map((foto, idx) => (
											foto ? (
												<img key={foto + '-' + idx} src={foto} alt={`Respuesta ${idx + 1}`} style={{ maxWidth: 120, borderRadius: 6, marginRight: 4, marginTop: 4 }} />
											) : null
										))}
										<div><strong>Comentario:</strong> {donacionSeleccionada.respuesta_refugio.comentario || 'Sin comentario'}</div>
									</div>
								)}
							</div>
						</div>
						{/* Modal para comprobante ampliado */}
						{comprobanteModal && (
							<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setComprobanteModal(null)}>
								<div style={{ background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 4px 24px #1976d299', position: 'relative' }} onClick={e => e.stopPropagation()}>
									<button style={{ position: 'absolute', top: 12, right: 12, background: '#eee', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }} onClick={() => setComprobanteModal(null)}>Cerrar</button>
									<img src={comprobanteModal} alt="Comprobante ampliado" style={{ maxWidth: 400, maxHeight: 500, borderRadius: 12 }} />
								</div>
							</div>
						)}
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default MisDonaciones;
