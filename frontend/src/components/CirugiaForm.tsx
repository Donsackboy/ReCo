import './CirugiaForm.css';
import React, { useState } from 'react';

export type Cirugia = {
	tipo: string;
	otro_nombre?: string;
	motivo: string;
	fecha: string;
	costo: number;
	veterinario: string;
	observaciones: string;
	pagoEstado?: 'pagada' | 'no_pagada' | 'parcial';
	montoPagado?: number;
	adjunto?: File | null;
};

const cirugiasPorAnimal: Record<string, Array<{ categoria: string; items: Array<{ tipo: string; descripcion: string }> }>> = {
	"Perro/Gato": [
		{
			categoria: "Rutina",
			items: [
				{ tipo: "Esterilización / Castración", descripcion: "Extirpación de órganos reproductivos (ovarios/testículos)." },
				{ tipo: "Ovariohisterectomía", descripcion: "Extirpación de útero y ovarios (en hembras)." },
				{ tipo: "Orquiectomía", descripcion: "Extirpación de testículos (en machos)." },
				{ tipo: "Limpieza dental / Extracción dental", descripcion: "Eliminación de sarro o dientes dañados." },
				{ tipo: "Desungulación (NO recomendada)", descripcion: "Retiro de garras (a veces en gatos, cada vez menos ética)." },
			],
		},
		{
			categoria: "Emergencia",
			items: [
				{ tipo: "Cesárea", descripcion: "Asistencia al parto cuando hay complicaciones." },
				{ tipo: "Corrección de torsión gástrica", descripcion: "Urgencia estomacal grave en perros grandes." },
				{ tipo: "Sutura de heridas profundas", descripcion: "Cierre de cortes o mordidas." },
				{ tipo: "Extracción de cuerpo extraño", descripcion: "Retiro de objetos ingeridos." },
				{ tipo: "Reparación de hernias", descripcion: "Hernias umbilicales, inguinales, etc." },
			],
		},
		{
			categoria: "Ortopédica",
			items: [
				{ tipo: "Fractura / Osteosíntesis", descripcion: "Colocación de clavos o placas para huesos rotos." },
				{ tipo: "Luxación de rótula", descripcion: "Corrección de desplazamiento de rodilla (muy común en razas pequeñas)." },
				{ tipo: "Displasia de cadera / codo", descripcion: "Cirugía reconstructiva articular." },
				{ tipo: "Amputación de extremidad", descripcion: "Por trauma o enfermedad." },
			],
		},
		{
			categoria: "Oftálmica y Auditiva",
			items: [
				{ tipo: "Enucleación ocular", descripcion: "Extirpación de un ojo dañado." },
				{ tipo: "Corrección de entropión / ectropión", descripcion: "Cirugía de párpados." },
				{ tipo: "Limpieza o cirugía de oído", descripcion: "Por otitis crónica o pólipos." },
			],
		},
		{
			categoria: "Otras",
			items: [
				{ tipo: "Remoción de tumor / masa", descripcion: "Extirpación de bultos o quistes." },
				{ tipo: "Biopsia", descripcion: "Toma de muestra para análisis." },
				{ tipo: "Colocación de chip subcutáneo", descripcion: "Identificación permanente." },
				{ tipo: "Cirugía exploratoria", descripcion: "Para diagnóstico interno." },
				{ tipo: "Otra", descripcion: "Especificar." },
			],
		},
	],
	"Conejo/Roedor": [
		{
			categoria: "Rutina",
			items: [
				{ tipo: "Esterilización", descripcion: "Control de reproducción." },
				{ tipo: "Extracción dental", descripcion: "Dientes crecen de forma anormal." },
			],
		},
		{
			categoria: "Emergencia",
			items: [
				{ tipo: "Amputación / heridas", descripcion: "Por peleas o accidentes." },
				{ tipo: "Remoción de abscesos", descripcion: "Infecciones comunes en piel." },
			],
		},
	],
	"Ave": [
		{
			categoria: "Rutina",
			items: [
				{ tipo: "Corte o reparación de pico", descripcion: "Por deformaciones o fracturas." },
			],
		},
		{
			categoria: "Emergencia",
			items: [
				{ tipo: "Extracción de huevo retenido", descripcion: "Problema reproductivo común." },
				{ tipo: "Amputación o sutura de ala/pata", descripcion: "Por trauma." },
			],
		},
	],
	"Reptil": [
		{
			categoria: "Emergencia",
			items: [
				{ tipo: "Extracción de cuerpo extraño", descripcion: "Ingestión de piedras, sustrato, etc." },
				{ tipo: "Cirugía de caparazón", descripcion: "Reparación tras fracturas." },
				{ tipo: "Retiro de huevos retenidos", descripcion: "Común en hembras." },
			],
		},
	],
};

interface CirugiaFormProps {
	onAdd: (cirugia: Cirugia) => void;
	onUpdate: (cirugias: Cirugia[]) => void;
	historial?: Cirugia[];
	animalTipo: string;
}

const CirugiaForm: React.FC<CirugiaFormProps> = ({ onAdd, onUpdate, historial = [], animalTipo }) => {
	const [showForm, setShowForm] = useState(false);
	const [form, setForm] = useState<Cirugia>({
		tipo: '',
		otro_nombre: '',
		motivo: '',
		fecha: '',
		costo: 0,
		veterinario: '',
		observaciones: '',
		pagoEstado: 'no_pagada',
		montoPagado: 0,
		adjunto: null,
	});
	const [showOtro, setShowOtro] = useState(false);
	const [editIdx, setEditIdx] = useState<number | null>(null);
	const [editCirugia, setEditCirugia] = useState<Cirugia | null>(null);
	const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		if (!editCirugia) return;
		const { name, value, type } = e.target;
		let newValue: any = value;
		if (type === 'checkbox') {
			newValue = (e.target as HTMLInputElement).checked;
		}
		if (type === 'number') {
			newValue = Math.max(0, Math.min(Number(newValue), editCirugia.costo));
		}
		setEditCirugia({ ...editCirugia, [name]: newValue });
	};

	const handleEditSave = (e: React.MouseEvent, idx: number) => {
		e.preventDefault();
		if (editCirugia) {
			const updated = [...historial];
			updated[idx] = editCirugia;
			onUpdate(updated);
		}
		setEditIdx(null);
		setEditCirugia(null);
	};

	const confirmDelete = (idx: number) => {
		setDeleteIdx(idx);
	};

	const handleDelete = () => {
		if (deleteIdx !== null) {
			const updated = historial.filter((_, i) => i !== deleteIdx);
			onUpdate(updated);
			setEditIdx(null);
			setEditCirugia(null);
			setDeleteIdx(null);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		if (type === 'checkbox') {
			const checked = (e.target as HTMLInputElement).checked;
			setForm(f => ({
				...f,
				[name]: checked,
			}));
		} else {
			setForm(f => ({
				...f,
				[name]: value,
			}));
		}
	};

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm(f => ({ ...f, adjunto: e.target.files ? e.target.files[0] : null }));
	};

	const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		setForm(f => ({ ...f, tipo: value, otro_nombre: '' }));
		setShowOtro(value === 'Otra');
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.tipo || !form.fecha || (!form.otro_nombre && showOtro)) return;
		onAdd(form);
		setForm({
			tipo: '',
			otro_nombre: '',
			motivo: '',
			fecha: '',
			costo: 0,
			veterinario: '',
			observaciones: '',
			// pagada eliminado
			adjunto: null,
		});
		setShowOtro(false);
		setShowForm(false);
	};

		return (
			<div style={{ border: '2px solid #1976d2', borderRadius: 18, padding: 24, background: '#e3f2fd', marginBottom: 32 }}>
				<h3 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 12 }}>Registro de cirugías veterinarias</h3>
					{!showForm && (
						<div style={{ textAlign: 'center', marginBottom: 18 }}>
							<button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 38px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 12px #1976d233' }} onClick={() => setShowForm(true)}>
								Agregar cirugía
							</button>
						</div>
					)}
					{showForm && (
						<div className="cirugia-form-grid" style={{ marginBottom: 18 }}>
					<div style={{ gridColumn: '1/2' }}>
						<label style={{ fontWeight: 500 }}>Tipo de cirugía:
							<select name="tipo" value={form.tipo} onChange={handleTipoChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }}>
								<option value="">Selecciona tipo...</option>
								{cirugiasPorAnimal[animalTipo]?.map(cat => (
									<optgroup key={cat.categoria} label={cat.categoria}>
										{cat.items.map(item => (
											<option key={item.tipo} value={item.tipo}>{item.tipo}</option>
										))}
									</optgroup>
								))}
							</select>
						</label>
						<label style={{ fontWeight: 500, marginTop: 8 }}>Fecha de cirugía:
							<input name="fecha" type="date" value={form.fecha} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
						</label>
						{form.tipo === 'Otra' && (
							<>
								<label style={{ fontWeight: 500, marginTop: 8 }}>Nombre personalizado:
									<input name="otro_nombre" value={form.otro_nombre} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
								</label>
								<label style={{ fontWeight: 500, marginTop: 8 }}>Descripción:
									<textarea name="motivo" value={form.motivo} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, minHeight: 40, background: '#fff' }} />
								</label>
								<label style={{ fontWeight: 500, marginTop: 8 }}>Costo ($):
									<input name="costo" type="number" value={form.costo} onChange={handleChange} min={0} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
								</label>
							</>
						)}
					</div>
					<div style={{ gridColumn: '2/3' }}>
						{form.tipo !== 'Otra' && (
							<>
								<label style={{ fontWeight: 500 }}>Motivo / descripción:
									<textarea name="motivo" value={form.motivo} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, minHeight: 40, background: '#fff' }} />
								</label>
								<label style={{ fontWeight: 500 }}>Costo ($):
									<input name="costo" type="number" value={form.costo} onChange={handleChange} min={0} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
								</label>
							</>
						)}
						<label style={{ fontWeight: 500 }}>Veterinario / clínica:
							<input name="veterinario" value={form.veterinario} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
						</label>
						<label style={{ fontWeight: 500 }}>Observaciones:
							<textarea name="observaciones" value={form.observaciones} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, minHeight: 40, background: '#fff' }} />
						</label>
						<label style={{ fontWeight: 500 }}>Documento adjunto:
							<input name="adjunto" type="file" onChange={handleFile} style={{ marginTop: 4, background: '#fff' }} />
						</label>
						{/* Campo pagada eliminado, ahora se usa pagoEstado y montoPagado */}
					</div>
					<div style={{ gridColumn: '1/3', textAlign: 'center', marginTop: 18 }}>
						<button type="button" onClick={handleSubmit} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 38px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 12px #1976d233' }}>Guardar cirugía</button>
						<button type="button" style={{ marginLeft: 16, background: '#eee', color: '#1976d2', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer' }} onClick={() => { setShowForm(false); setForm({ tipo: '', otro_nombre: '', motivo: '', fecha: '', costo: 0, veterinario: '', observaciones: '', pagoEstado: 'no_pagada', montoPagado: 0, adjunto: null }); setShowOtro(false); }}>Cancelar</button>
					</div>
				</div>
			)}
					{historial.length > 0 && (
						<div style={{ marginTop: 32 }}>
							<h4 style={{ color: '#1976d2', fontWeight: 700 }}>Historial de cirugías</h4>
								<div className="cirugia-historial-cards">
									{historial.map((c, idx) => (
										editIdx === idx ? (
											<div key={idx} style={{ background: '#bbdefb', borderRadius: 12, boxShadow: '0 2px 8px #1976d233', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
												<div style={{ fontWeight: 700, color: '#1976d2', fontSize: 15 }}>#{idx + 1} - {editCirugia?.tipo === 'Otra' ? editCirugia?.otro_nombre : editCirugia?.tipo}</div>
												<label><strong>Fecha:</strong> <input name="fecha" type="date" value={editCirugia?.fecha || ''} onChange={handleEditChange} /></label>
												<label><strong>Tipo:</strong> <input name="tipo" value={editCirugia?.tipo || ''} onChange={handleEditChange} /></label>
												<label><strong>Costo:</strong> <input name="costo" type="number" value={editCirugia?.costo || 0} onChange={handleEditChange} /></label>
												<label><strong>Veterinario:</strong> <input name="veterinario" value={editCirugia?.veterinario || ''} onChange={handleEditChange} /></label>
												<label><strong>Pago:</strong>
													<select name="pagoEstado" value={editCirugia?.pagoEstado || 'no_pagada'} onChange={handleEditChange}>
														<option value="pagada">Pagada</option>
														<option value="no_pagada">No pagada</option>
														<option value="parcial">Parcialmente pagada</option>
													</select>
													{editCirugia?.pagoEstado === 'parcial' && (
														<div>
															<input name="montoPagado" type="number" value={editCirugia?.montoPagado || 0} onChange={handleEditChange} min={0} max={editCirugia?.costo || 0} />
															<span style={{ marginLeft: 8, color: '#1976d2', fontWeight: 600 }}>Resta: ${Math.max(0, (editCirugia?.costo || 0) - (editCirugia?.montoPagado || 0)).toLocaleString()}</span>
														</div>
													)}
												</label>
												<label><strong>Observaciones:</strong> <input name="observaciones" value={editCirugia?.observaciones || ''} onChange={handleEditChange} /></label>
												<div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
													<button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 18px', fontWeight: 700, cursor: 'pointer' }} onClick={e => handleEditSave(e, idx)}>Guardar</button>
													<button type="button" style={{ background: '#eee', color: '#1976d2', border: 'none', borderRadius: '8px', padding: '6px 12px', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setEditIdx(null); setEditCirugia(null); }}>Cancelar</button>
													<button type="button" style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontWeight: 700, cursor: 'pointer' }} onClick={() => confirmDelete(idx)}>Eliminar</button>
												</div>
											</div>
										) : (
											<div key={idx} style={{ background: '#e3f2fd', borderRadius: 12, boxShadow: '0 2px 8px #1976d233', padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
												<div style={{ fontWeight: 700, color: '#1976d2', fontSize: 15 }}>#{idx + 1} - {c.tipo === 'Otra' ? c.otro_nombre : c.tipo}</div>
												<div><strong>Fecha:</strong> {c.fecha}</div>
												<div><strong>Costo:</strong> ${c.costo.toLocaleString()}</div>
												<div><strong>Veterinario:</strong> {c.veterinario}</div>
												<div><strong>Pago:</strong> <span style={{ color: c.pagoEstado === 'pagada' ? '#43a047' : c.pagoEstado === 'parcial' ? '#ffa726' : '#e74c3c', fontWeight: 700 }}>{c.pagoEstado === 'pagada' ? 'Pagada' : c.pagoEstado === 'parcial' ? `Parcial ($${c.montoPagado || 0})` : 'No pagada'}</span></div>
												<div><strong>Observaciones:</strong> {c.observaciones}</div>
												<button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-end' }} onClick={() => { setEditIdx(idx); setEditCirugia({ ...c }); }}>Editar</button>
											</div>
										)
									))}
								</div>
							<div style={{ marginTop: 12, fontWeight: 600, color: '#0d47a1' }}>
								Total gastado: ${historial.reduce((acc, c) => acc + (c.costo || 0), 0).toLocaleString()}
								<span style={{ marginLeft: 24, color: '#1976d2' }}>
									Pagado: ${historial.filter(c => c.pagoEstado === 'pagada').reduce((acc, c) => acc + (c.costo || 0), 0).toLocaleString()}
								</span>
								<span style={{ marginLeft: 24, color: '#ffa726' }}>
									Parcial: ${historial.filter(c => c.pagoEstado === 'parcial').reduce((acc, c) => acc + (c.montoPagado || 0), 0).toLocaleString()}
								</span>
								<span style={{ marginLeft: 24, color: '#e74c3c' }}>
									Pendiente: ${historial.filter(c => c.pagoEstado === 'no_pagada').reduce((acc, c) => acc + (c.costo || 0), 0).toLocaleString()}
								</span>
							</div>
						</div>
					)}
				{/* Modal de confirmación para eliminar */}
				{deleteIdx !== null && (
					<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(33, 150, 243, 0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #1976d233', padding: 32, minWidth: 320, textAlign: 'center', border: '2px solid #1976d2' }}>
							<h3 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 18 }}>¿Eliminar cirugía?</h3>
							<div style={{ color: '#333', marginBottom: 18 }}>
								¿Estás seguro que deseas eliminar esta cirugía?<br />Esta acción no se puede deshacer.
							</div>
							<button type="button" style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: '1.08rem', marginRight: 12, cursor: 'pointer' }} onClick={handleDelete}>Eliminar</button>
							<button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer' }} onClick={() => setDeleteIdx(null)}>Cancelar</button>
						</div>
					</div>
				)}
		</div>
	);
};

export default CirugiaForm;
