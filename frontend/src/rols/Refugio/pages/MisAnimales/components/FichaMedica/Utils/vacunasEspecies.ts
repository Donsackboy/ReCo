// Vacunas y frecuencias por especie doméstica
export type VacunaInfo = {
  nombre: string;
  descripcion: string;
  frecuencia: string;
  obligatoria?: boolean;
};

export const vacunasPorEspecie: Record<string, VacunaInfo[]> = {
  perro: [
    {
      nombre: 'Séxtuple canina',
      descripcion: 'Protege contra moquillo, hepatitis, parvovirus, parainfluenza, leptospirosis y coronavirus.',
      frecuencia: 'Serie inicial + refuerzo anual',
      obligatoria: true,
    },
    {
      nombre: 'Antirrábica',
      descripcion: 'Protege contra la rabia, virus mortal y zoonótico.',
      frecuencia: '1 dosis anual (según normativa local)',
      obligatoria: true,
    },
    {
      nombre: 'Moquillo canino (Distemper)',
      descripcion: 'Virus respiratorio y neurológico grave.',
      frecuencia: 'Serie inicial + refuerzo anual',
      obligatoria: true,
    },
    {
      nombre: 'Parvovirus canino',
      descripcion: 'Gastroenteritis viral grave y mortal en cachorros.',
      frecuencia: 'Serie inicial + refuerzo anual',
      obligatoria: true,
    },
    {
      nombre: 'Hepatitis infecciosa (Adenovirus tipo 1 y 2)',
      descripcion: 'Daño hepático y respiratorio.',
      frecuencia: 'Serie inicial + refuerzo anual',
      obligatoria: true,
    },
    {
      nombre: 'Leptospirosis',
      descripcion: 'Infección bacteriana zoonótica.',
      frecuencia: 'Anual',
      obligatoria: true,
    },
    {
      nombre: 'Bordetella bronchiseptica',
      descripcion: 'Protege contra la tos de las perreras.',
      frecuencia: 'Según riesgo, anual o semestral',
    },
    {
      nombre: 'Parainfluenza',
      descripcion: 'Tos y fiebre viral.',
      frecuencia: 'Según riesgo',
    },
    {
      nombre: 'Coronavirus canino',
      descripcion: 'Gastroenteritis viral.',
      frecuencia: 'Según zona',
    },
    {
      nombre: 'Lyme',
      descripcion: 'Bacteria transmitida por garrapatas.',
      frecuencia: 'Según riesgo',
    },
  ],
  gato: [
    {
      nombre: 'Triple felina (FVRCP)',
      descripcion: 'Rinotraqueítis, calicivirus y panleucopenia.',
      frecuencia: 'Serie inicial + refuerzo anual',
      obligatoria: true,
    },
    {
      nombre: 'Antirrábica',
      descripcion: 'Protege contra la rabia.',
      frecuencia: 'Anual o cada 3 años según vacuna',
      obligatoria: true,
    },
    {
      nombre: 'Leucemia felina (FeLV)',
      descripcion: 'Virus que causa inmunodeficiencia felina.',
      frecuencia: 'Recomendado en gatos que salen al exterior',
    },
    {
      nombre: 'Peritonitis infecciosa felina (PIF)',
      descripcion: 'Virus raro pero grave.',
      frecuencia: 'No siempre recomendada',
    },
    {
      nombre: 'Clamidiosis felina',
      descripcion: 'Infección ocular y respiratoria.',
      frecuencia: 'Según entorno o criadero',
    },
  ],
  conejo: [
    {
      nombre: 'Mixomatosis',
      descripcion: 'Virus transmitido por mosquitos/pulgas.',
      frecuencia: 'Anual',
      obligatoria: true,
    },
    {
      nombre: 'Enfermedad vírica hemorrágica (EVH o RHDV1 y RHDV2)',
      descripcion: 'Virus hemorrágico fatal.',
      frecuencia: 'Anual o semestral según variante',
      obligatoria: true,
    },
    {
      nombre: 'Combinada Mixomatosis + EVH',
      descripcion: 'Ambas enfermedades.',
      frecuencia: 'Muy común en una sola aplicación',
    },
  ],
  caballo: [
    {
      nombre: 'Tétanos',
      descripcion: 'Bacteria Clostridium tetani.',
      frecuencia: 'Cada 1-2 años',
      obligatoria: true,
    },
    {
      nombre: 'Influenza equina',
      descripcion: 'Virus respiratorio.',
      frecuencia: 'Cada 6-12 meses',
      obligatoria: true,
    },
    {
      nombre: 'Encefalomielitis equina',
      descripcion: 'Virus transmitido por mosquitos.',
      frecuencia: 'Anual',
      obligatoria: true,
    },
    {
      nombre: 'Rabia',
      descripcion: 'Rabia (zoonótica).',
      frecuencia: 'Anual',
      obligatoria: true,
    },
  ],
  ave: [
    {
      nombre: 'Newcastle',
      descripcion: 'Enfermedad viral respiratoria.',
      frecuencia: 'Solo en aviarios o criaderos grandes',
    },
    {
      nombre: 'Viruela aviar',
      descripcion: 'Enfermedad viral.',
      frecuencia: 'Solo en aviarios o criaderos grandes',
    },
    {
      nombre: 'Enfermedad de Marek',
      descripcion: 'Enfermedad viral en pollos.',
      frecuencia: 'Solo en aviarios o criaderos grandes',
    },
  ],
};
