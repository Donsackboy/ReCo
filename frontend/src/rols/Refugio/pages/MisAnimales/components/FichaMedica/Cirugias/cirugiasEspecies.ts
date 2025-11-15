
export interface Cirugia {
  nombre: string;
  descripcion: string;
}

export interface CirugiasPorEspecie {
  [especie: string]: Cirugia[];
}

export const cirugiasPorEspecie: CirugiasPorEspecie = {
  "Perro": [
    { nombre: "Esterilización/Castración", descripcion: "Procedimiento para evitar la reproducción, reduce el riesgo de tumores y mejora el comportamiento." },
    { nombre: "Extracción de cuerpos extraños", descripcion: "Cirugía para retirar objetos ingeridos o introducidos accidentalmente en el cuerpo del perro." },
    { nombre: "Corrección de hernias", descripcion: "Reparación de hernias umbilicales, inguinales o perineales comunes en perros jóvenes o mayores." },
    { nombre: "Limpieza dental con extracción", descripcion: "Limpieza profunda bajo anestesia para eliminar sarro y dientes dañados." },
    { nombre: "Orquiectomía", descripcion: "Remoción de testículos en machos no castrados o con tumores." },
    { nombre: "Mastectomía", descripcion: "Extirpación de tumores mamarios, común en hembras no esterilizadas." },
    { nombre: "Amputación", descripcion: "Remoción de extremidades dañadas por trauma o cáncer." },
    { nombre: "Corrección de fracturas", descripcion: "Colocación de placas, tornillos o yesos para tratar huesos rotos." },
    { nombre: "Entropión/Ectropión", descripcion: "Corrección quirúrgica del párpado que se enrolla hacia adentro o hacia afuera." },
    { nombre: "Resección de masas cutáneas", descripcion: "Extracción de bultos o tumores superficiales para análisis o prevención." },
  ],
  "Gato": [
    { nombre: "Esterilización/Castración", descripcion: "Evita la reproducción, marca de territorio y enfermedades reproductivas." },
    { nombre: "Extracción de cuerpos extraños", descripcion: "Retiro de objetos ingeridos, como hilos o agujas." },
    { nombre: "Limpieza dental", descripcion: "Remoción de sarro y dientes infectados bajo anestesia." },
    { nombre: "Enucleación ocular", descripcion: "Extracción de un ojo dañado o infectado para aliviar dolor." },
    { nombre: "Corrección de fracturas", descripcion: "Reparación de huesos rotos causados por caídas o accidentes." },
    { nombre: "Abscesos por mordedura", descripcion: "Drenaje quirúrgico de infecciones por peleas." },
    { nombre: "Resección de masas cutáneas", descripcion: "Remoción de tumores o lesiones en la piel." },
  ],
  "Conejo": [
    { nombre: "Esterilización/Castración", descripcion: "Control poblacional y prevención de tumores uterinos en hembras." },
    { nombre: "Limpieza dental", descripcion: "Recorte o extracción de dientes que crecen en exceso." },
    { nombre: "Resección de abscesos", descripcion: "Extracción de masas infecciosas subcutáneas frecuentes en conejos." },
    { nombre: "Corrección de fracturas", descripcion: "Tratamiento de huesos frágiles debido a caídas." },
  ],
  "Ave": [
    { nombre: "Corte de pico o uñas", descripcion: "Recorte controlado para evitar crecimiento excesivo que dificulte comer o posarse." },
    { nombre: "Reparación de fracturas alares", descripcion: "Inmovilización o cirugía de huesos rotos en alas." },
    { nombre: "Extracción de huevo retenido", descripcion: "Procedimiento para remover huevos que no pueden ser expulsados naturalmente." },
    { nombre: "Resección de masas", descripcion: "Remoción de tumores o quistes en la piel o cloaca." },
  ],
  "Tortuga": [
    { nombre: "Corrección de caparazón fracturado", descripcion: "Reparación con resinas o placas del caparazón dañado." },
    { nombre: "Extracción de cuerpo extraño", descripcion: "Retiro de objetos ingeridos, frecuente en tortugas de tierra o agua." },
    { nombre: "Tratamiento de abscesos auriculares", descripcion: "Remoción quirúrgica de infecciones en el oído medio, comunes por deficiencias de vitamina A." },
    { nombre: "Ooforectomía", descripcion: "Remoción de ovarios en casos de retención de huevos o enfermedad reproductiva." },
  ],
  "Caballo": [
    { nombre: "Castración", descripcion: "Procedimiento común en machos jóvenes para control de temperamento y reproducción." },
    { nombre: "Sutura de heridas", descripcion: "Cierre de lesiones profundas causadas por golpes o cercas." },
    { nombre: "Corrección de cólico quirúrgico", descripcion: "Intervención para liberar torsiones o bloqueos intestinales." },
    { nombre: "Desmotomía", descripcion: "Corte de ligamentos para aliviar tensión en lesiones crónicas de las patas." },
  ],
  "Vaca": [
    { nombre: "Cesárea bovina", descripcion: "Extracción quirúrgica del ternero en partos complicados." },
    { nombre: "Descorne o descornado", descripcion: "Remoción de cuernos en terneros para prevenir lesiones." },
    { nombre: "Rumenotomía", descripcion: "Apertura del rumen para retirar objetos o aliviar gases." },
    { nombre: "Laparotomía exploratoria", descripcion: "Apertura abdominal para diagnóstico o tratamiento interno." },
  ],
  "Cerdo": [
    { nombre: "Castración", descripcion: "Remoción de testículos en machos jóvenes para control de olor y agresividad." },
    { nombre: "Corrección de hernias", descripcion: "Reparación de hernias umbilicales comunes en lechones." },
    { nombre: "Cesárea", descripcion: "Extracción de crías en partos complicados." },
  ],
  "Oveja": [
    { nombre: "Castración", descripcion: "Práctica común para control de reproducción y temperamento." },
    { nombre: "Colocación de anillos caudales", descripcion: "Amputación parcial de cola para higiene y prevención de infecciones." },
    { nombre: "Cesárea ovina", descripcion: "Intervención en partos difíciles o múltiples." },
  ],
  "Cabra": [
    { nombre: "Descorne", descripcion: "Eliminación de cuernos para evitar peleas o lesiones." },
    { nombre: "Castración", descripcion: "Control reproductivo y mejora del temperamento." },
    { nombre: "Cesárea caprina", descripcion: "Parto asistido quirúrgicamente en casos complicados." },
  ],
  "Hurón": [
    { nombre: "Esterilización", descripcion: "Evita enfermedades hormonales graves en hembras y agresividad en machos." },
    { nombre: "Extracción de glándulas anales", descripcion: "Remoción por infecciones recurrentes o mal olor." },
    { nombre: "Tumores suprarrenales", descripcion: "Cirugía para eliminar glándulas afectadas por hiperplasia o tumores." },
  ],
  "Cuy": [
    { nombre: "Esterilización", descripcion: "Evita reproducción descontrolada y mejora convivencia." },
    { nombre: "Limpieza dental", descripcion: "Recorte de dientes sobrecrecidos que impiden comer." },
    { nombre: "Abscesos subcutáneos", descripcion: "Extracción de infecciones localizadas por heridas o picaduras." },
  ],
  "Erizo": [
    { nombre: "Esterilización", descripcion: "Previene tumores uterinos en hembras." },
    { nombre: "Remoción de tumores cutáneos", descripcion: "Extirpación de masas comunes en piel y abdomen." },
    { nombre: "Extracción dental", descripcion: "Retiro de dientes dañados o infectados." },
  ],
  "Reptil (general)": [
    { nombre: "Corrección de caparazón o piel dañada", descripcion: "Reparación de lesiones cutáneas o fracturas en caparazón." },
    { nombre: "Extracción de huevos retenidos", descripcion: "Asistencia quirúrgica a hembras con distocia." },
    { nombre: "Amputación de extremidades", descripcion: "Remoción de miembros dañados por necrosis o infecciones." },
  ]
};
