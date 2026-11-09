import type { Category, Country, CountryCode, Platform, PlatformId } from "./types";

/** Fecha fija de los datos de demostración: así servidor y navegador generan lo mismo. */
export const REFERENCE_DATE = "2026-11-08";

const LATAM_RANGE: [number, number] = [0.62, 0.86];
const LATAM_HINT = "En contra entrega suele estar entre 65 % y 80 %.";

export const COUNTRIES: Country[] = [
  { code: "CO", name: "Colombia", currency: "COP", locale: "es-CO", fx: 4100, shipping: 14000, deliveryRange: LATAM_RANGE, deliveryHint: LATAM_HINT },
  { code: "MX", name: "México", currency: "MXN", locale: "es-MX", fx: 18.5, shipping: 120, deliveryRange: LATAM_RANGE, deliveryHint: LATAM_HINT },
  { code: "EC", name: "Ecuador", currency: "USD", locale: "es-EC", fx: 1, shipping: 5, deliveryRange: LATAM_RANGE, deliveryHint: LATAM_HINT },
  { code: "PE", name: "Perú", currency: "PEN", locale: "es-PE", fx: 3.75, shipping: 14, deliveryRange: LATAM_RANGE, deliveryHint: LATAM_HINT },
  { code: "CL", name: "Chile", currency: "CLP", locale: "es-CL", fx: 940, shipping: 4500, deliveryRange: LATAM_RANGE, deliveryHint: LATAM_HINT },
  { code: "GT", name: "Guatemala", currency: "GTQ", locale: "es-GT", fx: 7.75, shipping: 40, deliveryRange: LATAM_RANGE, deliveryHint: LATAM_HINT },
  { code: "PA", name: "Panamá", currency: "USD", locale: "es-PA", fx: 1, shipping: 6, deliveryRange: LATAM_RANGE, deliveryHint: LATAM_HINT },
  {
    code: "ES",
    name: "España",
    currency: "EUR",
    locale: "es-ES",
    fx: 0.92,
    shipping: 5.5,
    deliveryRange: [0.8, 0.94],
    deliveryHint:
      "En España se paga sobre todo con tarjeta y casi todo se entrega (85–95 %). Con contrarreembolso baja: ponlo entre 75 % y 85 %.",
  },
];

export const COUNTRY_BY_CODE = Object.fromEntries(COUNTRIES.map((c) => [c.code, c])) as Record<
  CountryCode,
  Country
>;

/** Peso de mercado de cada país en la demo (afecta volumen y probabilidad de que exista el producto). */
export const COUNTRY_WEIGHT: Record<CountryCode, number> = {
  CO: 1,
  MX: 0.85,
  EC: 0.6,
  PE: 0.55,
  CL: 0.5,
  GT: 0.42,
  PA: 0.32,
  ES: 0.55,
};

export const PLATFORMS: Platform[] = [
  { id: "dropi", name: "Dropi" },
  { id: "aliclick", name: "Aliclick" },
  { id: "mastershop", name: "Mastershop" },
  { id: "bigbuy", name: "BigBuy" },
];

export const PLATFORM_NAME = Object.fromEntries(PLATFORMS.map((p) => [p.id, p.name])) as Record<
  PlatformId,
  string
>;

/** Plataformas presentes en cada país (configuración de la demo). */
export const PLATFORMS_BY_COUNTRY: Record<CountryCode, PlatformId[]> = {
  CO: ["dropi", "mastershop"],
  MX: ["dropi", "mastershop"],
  EC: ["dropi", "aliclick"],
  PE: ["dropi", "aliclick"],
  CL: ["dropi"],
  GT: ["dropi"],
  PA: ["dropi"],
  ES: ["bigbuy", "dropi"],
};

export const CATEGORIES: Category[] = [
  "Belleza",
  "Hogar",
  "Cocina",
  "Tecnología",
  "Salud y bienestar",
  "Mascotas",
  "Bebés",
  "Deportes",
  "Herramientas",
  "Accesorios",
  "Vehículos",
];

/** Productos de la demo: nombre, categoría y costo base aproximado en USD. */
export const PRODUCT_SEEDS: { name: string; category: Category; usd: number }[] = [
  { name: "Cepillo alisador eléctrico 3 en 1", category: "Belleza", usd: 9 },
  { name: "Sérum facial de vitamina C", category: "Belleza", usd: 4 },
  { name: "Rodillo de jade y gua sha", category: "Belleza", usd: 3 },
  { name: "Kit de uñas acrílicas con lámpara UV", category: "Belleza", usd: 11 },
  { name: "Depiladora IPL de uso en casa", category: "Belleza", usd: 28 },
  { name: "Parches de colágeno para ojeras x30", category: "Belleza", usd: 3 },
  { name: "Rizador de pestañas térmico", category: "Belleza", usd: 5 },
  { name: "Mascarilla facial LED", category: "Belleza", usd: 22 },
  { name: "Lámpara de luna 3D recargable", category: "Hogar", usd: 8 },
  { name: "Organizador de zapatos apilable x6", category: "Hogar", usd: 7 },
  { name: "Humidificador difusor efecto llama", category: "Hogar", usd: 10 },
  { name: "Rodillo quitapelusas reutilizable", category: "Hogar", usd: 3 },
  { name: "Cortina de luces LED para ventana", category: "Hogar", usd: 6 },
  { name: "Trapeador giratorio 360 con balde", category: "Hogar", usd: 12 },
  { name: "Dispensador automático de jabón", category: "Hogar", usd: 7 },
  { name: "Bolsas al vacío para ropa x8", category: "Hogar", usd: 6 },
  { name: "Picadora eléctrica de verduras USB", category: "Cocina", usd: 8 },
  { name: "Freidora de aire 4,5 L", category: "Cocina", usd: 35 },
  { name: "Selladora de bolsas al vacío", category: "Cocina", usd: 9 },
  { name: "Moldes de silicona para freidora de aire x2", category: "Cocina", usd: 3 },
  { name: "Báscula digital de cocina", category: "Cocina", usd: 5 },
  { name: "Licuadora portátil recargable", category: "Cocina", usd: 9 },
  { name: "Cortador espiralizador 5 en 1", category: "Cocina", usd: 6 },
  { name: "Audífonos inalámbricos con estuche de carga", category: "Tecnología", usd: 10 },
  { name: "Mini proyector portátil HD", category: "Tecnología", usd: 38 },
  { name: "Soporte magnético de celular para carro", category: "Tecnología", usd: 4 },
  { name: "Reloj inteligente deportivo", category: "Tecnología", usd: 14 },
  { name: "Cámara de seguridad Wi-Fi 360°", category: "Tecnología", usd: 16 },
  { name: "Aro de luz con trípode", category: "Tecnología", usd: 9 },
  { name: "Batería portátil solar 20 000 mAh", category: "Tecnología", usd: 12 },
  { name: "Teclado y mouse inalámbricos", category: "Tecnología", usd: 13 },
  { name: "Masajeador cervical eléctrico", category: "Salud y bienestar", usd: 12 },
  { name: "Pistola de masaje muscular", category: "Salud y bienestar", usd: 18 },
  { name: "Corrector de postura ajustable", category: "Salud y bienestar", usd: 5 },
  { name: "Faja reductora térmica", category: "Salud y bienestar", usd: 6 },
  { name: "Tensiómetro digital de brazo", category: "Salud y bienestar", usd: 13 },
  { name: "Plantillas ortopédicas de gel", category: "Salud y bienestar", usd: 4 },
  { name: "Antifaz térmico de vapor x10", category: "Salud y bienestar", usd: 4 },
  { name: "Cepillo quitapelo con vapor para mascotas", category: "Mascotas", usd: 5 },
  { name: "Fuente de agua automática para gatos", category: "Mascotas", usd: 11 },
  { name: "Cama ortopédica para perro", category: "Mascotas", usd: 14 },
  { name: "Juguete láser automático para gatos", category: "Mascotas", usd: 6 },
  { name: "Arnés antitirones con correa", category: "Mascotas", usd: 6 },
  { name: "Cortaúñas con lima para mascotas", category: "Mascotas", usd: 3 },
  { name: "Monitor de bebé con cámara", category: "Bebés", usd: 22 },
  { name: "Extractor de leche eléctrico", category: "Bebés", usd: 19 },
  { name: "Proyector de estrellas con ruido blanco", category: "Bebés", usd: 9 },
  { name: "Portabebés ergonómico", category: "Bebés", usd: 13 },
  { name: "Termómetro infrarrojo sin contacto", category: "Bebés", usd: 8 },
  { name: "Bandas de resistencia x5 con anclaje", category: "Deportes", usd: 6 },
  { name: "Rueda abdominal con rodillera", category: "Deportes", usd: 5 },
  { name: "Botella motivacional de 2 L", category: "Deportes", usd: 4 },
  { name: "Cuerda para saltar con contador", category: "Deportes", usd: 4 },
  { name: "Guantes de gimnasio con muñequera", category: "Deportes", usd: 4 },
  { name: "Taladro inalámbrico con 2 baterías", category: "Herramientas", usd: 32 },
  { name: "Kit de destornilladores de precisión 115 en 1", category: "Herramientas", usd: 8 },
  { name: "Medidor láser digital", category: "Herramientas", usd: 11 },
  { name: "Pistola de silicona inalámbrica", category: "Herramientas", usd: 9 },
  { name: "Billetera antirrobo RFID", category: "Accesorios", usd: 4 },
  { name: "Gafas de sol polarizadas", category: "Accesorios", usd: 5 },
  { name: "Bolso cruzado antirrobo con USB", category: "Accesorios", usd: 9 },
  { name: "Medias de compresión x3", category: "Accesorios", usd: 4 },
  { name: "Aspiradora portátil para carro", category: "Vehículos", usd: 11 },
  { name: "Compresor de aire portátil para llantas", category: "Vehículos", usd: 17 },
  { name: "Cámara de reversa inalámbrica", category: "Vehículos", usd: 15 },
  { name: "Organizador plegable para maletero", category: "Vehículos", usd: 7 },
];

/** Problema que resuelve cada categoría: se usa en textos de anuncios y ángulos de venta. */
export const CATEGORY_PAIN: Record<Category, string> = {
  Belleza: "gastar una fortuna en el salón",
  Hogar: "el desorden en casa",
  Cocina: "pasar horas en la cocina",
  Tecnología: "quedarte sin batería o sin señal",
  "Salud y bienestar": "el dolor de espalda y cuello",
  Mascotas: "los pelos por toda la casa",
  Bebés: "las noches sin dormir",
  Deportes: "no tener tiempo para el gimnasio",
  Herramientas: "depender de otros para cada arreglo",
  Accesorios: "que te roben en la calle",
  Vehículos: "quedarte varado en la vía",
};

/** Ángulos de venta por categoría (plantillas propias). */
export const CATEGORY_ANGLES: Record<Category, string[]> = {
  Belleza: [
    "Resultado de salón en casa: muestra el antes y el después en 15 segundos.",
    "Ahorro: compara lo que cuesta una cita al mes con un pago único.",
    "Regalo: fechas especiales y empaque listo para regalar.",
  ],
  Hogar: [
    "Transformación del espacio: graba el mismo rincón antes y después.",
    "Ahorro de tiempo: «lo que antes tardaba una hora, ahora 10 minutos».",
    "Ambiente: luz cálida y música, pensado para quien vive en apartamento.",
  ],
  Cocina: [
    "Receta rápida: una receta completa usando solo el producto.",
    "Comer más sano sin esfuerzo.",
    "Prueba de resistencia: úsalo con alimentos duros frente a cámara.",
  ],
  Tecnología: [
    "Comparativa con la marca cara: mismas funciones, menos precio.",
    "Situación cotidiana: el problema en la calle, el producto lo resuelve.",
    "Unboxing con pago contra entrega para generar confianza.",
  ],
  "Salud y bienestar": [
    "Alivio tras la jornada laboral: oficina, moto, trabajo de pie.",
    "Recomendación para padres y abuelos: regalo con propósito.",
    "Rutina de 10 minutos al día con resultados visibles.",
  ],
  Mascotas: [
    "La reacción de la mascota: el primer uso grabado en casa.",
    "Limpieza: sofá y ropa sin pelos en un minuto.",
    "Bienestar animal: la mascota más tranquila y feliz.",
  ],
  Bebés: [
    "Tranquilidad para mamá y papá: dormir más horas.",
    "Seguridad: certificaciones y materiales libres de tóxicos.",
    "Regalo para baby shower.",
  ],
  Deportes: [
    "Entrena en casa sin pagar gimnasio.",
    "Reto de 30 días con progreso visible.",
    "Portátil: cabe en la maleta, entrena donde estés.",
  ],
  Herramientas: [
    "Hazlo tú mismo: un arreglo real de principio a fin.",
    "Kit completo: todo lo que trae, pieza por pieza.",
    "Regalo para papá o para el que siempre arregla todo.",
  ],
  Accesorios: [
    "Seguridad en la calle y en el transporte público.",
    "Estilo por poco dinero: combinaciones con la misma pieza.",
    "Prueba de resistencia frente a cámara.",
  ],
  Vehículos: [
    "Emergencia en carretera resuelta en minutos.",
    "Carro limpio y ordenado sin ir al lavadero.",
    "Regalo para quien maneja todos los días.",
  ],
};

export const SUPPLIER_NAMES = [
  "Bodega Andina",
  "Importaciones Sol",
  "Distribuidora Norte",
  "Almacén Prisma",
  "Grupo Cóndor",
  "Mayorista Ámbar",
  "Proveedora Atlas",
  "Casa Nativa",
  "Logística Brisa",
  "Comercial Faro",
  "Depósito Central",
  "Ruta Express",
  "Surtidora Ceiba",
  "Mercantil Alba",
];

export const BRAND_PREFIX = ["Tienda", "Casa", "Mundo", "Club", "Bazar", "Hogar", "Punto", "Outlet"];
export const BRAND_SUFFIX = [
  "Luna",
  "Prisma",
  "Nova",
  "Brisa",
  "Andes",
  "Coral",
  "Lince",
  "Ceiba",
  "Alma",
  "Tucán",
  "Bahía",
  "Sauce",
];

export const STORE_THEMES = ["Dawn", "Refresh", "Sense", "Craft", "Tema propio"];
export const STORE_APPS = [
  "Formulario contra entrega",
  "Reseñas con fotos",
  "Venta adicional en 1 clic",
  "Botón de WhatsApp",
  "Píxel de TikTok",
  "Píxel de Meta",
  "Contador de urgencia",
  "Descuento por cantidad",
  "Seguimiento de pedidos",
];
