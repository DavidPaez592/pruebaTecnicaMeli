import type { SearchResponse, ItemDetailResponse } from '../types';

// Grupos de imágenes por producto (cada grupo representa un producto diferente)
// Formato URL: https://http2.mlstatic.com/D_{picture_id}-F.jpg
const productImageGroups = [
  // Grupo 1 - iPhone dorado/naranja
  [
    '666103-MLA96419978510_102025',
    '742298-MLA92147984151_092025',
    '600911-MLA92148168911_092025',
    '676105-MLA92148149619_092025',
    '617756-MLA92148003821_092025',
    '905224-MLA92148149639_092025',
    '941431-MLA91747300396_092025',
  ],
  // Grupo 2 - iPhone azul medianoche
  [
    '958104-MLA99489775048_112025',
    '834290-MLA74781175605_022024',
    '924329-MLA47781591383_102021',
    '726539-MLA47781378921_102021',
    '703744-MLA47781634246_102021',
    '661395-MLA47781634248_102021',
    '778289-MLA47781591388_102021',
  ],
  // Grupo 3 - iPhone blanco
  [
    '805025-MLA96416620078_102025',
    '748364-MLA92147389487_092025',
    '682583-MLA91746540816_092025',
    '916437-MLA91746695430_092025',
    '937222-MLA91746474356_092025',
    '946769-MLA91746637050_092025',
    '685877-MLA91746540842_092025',
  ],
  // Grupo 4 - iPhone variado
  [
    '796974-MLA96094042915_102025',
    '929123-MLU80276924341_102024',
    '652291-MLM51559388199_092022',
    '717924-MLM74226080347_012024',
    '821199-MLM51559388193_092022',
  ],
  // Grupo 5 - iPhone Pro
  [
    '872843-MLA95522181961_102025',
    '891831-MLU79130295417_092024',
    '851375-MLU79130246053_092024',
    '933851-MLU79130246055_092024',
    '917591-MLU78892379948_092024',
    '604913-MLU78892605636_092024',
    '647759-MLU79130295455_092024',
  ],
];

// Función para convertir ID a URL completa
const toImageUrl = (id: string) => `https://http2.mlstatic.com/D_${id}-F.jpg`;

// Descripciones únicas por modelo de iPhone
const productDescriptions: Record<string, string> = {
  'iPhone 17 Pro Max': `El iPhone 17 Pro Max es el smartphone más avanzado de Apple hasta la fecha. Equipado con el revolucionario chip A19 Pro, ofrece un rendimiento sin precedentes para las tareas más exigentes. Su pantalla Super Retina XDR de 6.9 pulgadas con tecnología ProMotion adaptativa de hasta 240Hz brinda una experiencia visual excepcional. El sistema de cámara Pro incluye un sensor principal de 48MP con estabilización óptica avanzada, un teleobjetivo de 5x y un ultra gran angular mejorado. Graba video en 8K ProRes y disfruta de Apple Intelligence integrada para funciones de IA generativa. Con hasta 2TB de almacenamiento y batería que dura todo el día, es la herramienta perfecta para profesionales y entusiastas de la tecnología. Resistente al agua IP68 y fabricado con titanio de grado aeroespacial.`,

  'iPhone 17 Pro': `El iPhone 17 Pro redefine lo que un smartphone profesional puede lograr. Con el chip A19 Pro de 3nm y Neural Engine de nueva generación, procesa tareas complejas de IA en tiempo real. Su pantalla Super Retina XDR de 6.3 pulgadas con ProMotion de 120Hz ofrece colores precisos y negros profundos. El sistema de triple cámara Pro de 48MP captura fotos con un detalle impresionante, mientras que el teleobjetivo de 5x te acerca a la acción. Graba video en 4K a 120fps y edita directamente en el dispositivo con potentes herramientas profesionales. El diseño en titanio es ligero pero increíblemente resistente, y el nuevo botón de Acción te da control instantáneo sobre tus funciones favoritas. Incluye USB-C con velocidades USB 3 para transferencias ultrarrápidas.`,

  'iPhone 16 Pro Max': `El iPhone 16 Pro Max lleva la fotografía móvil a nuevas alturas con su sistema de cámara Fusion de 48MP. El chip A18 Pro ofrece rendimiento excepcional con eficiencia energética mejorada, permitiendo hasta 29 horas de reproducción de video. Su pantalla Super Retina XDR de 6.7 pulgadas con ProMotion brinda una experiencia inmersiva perfecta para gaming y contenido multimedia. El nuevo botón de Captura permite controles intuitivos de cámara, mientras que Apple Intelligence potencia funciones inteligentes como resúmenes de texto y generación de imágenes. Fabricado con titanio de grado 5 para máxima durabilidad con mínimo peso. Compatible con el último iOS y todas las funciones de continuidad del ecosistema Apple.`,

  'iPhone 16 Pro': `El iPhone 16 Pro combina potencia profesional en un diseño compacto y elegante. El chip A18 Pro con GPU de 6 núcleos maneja renderizado 3D y machine learning con facilidad. Su pantalla de 6.3 pulgadas Always-On muestra información útil sin agotar la batería. El sistema de cámara Pro de 48MP con sensor quad-pixel captura 4 veces más luz, ideal para fotografía nocturna. Graba video ProRes 4K directamente a SSD externo vía USB-C. El acabado en titanio cepillado resiste huellas y arañazos, mientras que Ceramic Shield protege la pantalla de caídas. Soporta Wi-Fi 7 para conexiones ultrarrápidas y carga MagSafe de 25W para energía rápida.`,

  'iPhone 16': `El iPhone 16 es el smartphone perfecto para quienes buscan la experiencia Apple completa a un precio accesible. Con el potente chip A18, ejecuta las apps más exigentes y juegos AAA con fluidez. Su pantalla Super Retina XDR de 6.1 pulgadas ofrece colores vibrantes y brillo máximo de 2000 nits. El sistema de doble cámara de 48MP con Photonic Engine captura fotos espectaculares en cualquier condición de luz. Nuevo botón de Acción personalizable para acceso rápido a tus funciones favoritas. Dynamic Island te mantiene conectado con notificaciones inteligentes y actividades en tiempo real. Batería de larga duración con hasta 22 horas de reproducción de video y carga rápida USB-C. Disponible en nuevos colores vibrantes y materiales sostenibles.`,

  'iPhone 16 Plus': `El iPhone 16 Plus ofrece la pantalla más grande de la línea estándar: 6.7 pulgadas Super Retina XDR para una experiencia multimedia inigualable. El chip A18 con Neural Engine de 16 núcleos potencia todas las funciones de Apple Intelligence. Su sistema de cámara dual de 48MP incluye el nuevo sensor Fusion para fotos con rango dinámico excepcional. La batería de mayor capacidad permite hasta 27 horas de reproducción de video, la mejor en un iPhone. Perfecto para productividad, gaming y streaming en pantalla grande. Ceramic Shield de última generación ofrece 4 veces mejor resistencia a caídas. Compatible con todos los accesorios MagSafe y carga inalámbrica Qi2.`,

  'iPhone 15 Pro Max': `El iPhone 15 Pro Max representa un salto generacional en tecnología móvil. El chip A17 Pro, el primero de 3nm en un smartphone, ofrece rendimiento de consola para gaming. Su sistema de cámara Pro de 48MP con teleobjetivo de 5x y zoom óptico de 120mm captura detalles a distancia sin pérdida de calidad. La pantalla Super Retina XDR de 6.7 pulgadas con ProMotion adapta su frecuencia de actualización para máxima fluidez y eficiencia. Primer iPhone con cuerpo de titanio, 19% más ligero que el acero inoxidable. Puerto USB-C con velocidades USB 3 para transferencias de hasta 10Gb/s. Graba video espacial para visualizar en Apple Vision Pro.`,

  'iPhone 15 Pro': `El iPhone 15 Pro combina potencia de nivel profesional con un diseño refinado en titanio. El chip A17 Pro ejecuta juegos AAA con ray tracing en tiempo real, algo nunca antes visto en móviles. Su sistema de triple cámara de 48MP con lente principal de 24mm captura fotos con calidad de estudio. El nuevo botón de Acción reemplaza el switch de silencio, permitiendo personalización total. La pantalla Always-On de 6.1 pulgadas muestra widgets y notificaciones sin encender completamente el display. USB-C compatible con accesorios Pro como grabadores externos y pantallas 4K. Ceramic Shield de segunda generación ofrece la pantalla de smartphone más resistente del mercado.`,

  'iPhone 15': `El iPhone 15 introduce Dynamic Island a la línea principal, transformando notificaciones y actividades en una experiencia interactiva. El chip A16 Bionic, probado en el iPhone 14 Pro, ofrece rendimiento excepcional y eficiencia energética. Su cámara principal de 48MP con sensor quad-pixel permite hacer zoom 2x sin pérdida de calidad, como tener dos lentes en uno. El nuevo diseño con bordes contorneados es más cómodo de sostener, y los colores infundidos en el vidrio trasero son vibrantes y elegantes. Puerto USB-C estándar para cargar con el mismo cable que tu Mac o iPad. Modo Retrato mejorado ahora permite cambiar el enfoque después de tomar la foto.`,

  'iPhone 14 Pro Max': `El iPhone 14 Pro Max revolucionó la experiencia iPhone con Dynamic Island y pantalla Always-On. El chip A16 Bionic de 4nm ofrece el CPU más rápido en un smartphone. Su sistema de cámara Pro de 48MP cuadruplica la resolución de generaciones anteriores, capturando detalles invisibles al ojo humano. La pantalla Super Retina XDR de 6.7 pulgadas alcanza 2000 nits de brillo, legible incluso bajo luz solar directa. Detección de Accidentes y SOS Emergencia vía satélite pueden salvar vidas en situaciones críticas. El modo Cine ahora graba en 4K a 30fps con profundidad de campo cinematográfica. Resistencia al agua IP68 hasta 6 metros durante 30 minutos.`,

  'iPhone 14 Pro': `El iPhone 14 Pro presentó al mundo Dynamic Island, la reinvención de la interacción con notificaciones. El potente chip A16 Bionic procesa un billón de operaciones por segundo, habilitando fotografía computacional avanzada. Su cámara principal de 48MP con apertura ƒ/1.78 captura 4 veces más información lumínica. Photonic Engine mejora fotos con poca luz en todas las cámaras. La pantalla Always-On de 6.1 pulgadas muestra el reloj, widgets y fondos de pantalla a 1Hz para mínimo consumo. Graba video ProRes 4K y edita directamente con apps profesionales. Ceramic Shield frontal ofrece resistencia superior a caídas y arañazos.`,

  'iPhone 14': `El iPhone 14 perfecciona la fórmula del smartphone ideal. El chip A15 Bionic con GPU de 5 núcleos maneja cualquier tarea con eficiencia. Su sistema de doble cámara de 12MP con sensor principal más grande captura 49% más luz para fotos nocturnas brillantes. Photonic Engine mejora el rango dinámico y color en cada imagen. Detección de Accidentes contacta automáticamente a emergencias si detecta un choque vehicular. SOS Emergencia vía satélite te conecta con ayuda incluso sin cobertura celular. Modo Acción estabiliza video mientras te mueves, perfecto para contenido dinámico. Batería que dura todo el día con hasta 20 horas de reproducción de video.`,

  'iPhone 13 Pro Max': `El iPhone 13 Pro Max estableció el estándar de la fotografía profesional móvil. Su sistema de cámara Pro con sensores más grandes y estabilización óptica por desplazamiento del sensor captura imágenes impresionantes. El chip A15 Bionic ofrece rendimiento líder en la industria con eficiencia energética excepcional. Pantalla Super Retina XDR de 6.7 pulgadas con ProMotion de 120Hz para scrolling y animaciones ultrasuaves. Modo Cine añade profundidad de campo cinematográfica a tus videos con cambios de enfoque automáticos. Batería de mayor duración en un iPhone hasta su fecha, con hasta 28 horas de reproducción de video. Resistente al agua IP68 y disponible en acabados elegantes.`,

  'iPhone 13 Pro': `El iPhone 13 Pro trajo ProMotion a la línea Pro por primera vez, con pantalla adaptativa de 10-120Hz. El chip A15 Bionic con GPU de 5 núcleos supera cualquier competidor en benchmarks gráficos. Su sistema de triple cámara Pro de 12MP incluye nuevos sensores más grandes y apertura ƒ/1.5 en la cámara principal. Modo Macro revolucionario permite fotografiar a solo 2cm del sujeto con detalles increíbles. Estilos Fotográficos personalizan el procesamiento de imagen según tu preferencia estética. ProRes para video permite edición profesional directamente desde el iPhone. Almacenamiento desde 128GB hasta 1TB para profesionales exigentes.`,

  'iPhone 13': `El iPhone 13 redefinió lo que un smartphone puede ofrecer a un precio accesible. El chip A15 Bionic ofrece el mejor rendimiento en su categoría, superando incluso a competidores flagship. Su sistema de cámara dual de 12MP dispuesto en diagonal captura más luz con el nuevo sensor principal. Modo Cine ahora disponible para todos, permite crear videos con efecto bokeh cinematográfico. Pantalla Super Retina XDR de 6.1 pulgadas 28% más brillante para uso en exteriores. Batería mejorada ofrece 2.5 horas más que el iPhone 12. Ceramic Shield frontal es más duro que cualquier vidrio de smartphone. 5G más eficiente con Smart Data mode.`,

  'iPhone 12 Pro Max': `El iPhone 12 Pro Max introdujo el sistema de cámara más avanzado de su generación. Su sensor principal de 47% más grande captura significativamente más luz. Estabilización óptica por desplazamiento del sensor, antes exclusiva de cámaras DSLR, permite fotos nítidas en condiciones difíciles. El chip A14 Bionic fue el primer procesador móvil de 5nm, estableciendo nuevos estándares de rendimiento. Pantalla Super Retina XDR de 6.7 pulgadas con Ceramic Shield ofrece protección 4 veces superior contra caídas. 5G para velocidades de descarga ultrarrápidas. MagSafe introduce un nuevo ecosistema de accesorios magnéticos. Grabación de video Dolby Vision HDR a 60fps.`,

  'iPhone 12 Pro': `El iPhone 12 Pro marcó el inicio de una nueva era de diseño iPhone con bordes planos de acero inoxidable. El chip A14 Bionic de 5nm ofrece rendimiento 50% superior en CPU y GPU. Sistema de triple cámara Pro de 12MP con escáner LiDAR para Modo Noche en retratos y AR mejorada. Pantalla Super Retina XDR de 6.1 pulgadas con tecnología OLED de última generación. Ceramic Shield protege 4 veces mejor contra caídas. Compatible con 5G en todas las bandas para conectividad futura. ProRAW combina la flexibilidad de RAW con el procesamiento de imagen de Apple. MagSafe permite accesorios magnéticos precisos.`,

  'iPhone 12': `El iPhone 12 democratizó las tecnologías premium con su diseño de bordes planos inspirado en el iPhone 5. El potente chip A14 Bionic ejecuta cualquier app con fluidez excepcional. Su pantalla Super Retina XDR de 6.1 pulgadas ofrece negros perfectos y colores vibrantes. Ceramic Shield en el frontal proporciona protección 4 veces superior contra caídas. Conectividad 5G para streaming, gaming y descargas ultrarrápidas. Sistema de doble cámara de 12MP con Modo Noche ahora disponible en ultra gran angular. MagSafe integrado para carga inalámbrica precisa y accesorios innovadores. Resistente al agua IP68 a 6 metros durante 30 minutos.`,

  'iPhone SE': `El iPhone SE es el iPhone más accesible con el rendimiento más potente de su categoría. El chip A15 Bionic, el mismo del iPhone 13 Pro, ofrece velocidad extraordinaria para apps, juegos y fotografía computacional. Su diseño compacto de 4.7 pulgadas con Touch ID integrado en el botón Home es familiar y cómodo. La cámara de 12MP con Deep Fusion y Smart HDR 4 captura fotos impresionantes con detalle y textura excepcionales. Modo Retrato con Control de Profundidad para retratos de calidad profesional. 5G para conectividad ultrarrápida. Resistente al agua IP67 y fabricado con el vidrio más resistente en un smartphone. Perfecto para quienes prefieren pantallas compactas con tecnología de vanguardia.`,
};

// Especificaciones técnicas por modelo
const productSpecs: Record<string, { chip: string; display: string; camera: string; features: string[] }> = {
  'iPhone 17 Pro Max': {
    chip: 'A19 Pro',
    display: '6.9" Super Retina XDR, 240Hz',
    camera: '48MP + 48MP + 12MP',
    features: ['8K ProRes', 'Apple Intelligence', 'Titanio', 'USB-C 3.2'],
  },
  'iPhone 17 Pro': {
    chip: 'A19 Pro',
    display: '6.3" Super Retina XDR, 120Hz',
    camera: '48MP + 48MP + 12MP',
    features: ['4K 120fps', 'Botón de Acción', 'Titanio', 'USB-C 3'],
  },
  'iPhone 16': {
    chip: 'A18',
    display: '6.1" Super Retina XDR',
    camera: '48MP + 12MP',
    features: ['Dynamic Island', 'Botón de Acción', 'USB-C', 'Apple Intelligence'],
  },
  'iPhone 15 Pro Max': {
    chip: 'A17 Pro',
    display: '6.7" Super Retina XDR, 120Hz',
    camera: '48MP + 12MP + 12MP (5x)',
    features: ['Titanio', 'USB-C 3', 'Video Espacial', 'Botón de Acción'],
  },
  'iPhone 15 Pro': {
    chip: 'A17 Pro',
    display: '6.1" Super Retina XDR, 120Hz',
    camera: '48MP + 12MP + 12MP (3x)',
    features: ['Titanio', 'USB-C 3', 'Botón de Acción', 'ProRes 4K'],
  },
  'iPhone 14 Pro Max': {
    chip: 'A16 Bionic',
    display: '6.7" Super Retina XDR, 120Hz',
    camera: '48MP + 12MP + 12MP',
    features: ['Dynamic Island', 'Always-On', 'ProRes', 'SOS Satélite'],
  },
  'iPhone 14 Pro': {
    chip: 'A16 Bionic',
    display: '6.1" Super Retina XDR, 120Hz',
    camera: '48MP + 12MP + 12MP',
    features: ['Dynamic Island', 'Always-On', 'ProRes', 'Photonic Engine'],
  },
  'iPhone 13 Pro': {
    chip: 'A15 Bionic',
    display: '6.1" Super Retina XDR, 120Hz',
    camera: '12MP + 12MP + 12MP (3x)',
    features: ['ProMotion', 'Modo Cine', 'ProRes', 'Macro'],
  },
};

// Configuración de cada grupo de imágenes con su modelo y color correctos
const productConfigs = [
  // Grupo 1 - iPhone dorado/naranja
  { model: 'iPhone 17 Pro Max', color: 'Naranja cósmico', basePrice: 2900000 },
  // Grupo 2 - iPhone azul medianoche
  { model: 'iPhone 13 Pro', color: 'Azul medianoche', basePrice: 1600000 },
  // Grupo 3 - iPhone blanco
  { model: 'iPhone 16', color: 'Blanco', basePrice: 2200000 },
  // Grupo 4 - iPhone negro
  { model: 'iPhone 14 Pro Max', color: 'Negro', basePrice: 1800000 },
  // Grupo 5 - iPhone rosa
  { model: 'iPhone 16', color: 'Rosa', basePrice: 2100000 },
];

// Función para obtener el grupo de imágenes de un producto
const getProductImages = (productIndex: number): string[] => {
  const groupIndex = productIndex % productImageGroups.length;
  return productImageGroups[groupIndex].map(toImageUrl);
};

// Función para obtener la configuración del producto
const getProductConfig = (productIndex: number) => {
  const groupIndex = productIndex % productConfigs.length;
  return productConfigs[groupIndex];
};

// Función para obtener la descripción del producto basada en el modelo
export function getProductDescription(model: string): string {
  // Buscar coincidencia exacta primero
  if (productDescriptions[model]) {
    return productDescriptions[model];
  }
  
  // Buscar coincidencia parcial
  const modelKey = Object.keys(productDescriptions).find(key => 
    model.includes(key) || key.includes(model)
  );
  
  if (modelKey) {
    return productDescriptions[modelKey];
  }
  
  // Descripción genérica si no se encuentra
  return `El ${model} es el smartphone de Apple que combina rendimiento excepcional con el ecosistema iOS más avanzado. Equipado con el chip más potente de su generación, ofrece fluidez incomparable en todas las tareas. Su sistema de cámara captura fotos y videos con calidad profesional. La pantalla Super Retina XDR muestra colores vibrantes y negros profundos. Resistente al agua y fabricado con materiales premium, es el compañero perfecto para el día a día. Compatible con todos los servicios de Apple y accesorios MagSafe.`;
}

// Función para obtener especificaciones del producto
export function getProductSpecs(model: string): { chip: string; display: string; camera: string; features: string[] } {
  const modelKey = Object.keys(productSpecs).find(key => 
    model.includes(key) || key.includes(model)
  );
  
  if (modelKey && productSpecs[modelKey]) {
    return productSpecs[modelKey];
  }
  
  return {
    chip: 'Apple Silicon',
    display: 'Super Retina XDR',
    camera: '12MP+',
    features: ['iOS', 'Face ID', 'MagSafe'],
  };
}

// Generador de productos mock
const generateMockProducts = () => {
  const storages = ['128 GB', '256 GB', '512 GB', '1 TB'];
  const sellers = [
    'OCEANGREEN ARGENTINA',
    'APPLE STORE OFICIAL',
    'iSTORE ARGENTINA',
    'CELLMARKET',
    'TECH HOUSE',
    'MACSTORE',
    'SKY-VISION',
    'APPLE PREMIUM',
    'GADGETS STORE',
    'PHONE WORLD',
  ];
  const conditions = ['Nuevo', 'Nuevo', 'Nuevo', 'Nuevo', 'Reacondicionado'];

  const products = [];
  
  // Generar 100 productos para tener al menos 10 páginas (10 items por página)
  for (let i = 0; i < 100; i++) {
    // Obtener configuración del producto según su grupo de imágenes
    const config = getProductConfig(i);
    const storage = storages[i % storages.length];
    const seller = sellers[i % sellers.length];
    const condition = conditions[i % conditions.length];
    
    // Obtener imágenes del grupo correspondiente
    const productImages = getProductImages(i);
    const mainImage = productImages[0];
    
    // Variación de precio determinística basada en el índice
    const priceVariation = 1 + ((i % 20) - 10) / 100;
    const amount = Math.round(config.basePrice * priceVariation);
    const hasDiscount = i % 4 === 2;
    const regularAmount = hasDiscount ? Math.round(amount * 1.1) : null;
    
    // Calcular cuotas
    const cuotas = i % 3 === 0 ? 12 : i % 2 === 0 ? 9 : 6;
    const cuotaAmount = Math.round(amount / cuotas);
    
    products.push({
      id: `MLA${1000000000 + i}`,
      title: `Apple ${config.model} (${storage}) - ${config.color}`,
      price: {
        currency: 'ARS',
        amount,
        decimals: 0,
        regular_amount: regularAmount,
      },
      picture: mainImage,
      pictures: productImages,
      condition: condition,
      free_shipping: true,
      installments: `Mismo precio en ${cuotas} cuotas de $ ${cuotaAmount.toLocaleString('es-AR')}`,
      seller_nickname: seller,
      color: config.color,
      model: config.model, // Guardamos el modelo para la descripción
    });
  }
  
  return products;
};

// Datos mock para cuando la API de ML no está disponible
export const mockSearchResults: SearchResponse = {
  categories: ['Celulares y Teléfonos', 'Celulares y Smartphones', 'Apple iPhone'],
  items: generateMockProducts(),
  paging: {
    total: 100,
    offset: 0,
    limit: 50,
  },
};

export const mockItemDetail: ItemDetailResponse = {
  item: {
    id: 'MLA1117020690',
    title: 'Apple iPhone 14 (128 GB) - Blanco estelar',
    price: {
      currency: 'ARS',
      amount: 1362836,
      decimals: 0,
      regular_amount: null,
    },
    pictures: getProductImages(0),
    condition: 'Nuevo',
    free_shipping: true,
    sold_quantity: 100,
    installments: 'Mismo precio en 9 cuotas de $ 151.426',
    description: getProductDescription('iPhone 14'),
    attributes: [
      { id: 'MAIN_COLOR', name: 'Color', value_name: 'Blanco estelar' },
      { id: 'BRAND', name: 'Marca', value_name: 'Apple' },
      { id: 'MODEL', name: 'Modelo', value_name: 'iPhone 14' },
      { id: 'INTERNAL_MEMORY', name: 'Memoria interna', value_name: '128 GB' },
    ],
    category_path_from_root: ['Celulares y Teléfonos', 'Celulares y Smartphones', 'Apple iPhone'],
    seller_nickname: 'OCEANGREEN ARGENTINA',
  },
};

// Funciones de utilidad para shuffle determinístico
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function shuffleArrayWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const random = seededRandom(seed);
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Función para filtrar items mock por búsqueda
export function filterMockItems(query: string, offset: number = 0): SearchResponse {
  const lowerQuery = query.toLowerCase();
  
  // Palabras clave que SÍ coinciden con nuestros productos mock
  const validKeywords = [
    'iphone', 'apple', 'celular', 'telefono', 'smartphone', 'movil',
    'pro', 'max', 'plus',
    '128', '256', '512', '1 tb', '1tb',
    'naranja', 'azul', 'blanco', 'negro', 'rosa', 'cosmico', 'medianoche',
    '13', '14', '16', '17',
    'nuevo', 'reacondicionado',
    'mla' // Para buscar por ID
  ];
  
  // Verificar si la búsqueda contiene alguna palabra clave válida
  const hasValidKeyword = validKeywords.some(keyword => 
    lowerQuery.includes(keyword)
  );
  
  const filteredItems = mockSearchResults.items.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.id.toLowerCase().includes(lowerQuery)
  );

  // Si no hay coincidencias Y no es una palabra clave válida, devolver vacío
  if (filteredItems.length === 0 && !hasValidKeyword) {
    return {
      ...mockSearchResults,
      items: [],
      paging: {
        total: 0,
        offset,
        limit: 50,
      },
    };
  }

  const baseItems = filteredItems.length > 0 ? filteredItems : mockSearchResults.items;
  const seed = stringToSeed(lowerQuery);
  const shuffledItems = shuffleArrayWithSeed(baseItems, seed);

  return {
    ...mockSearchResults,
    items: shuffledItems.slice(offset, offset + 50),
    paging: {
      total: baseItems.length,
      offset,
      limit: 50,
    },
  };
}

// Función para obtener detalle de item mock
export function getMockItemDetail(itemId: string): ItemDetailResponse {
  const item = mockSearchResults.items.find((i) => i.id === itemId);

  if (item) {
    const colorMatch = item.title.match(/- ([^-]+)$/);
    const color = colorMatch ? colorMatch[1].trim() : 'Blanco estelar';
    
    // Extraer el modelo del título
    const modelMatch = item.title.match(/Apple (iPhone[^(]+)/);
    const model = modelMatch ? modelMatch[1].trim() : 'iPhone';
    
    // Extraer almacenamiento
    const storageMatch = item.title.match(/\(([^)]+)\)/);
    const storage = storageMatch ? storageMatch[1] : '128 GB';
    
    // Obtener descripción y especificaciones basadas en el modelo
    const description = getProductDescription(model);
    const specs = getProductSpecs(model);
    
    // Generar sold_quantity determinístico
    const itemIndex = parseInt(itemId.replace('MLA', '')) - 1000000000;
    const soldQuantity = 50 + (itemIndex * 7) % 450;
    
    return {
      item: {
        id: item.id,
        title: item.title,
        price: item.price,
        pictures: (item as any).pictures || getProductImages(0),
        condition: item.condition,
        free_shipping: item.free_shipping,
        sold_quantity: soldQuantity,
        installments: item.installments,
        description: description,
        attributes: [
          { id: 'MAIN_COLOR', name: 'Color', value_name: color },
          { id: 'BRAND', name: 'Marca', value_name: 'Apple' },
          { id: 'MODEL', name: 'Modelo', value_name: model },
          { id: 'INTERNAL_MEMORY', name: 'Memoria interna', value_name: storage },
          { id: 'PROCESSOR', name: 'Procesador', value_name: specs.chip },
          { id: 'DISPLAY', name: 'Pantalla', value_name: specs.display },
          { id: 'CAMERA', name: 'Cámara', value_name: specs.camera },
        ],
        category_path_from_root: mockSearchResults.categories,
        seller_nickname: item.seller_nickname,
      },
    };
  }

  return mockItemDetail;
}
