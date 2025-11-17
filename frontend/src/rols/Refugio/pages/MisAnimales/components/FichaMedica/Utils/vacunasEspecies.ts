export const vacunasPorEspecie: Record<string, VacunaInfo[]> = {
  perro: [
    {
      nombre: 'Séxtuple canina',
      descripcion: 'Protege contra moquillo, hepatitis, parvovirus, parainfluenza, leptospirosis y coronavirus.',
      frecuencia: 'Serie inicial + refuerzo anual',
      obligatoria: true,
      precioReferencial: 8000,   // bajé bastante, asumiendo compra de dosis mayorista (~92k / 25 dosis ≈ 3.700, pero se sube por distribución)
    },
    {
      nombre: 'Antirrábica',
      descripcion: 'Protege contra la rabia, virus mortal y zoonótico.',
      frecuencia: '1 dosis anual (según normativa local)',
      obligatoria: true,
      precioReferencial: 15000,  // pongo un valor medio-bajo considerando variabilidad SERNAC
    },
    {
      nombre: 'Moquillo canino (Distemper)',
      descripcion: 'Virus respiratorio y neurológico grave.',
      frecuencia: 'Serie inicial + refuerzo anual',
      obligatoria: true,
      precioReferencial: 9000,  // estimado proporcionalmente
    },
    {
      nombre: 'Parvovirus canino',
      descripcion: 'Gastroenteritis viral grave y mortal en cachorros.',
      frecuencia: 'Serie inicial + refuerzo anual',
      obligatoria: true,
      precioReferencial: 9000,  // similar al moquillo, para viales combinados puede ser más barato
    },
    {
      nombre: 'Hepatitis infecciosa (Adenovirus tipo 1 y 2)',
      descripcion: 'Daño hepático y respiratorio.',
      frecuencia: 'Serie inicial + refuerzo anual',
      obligatoria: true,
      precioReferencial: 9000,
    },
    {
      nombre: 'Leptospirosis',
      descripcion: 'Infección bacteriana zoonótica.',
      frecuencia: 'Anual',
      obligatoria: true,
      precioReferencial: 7000,
    },
    {
      nombre: 'Bordetella bronchiseptica',
      descripcion: 'Protege contra la tos de las perreras.',
      frecuencia: 'Según riesgo, anual o semestral',
      precioReferencial: 12000,
    },
    {
      nombre: 'Parainfluenza',
      descripcion: 'Tos y fiebre viral.',
      frecuencia: 'Según riesgo',
      precioReferencial: 8000,
    },
    {
      nombre: 'Coronavirus canino',
      descripcion: 'Gastroenteritis viral.',
      frecuencia: 'Según zona',
      precioReferencial: 8000,
    },
    {
      nombre: 'Lyme',
      descripcion: 'Bacteria transmitida por garrapatas.',
      frecuencia: 'Según riesgo',
      precioReferencial: 12000,
    },
  ],
  gato: [
    {
      nombre: 'Triple felina (FVRCP)',
      descripcion: 'Rinotraqueítis, calicivirus y panleucopenia.',
      frecuencia: 'Serie inicial + refuerzo anual',
      obligatoria: true,
      precioReferencial: 12000,  // bajado un poco
    },
    {
      nombre: 'Antirrábica',
      descripcion: 'Protege contra la rabia.',
      frecuencia: 'Anual o cada 3 años según vacuna',
      obligatoria: true,
      precioReferencial: 15000,  // similar al perro
    },
    {
      nombre: 'Leucemia felina (FeLV)',
      descripcion: 'Virus que causa inmunodeficiencia felina.',
      frecuencia: 'Recomendado en gatos que salen al exterior',
      precioReferencial: 12000,
    },
    {
      nombre: 'Peritonitis infecciosa felina (PIF)',
      descripcion: 'Virus raro pero grave.',
      frecuencia: 'No siempre recomendada',
      precioReferencial: 11000,
    },
    {
      nombre: 'Clamidiosis felina',
      descripcion: 'Infección ocular y respiratoria.',
      frecuencia: 'Según entorno o criadero',
      precioReferencial: 10000,
    },
  ],
  conejo: [
    {
      nombre: 'Mixomatosis',
      descripcion: 'Virus transmitido por mosquitos/pulgas.',
      frecuencia: 'Anual',
      obligatoria: true,
      precioReferencial: 12000,
    },
    {
      nombre: 'Enfermedad vírica hemorrágica (EVH o RHDV1 y RHDV2)',
      descripcion: 'Virus hemorrágico fatal.',
      frecuencia: 'Anual o semestral según variante',
      obligatoria: true,
      precioReferencial: 13000,
    },
    {
      nombre: 'Combinada Mixomatosis + EVH',
      descripcion: 'Ambas enfermedades.',
      frecuencia: 'Muy común en una sola aplicación',
      precioReferencial: 14000,
    },
  ],
  caballo: [
    {
      nombre: 'Tétanos',
      descripcion: 'Bacteria Clostridium tetani.',
      frecuencia: 'Cada 1-2 años',
      obligatoria: true,
      precioReferencial: 15000,
    },
    {
      nombre: 'Influenza equina',
      descripcion: 'Virus respiratorio.',
      frecuencia: 'Cada 6-12 meses',
      obligatoria: true,
      precioReferencial: 14000,
    },
    {
      nombre: 'Encefalomielitis equina',
      descripcion: 'Virus transmitido por mosquitos.',
      frecuencia: 'Anual',
      obligatoria: true,
      precioReferencial: 13000,
    },
    {
      nombre: 'Rabia',
      descripcion: 'Rabia (zoonótica).',
      frecuencia: 'Anual',
      obligatoria: true,
      precioReferencial: 12000,
    },
  ],
  ave: [
    {
      nombre: 'Newcastle',
      descripcion: 'Enfermedad viral respiratoria.',
      frecuencia: 'Solo en aviarios o criaderos grandes',
      precioReferencial: 9000,
    },
    {
      nombre: 'Viruela aviar',
      descripcion: 'Enfermedad viral.',
      frecuencia: 'Solo en aviarios o criaderos grandes',
      precioReferencial: 9000,
    },
    {
      nombre: 'Enfermedad de Marek',
      descripcion: 'Enfermedad viral en pollos.',
      frecuencia: 'Solo en aviarios o criaderos grandes',
      precioReferencial: 10000,
    },
  ],
};
