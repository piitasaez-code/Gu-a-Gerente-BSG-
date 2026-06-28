export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  sections: {
    title: string;
    content: string;
    table?: {
      headers: string[];
      rows: string[][];
      caption?: string;
    };
    bullets?: string[];
    tips?: string[];
    examples?: string[];
    diagramType?: 'flow' | 'grid' | 'comparison' | 'hierarchy' | 'formula';
  }[];
  quiz: QuizQuestion[];
}

export const GLOSSARY: GlossaryItem[] = [
  {
    term: "S/Q Rating (Calificación de Estrellas)",
    definition: "La calificación otorgada por la Federación Internacional del Calzado (IFF) que mide los estilos y la calidad de las zapatillas en una escala de 0.0 a 10.0 estrellas. Está determinada por cinco factores clave de diseño, materiales y capacitación."
  },
  {
    term: "EPS (Ganancia por Acción)",
    definition: "Beneficio neto de la empresa dividido entre el número de acciones en circulación (Earnings Per Share). Es un indicador financiero crucial con objetivos de crecimiento establecidos por la junta directiva."
  },
  {
    term: "ROE (Retorno sobre el Capital)",
    definition: "Ingreso neto dividido entre el capital contable promedio de los accionistas. Mide la rentabilidad que genera la empresa con el dinero invertido por sus socios."
  },
  {
    term: "Precio de la Acción",
    definition: "Valor bursátil determinado por la junta directiva y el mercado, influido por el crecimiento de ingresos, EPS, ROE, calificación de crédito, dividendos decretados y recompra de acciones."
  },
  {
    term: "Calificación de Crédito",
    definition: "La solvencia financiera de la compañía medida de A+ (máxima) a C- (mínima). Evaluada en base al ratio de cobertura de intereses, ratio deuda/activo y el ratio de riesgo de impago."
  },
  {
    term: "Conflicto de Canales",
    definition: "Ocurre en marketing cuando el precio de venta en línea (Internet) es demasiado bajo en comparación con el precio ofrecido a detallistas (Wholesale). El manual recomienda mantener un precio en línea al menos un 40% superior al precio de venta al detallista para evitarlo."
  },
  {
    term: "Marca Privada (Private Label)",
    definition: "Segmento de mercado donde la empresa produce calzado genérico bajo la marca de grandes cadenas de descuento, utilizando su capacidad ociosa de producción para prorratear costos fijos."
  },
  {
    term: "Material Superior",
    definition: "Materia prima de alta calidad con un costo base de $12 por par (frente a los $6 del material estándar). Incrementa directamente el S/Q Rating y la calidad del producto final."
  },
  {
    term: "TQM / Seis Sigma",
    definition: "Programas de control y mejora continua de la calidad (Total Quality Management). Invertir en TQM disminuye la tasa de rechazo, reduce desechos de material, y mejora el S/Q Rating tanto en marca propia como privada."
  },
  {
    term: "Tasa de Rechazo (Defectos)",
    definition: "Porcentaje de pares con defectos de fabricación que son rechazados en el control de calidad. Todos los pares rechazados son donados automáticamente a organizaciones de caridad."
  },
  {
    term: "Recompra de Acciones",
    definition: "Decisión de utilizar efectivo para retirar acciones del mercado, lo cual reduce las acciones circulantes, e incrementa automáticamente el EPS, el ROE y el precio de la acción. Solo permitido si el precio es superior a $15."
  },
  {
    term: "Lobby Corporativo",
    definition: "Punto de acceso principal del simulador BSG donde se muestra información del mercado, las tasas de interés actuales, los impactos en el tipo de cambio y el tablero de calificaciones generales."
  },
  {
    term: "Material POP (Point of Purchase)",
    definition: "Material de soporte promocional entregado a los detallistas en sus puntos de venta (exhibidores, folletos, señalética) para impulsar la venta de la marca."
  },
  {
    term: "Liquidación de Inventario",
    definition: "Decisión estratégica de vender stock no vendido del año anterior a detallistas aplicando un descuento especial. Ayuda a evitar el costo de almacenamiento de $1.00 por par."
  },
  {
    term: "Horas Extra",
    definition: "Tiempo de trabajo que excede las 40 horas semanales regulares, pagado con un recargo de 1.5 veces el salario base. Permite aumentar la producción de una planta hasta en un 20% sobre su capacidad nominal."
  }
];

export const CHAPTERS: Chapter[] = [
  {
    id: "1-introduccion",
    title: "1. Introducción al Simulador BSG",
    subtitle: "Cómo funciona y condiciones de inicio",
    summary: "The Business Strategy Game (BSG) es una simulación de negocios en línea donde gestionas una empresa global de zapatillas deportivas compitiendo directamente con otras empresas administradas por tus compañeros de curso. Todas las empresas comienzan en igualdad de condiciones en el año 11.",
    sections: [
      {
        title: "Condiciones Iniciales de la Empresa",
        content: "Al tomar el control de la compañía en el décimo aniversario (las decisiones se toman para el Año 11), la empresa se encuentra en una posición sólida con las siguientes métricas clave de desempeño:",
        bullets: [
          "Ventas anuales: Más de 8 millones de pares al año.",
          "Ingresos netos del año anterior: US$ 442.2 millones.",
          "Utilidad neta: US$ 40 millones, lo que equivale a una ganancia por acción (EPS) de US$ 2.00.",
          "Precio inicial de la acción: Cerró a US$ 30 al final del Año 10 (triplicado desde su valor en el Año 6 cuando la empresa se hizo pública).",
          "Acciones circulantes: 20 millones de acciones en circulación.",
          "Calificación de imagen: 70 puntos iniciales.",
          "Calificación crediticia inicial: Calificación de 'B'."
        ],
        diagramType: "grid"
      },
      {
        title: "Estructura Operativa Global",
        content: "La empresa opera en cuatro regiones geográficas principales tanto para marketing como para ventas, y posee actualmente dos plantas de producción físicas instaladas.",
        bullets: [
          "Planta de Norteamérica: Cuenta con espacio de infraestructura para albergar hasta 5 millones de pares de zapatillas anuales en horario regular. La administración anterior compró maquinaria para producir 4 millones de pares.",
          "Planta de Asia-Pacífico: Cuenta con espacio físico para albergar hasta 6 millones de pares. Tiene maquinaria instalada para producir 4 millones de pares.",
          "Capacidad Instalada Total: 9,600,000 pares anuales (8 millones en horario regular y 1.6 millones utilizando horas extras máximas del 20%).",
          "Capacidad Potencial de Expansión: Hasta 13,200,000 pares si se compra la maquinaria faltante para llenar el espacio existente."
        ],
        diagramType: "comparison"
      },
      {
        title: "Navegación e Interfaz de Decisiones",
        content: "A través del Lobby Corporativo, haciendo clic en 'Go to Decisions/Reports', accedes al simulador. Las decisiones se ingresan en páginas interactivas agrupadas en producción, marketing, finanzas, etc. El simulador recalcula de inmediato proyecciones dinámicas de EPS, ROE, saldo de caja, índice de crédito y calificación de imagen basándose en los datos ingresados.",
        tips: [
          "¡Recuerda GUARDAR! Siempre haz clic en 'Save' en la esquina superior derecha antes de la hora de cierre de la ronda. El simulador procesará el último guardado de cualquiera de los integrantes del equipo.",
          "El simulador cuenta con un botón 'Help' en la esquina superior derecha de cada pantalla que contiene tutoriales en video detallados y explicaciones exactas de fórmulas matemáticas."
        ]
      }
    ],
    quiz: [
      {
        id: 11,
        question: "¿En qué año de vida de la compañía asume el equipo directivo y para qué año se toma la primera ronda de decisiones?",
        options: [
          "Asume en el año 1 y decide para el año 2.",
          "Asume en el año 10 y decide para el año 11.",
          "Asume en el año 5 y decide para el año 6.",
          "Asume en el año 11 y decide para el año 12."
        ],
        correctAnswerIndex: 1,
        explanation: "La guía indica textualmente que el equipo gerencial inicia sus funciones en el décimo aniversario de la compañía, y la primera ronda de decisiones se toma para el año 11."
      },
      {
        id: 12,
        question: "¿Cuál es la capacidad máxima anual instalada que tiene la empresa al inicio (incluyendo horas extra)?",
        options: [
          "8,000,000 de pares.",
          "13,200,000 de pares.",
          "9,600,000 de pares.",
          "11,000,000 de pares."
        ],
        correctAnswerIndex: 2,
        explanation: "La empresa cuenta con una capacidad instalada de 9,600,000 pares (8 millones en horario regular y 1.6 millones en horas extras). Su capacidad potencial máxima con toda la maquinaria es de 13,200,000 pares."
      },
      {
        id: 13,
        question: "Si dos miembros del equipo realizan cambios y graban, ¿cuál versión se utiliza para el cierre de ronda?",
        options: [
          "La primera grabación que se realizó.",
          "La última grabación realizada por cualquiera de los integrantes del equipo.",
          "Solo la del integrante designado como presidente de la compañía.",
          "El simulador promedia automáticamente ambas grabaciones."
        ],
        correctAnswerIndex: 1,
        explanation: "El manual detalla que la última grabación realizada por cualquiera de los participantes del equipo, antes del cierre de ronda, será la que se utilice como información de la empresa en la simulación."
      }
    ]
  },
  {
    id: "2-mercado-y-canales",
    title: "2. Mercado Mundial y Canales de Distribución",
    subtitle: "Crecimiento proyectado, aranceles y los tres canales de venta",
    summary: "La demanda mundial de calzado deportivo es fuerte y crece año tras año. La empresa comercializa su calzado a través de tres canales de distribución: detallistas autorizados (Venta Mayorista), clientes en línea (Comercio Electrónico), y marcas blancas para minoristas de descuento (Marca Privada).",
    sections: [
      {
        title: "Tasas de Crecimiento de Demanda Proyectada",
        content: "El crecimiento proyectado de la demanda anual varía entre regiones y entre segmentos temporales del juego. Durante los años 11 al 15 el crecimiento es mayor, reduciéndose en el tramo de los años 16 al 20.",
        table: {
          headers: ["Años", "Segmento", "Norteamérica", "Europa-África", "Asia-Pacífico", "Latinoamérica", "Mundial"],
          rows: [
            ["Años 11-15", "Marca Propia (Wholesale / Internet)", "5% - 7%", "5% - 7%", "9% - 11%", "9% - 11%", "7% - 9%"],
            ["Años 11-15", "Marca Privada (Private Label)", "10% - 12%", "10% - 12%", "12% - 14%", "12% - 14%", "11% - 13%"],
            ["Años 16-20", "Marca Propia (Wholesale / Internet)", "3% - 5%", "3% - 5%", "7% - 9%", "7% - 9%", "5% - 7%"],
            ["Años 16-20", "Marca Privada (Private Label)", "8% - 10%", "8% - 10%", "10% - 12%", "10% - 12%", "9% - 11%"]
          ],
          caption: "Tabla: Tasas anuales estimadas de crecimiento de la demanda en BSG."
        }
      },
      {
        title: "Los Tres Canales de Distribución",
        content: "Cada canal posee sus propias características comerciales, costos y sensibilidades:",
        bullets: [
          "1. Venta Mayorista (Wholesale): Calzado con marca enviado a tiendas detallistas físicas asociadas (existen aprox. 60,000 en el mundo; 20,000 en Norteamérica, 20,000 en Europa, 10,000 en Latinoamérica y 10,000 en Asia-Pacífico). El margen minorista varía entre un 40% (cadenas de descuento) y un 100% (tiendas premium) sobre el precio de entrega al centro de distribución.",
          "2. Comercio Electrónico (Internet): Ventas directas al consumidor final desde el sitio web regional de la compañía. Representa inicialmente el 15% de la demanda, con una proyección adicional del 1% anual hasta llegar al 25% en el año 20. El precio máximo permitido es de US$ 200.",
          "3. Marca Privada (Private Label): Producción terciarizada sin marca para grandes cadenas minoristas de descuento. Ofrece un crecimiento del 12% anual (años 11-15) y es muy útil para aprovechar la capacidad de planta ociosa y prorratear costos fijos."
        ]
      },
      {
        title: "Centros de Distribución Regionales y Aranceles",
        content: "La empresa cuenta con cuatro centros de distribución regionales, uno en cada zona geográfica. El calzado terminado se envía directamente desde las plantas de producción. Cada región aplica impuestos de importación (aranceles) si las zapatillas se fabricaron fuera de sus fronteras.",
        table: {
          headers: ["Región de Destino", "Ubicación del Centro", "País", "Tarifa de Importación (por par)"],
          rows: [
            ["Norteamérica", "Memphis, Tennessee", "Estados Unidos", "$4.00 por par"],
            ["Europa-África", "Milán", "Italia", "$6.00 por par"],
            ["Asia-Pacífico", "Bangkok", "Tailandia", "$8.00 por par"],
            ["Latinoamérica", "Río de Janeiro", "Brasil", "$10.00 por par"]
          ]
        },
        tips: [
          "Los aranceles son modificables por el instructor. Para evitar el impacto de las tarifas arancelarias, una estrategia sólida consiste en construir plantas locales en las regiones que cobran aranceles más altos (como Latinoamérica o Asia-Pacífico) para abastecer el mercado regional sin cruzar fronteras."
        ]
      }
    ],
    quiz: [
      {
        id: 21,
        question: "¿Qué porcentaje de las ventas totales representa inicialmente la demanda de Internet y cómo se proyecta hacia el año 20?",
        options: [
          "Representa el 10% y llegará al 15% en el año 20.",
          "Representa el 15% y crecerá 1% anual hasta representar el 25% el año 20.",
          "Representa el 25% y se reducirá al 15% debido a la competencia.",
          "Representa el 5% y subirá hasta el 30%."
        ],
        correctAnswerIndex: 1,
        explanation: "La guía especifica que la demanda en Internet representa el 15% de las ventas totales al inicio y tiene una proyección adicional de crecimiento de 1% anual hasta representar el 25% de las ventas en el año 20."
      },
      {
        id: 22,
        question: "¿Qué región tiene el arancel de importación más alto por calzado producido fuera de ella?",
        options: [
          "Norteamérica ($4.00 por par)",
          "Europa-África ($6.00 por par)",
          "Asia-Pacífico ($8.00 por par)",
          "Latinoamérica ($10.00 por par)"
        ],
        correctAnswerIndex: 3,
        explanation: "La tabla de tarifas de importación del manual muestra que Latinoamérica cobra $10.00 por par importado, siendo el arancel más costoso de la simulación."
      },
      {
        id: 23,
        question: "¿Cuál es el precio máximo de venta permitido en el canal de Internet (comercio electrónico)?",
        options: [
          "US$ 100 por par.",
          "US$ 150 por par.",
          "US$ 200 por par.",
          "No tiene límite máximo."
        ],
        correctAnswerIndex: 2,
        explanation: "El manual declara explícitamente en la sección de Marketing de Internet que 'El precio máximo permitido es de US$ 200 por par'."
      }
    ]
  },
  {
    id: "3-calidad-y-materiales",
    title: "3. Calificación de Estrellas (S/Q) y Materiales",
    subtitle: "Cómo se calcula la calidad y el comportamiento del mercado de commodities",
    summary: "El S/Q Rating (calificación de estilo y calidad de 0.0 a 10.0 estrellas) es determinado por la Federación Internacional del Calzado (IFF). Para lograrlo, debes balancear el uso de materiales estándar y superiores, la inversión en calidad y la capacitación técnica del personal.",
    sections: [
      {
        title: "Los Cinco Factores de la Calificación S/Q",
        content: "La Federación Internacional del Calzado calcula anualmente la puntuación S/Q basándose en factores medidos en cada planta de producción:",
        bullets: [
          "1. Gasto anual en modelos, estilos y características por par.",
          "2. Porcentaje de material superior utilizado (la mezcla entre material superior y estándar).",
          "3. Gasto anual en el Programa de Calidad Total (TQM) y/o Seis Sigma.",
          "4. Gastos acumulados en programas de calidad (que refleja el aprendizaje institucional a lo largo de las gestiones).",
          "5. Gasto anual y acumulado en capacitación de los trabajadores en mejores prácticas de producción."
        ],
        tips: [
          "¡Pérdida por obsolescencia de moda! El calzado que queda acumulado como inventario no vendido del año anterior sufre una penalización automática de 0.3 estrellas de calidad aplicada por la IFF por considerarse calzado pasado de temporada."
        ]
      },
      {
        title: "La Provisión de Materiales y Variaciones del Mercado",
        content: "Los materiales estándar y superiores se adquieren en un mercado abierto global regulado por la oferta y la demanda. Los precios base teóricos son de US$ 6.00 por par para el material estándar (100% estándar) y US$ 12.00 por par para el material superior (100% superior). Sin embargo, el precio real fluctúa según dos reglas importantes de volatilidad:",
        bullets: [
          "1. Variación por Demanda (Mix de Materiales): Si la mezcla promedio de compra global de la industria se desvía del estándar de 60% estándar y 40% superior, los precios cambian. El precio de materiales estándar sube un 2% por cada 1% que la demanda mundial de material superior supere el 60%. En cambio, el precio del material superior disminuye un 0.5% por cada 1% que la demanda de este baje del 40%.",
          "2. Variación por Producción Mundial (Presión del Proveedor): El precio de ambos materiales disminuye un 1% por cada 1% que la producción mundial de calzado sea menor al 95% de la capacidad de la industria. Si la producción mundial excede el 110%, el precio se incrementa un 1% por cada 1% adicional debido a la escasez de recursos y el poder de negociación de los 250 proveedores globales."
        ],
        diagramType: "formula"
      }
    ],
    quiz: [
      {
        id: 31,
        question: "¿Qué penalización aplica la Federación Internacional del Calzado (IFF) al inventario acumulado no vendido del año anterior?",
        options: [
          "Una reducción de 1.0 estrella de calidad.",
          "Una reducción de 0.3 estrellas de calidad.",
          "No hay penalización, se vende como nuevo.",
          "Una penalización de $2.00 por par en costos de envío."
        ],
        correctAnswerIndex: 1,
        explanation: "La guía del gerente establece textualmente que 'Debido a la evolución de la moda la IFF's reduce 0.3 estrellas a los pares no vendidos el año anterior'."
      },
      {
        id: 32,
        question: "¿Cuáles son los precios base por par para materiales 100% estándar y 100% superiores respectivamente?",
        options: [
          "US$ 5.00 y US$ 10.00",
          "US$ 6.00 y US$ 12.00",
          "US$ 4.00 y US$ 8.00",
          "US$ 10.00 y US$ 20.00"
        ],
        correctAnswerIndex: 1,
        explanation: "La guía indica que 'El precio base de los materiales son de $6 para un par hecho 100% en material estándar y $12 para un par 100% de material superior'."
      },
      {
        id: 33,
        question: "¿Qué sucede con el precio de compra de los materiales si la producción mundial de la industria supera el 110% de la capacidad instalada?",
        options: [
          "El precio disminuye por economía de escala de los proveedores.",
          "El precio de los materiales se incrementa un 1% por cada 1% superior debido al mayor poder de negociación de los proveedores.",
          "Los precios se congelan automáticamente.",
          "Aumenta la tasa de rechazo un 50%."
        ],
        correctAnswerIndex: 1,
        explanation: "Según la sección 'Variación por producción', 'Cuando la producción excede 110% el precio se incrementa 1% por cada 1% superior, debido a que se incrementa el poder de negociación de los proveedores'."
      }
    ]
  },
  {
    id: "4-factores-competitivos",
    title: "4. Factores Competitivos y de Mercado",
    subtitle: "Los 13 elementos comerciales que deciden tus ventas en la industria",
    summary: "Tus ventas y participación de mercado dependen directamente de tu competitividad relativa en comparación con tus rivales en la industria. Existen 13 factores de marketing y de servicio que determinan el atractivo de tu marca.",
    sections: [
      {
        title: "Los Tres Pilares de la Estrategia Genérica",
        content: "Aunque existen 13 factores que influyen en las decisiones del consumidor, los estudios de mercado demuestran que los tres factores más determinantes en las ventas globales son:",
        bullets: [
          "1. El Precio: Precio minorista para detallistas (Wholesale Price) y precio de venta directa online (Internet Price).",
          "2. La Calificación S/Q (Estrellas de Calidad).",
          "3. La Amplitud de Línea: El número de modelos y estilos ofrecidos en tu catálogo de productos."
        ]
      },
      {
        title: "Los 13 Factores Competitivos Clasificados",
        content: "La competencia en el mercado se rige por factores que afectan a los distintos canales:",
        bullets: [
          "Factores de Mercado Compartido (Internet y Detallistas): Calificación de calidad/estilos (S/Q), Número de modelos/estilos, Presupuesto de Publicidad, Imagen de celebridades contratadas, Imagen y reputación de marca.",
          "Factores Exclusivos de Detallistas (Wholesale): Precio de venta al detallista, Número de detallistas autorizados en la región, Tiempo de entrega (1 a 4 semanas), Soporte promocional con material POP, Rebajas promocionales por correo (mail-in rebates de $3 a $15 por par).",
          "Factores Exclusivos de Internet (Online): Precio en el sitio web regional, Presupuesto de publicidad en buscadores, Opción de envío gratuito (free shipping)."
        ]
      },
      {
        title: "La Regla de Oro de la Competencia",
        content: "El manual aclara una de las dinámicas críticas del juego: la importancia de cada factor competitivo NO es fija. El peso de un factor depende exclusivamente de la diferencia de tu oferta respecto al promedio de la industria de la región. Si todos los competidores fijan precios y publicidad similares, la diferenciación se traslada al 100% en otros factores como el S/Q o el número de modelos. Cuanto más te alejes del promedio regional (ofreciendo una gran ventaja), mayor será el peso de ese factor comercial en la atracción de clientes.",
        tips: [
          "¡Cuidado con el Conflicto de Canales! Los detallistas físicos independientes esperan que el precio en tu sitio web sea al menos un 40% superior al precio mayorista que les ofreces a ellos. Si reduces demasiado la brecha, los detallistas se quejarán, disminuirán tu promoción, reducirán sus pedidos o dejarán de vender tu marca al siguiente año."
        ]
      }
    ],
    quiz: [
      {
        id: 41,
        question: "¿Cuáles son considerados los tres factores competitivos más importantes e influyentes según la regla general del manual?",
        options: [
          "Publicidad, Rebajas por correo y Celebridades.",
          "Precio, Calificación S/Q y Número de modelos/estilos.",
          "Tiempo de entrega, Soporte POP y Aranceles.",
          "Responsabilidad social corporativa, Préstamos bancarios e Impuestos."
        ],
        correctAnswerIndex: 1,
        explanation: "La guía menciona textualmente en el Capítulo 9: 'Como regla general, los tres factores competitivos más importantes son: Precio, Calificación S/Q y número de modelos/estilos ofrecidos, en ellos se traduce la estrategia genérica'."
      },
      {
        id: 42,
        question: "Para evitar un conflicto de canales perjudicial, ¿cuál debe ser la diferencia mínima recomendada entre el precio de Internet y el precio mayorista a detallistas?",
        options: [
          "El precio de Internet debe ser un 10% menor.",
          "El precio de Internet debe ser al menos un 40% superior al precio que se ofrece a detallistas.",
          "Deben ser exactamente idénticos.",
          "El precio a detallistas debe ser un 50% superior."
        ],
        correctAnswerIndex: 1,
        explanation: "El manual indica en el Capítulo 11.5 que los detallistas recomiendan una diferencia de al menos 40% entre el precio en Internet y el precio mayorista (Wholesale) para mantener su margen de ganancia competitivo y evitar la canibalización."
      },
      {
        id: 43,
        question: "¿Cuál es el rango permitido para ofrecer reembolsos/rebajas por correo (mail-in rebates) a detallistas?",
        options: [
          "Entre US$ 1 y US$ 5 por par.",
          "Entre US$ 5 y US$ 25 por par.",
          "Entre US$ 3 y US$ 15 por par.",
          "No hay límite establecido."
        ],
        correctAnswerIndex: 2,
        explanation: "En la sección de Rebajas por correo se indica: 'Las rebajas por correo, pueden ser de entre US$3 y US$15 por par'."
      }
    ]
  },
  {
    id: "5-tipo-de-cambio",
    title: "5. Impacto del Tipo de Cambio",
    subtitle: "Cómo afectan las fluctuaciones de divisas a tus costos e ingresos",
    summary: "Dado que la empresa produce en una región e importa a otra, las fluctuaciones del mercado de divisas real afectan tanto tus márgenes de producción como los ingresos repatriados. En el Año 11 no existen ajustes por tipo de cambio, pero a partir del Año 12 debes vigilar este riesgo.",
    sections: [
      {
        title: "Las Cuatro Divisas Oficiales del Simulador",
        content: "El simulador vincula las operaciones con monedas del mundo real en base a la ubicación de fabricación y ventas:",
        bullets: [
          "Norteamérica: Dólar de Estados Unidos (US$)",
          "Europa-África: Euro (€)",
          "Asia-Pacífico: Dólar de Singapur (Sing$)",
          "Latinoamérica: Real brasileño (R$)"
        ],
        diagramType: "comparison"
      },
      {
        title: "Los Dos Impactos Financieros del Tipo de Cambio",
        content: "El tipo de cambio afecta a tu empresa de dos formas independientes y complementarias:",
        bullets: [
          "1. Impacto en Costos de Producción: Ocurre cuando un par es fabricado en una planta regional y transferido a un centro de distribución en otra región geográfica. El costo unitario se ajusta según la variación de tipo de cambio entre el momento de fabricación e importación (periodo de envío de 3 a 6 semanas).",
          "2. Impacto en Ingresos: Ocurre cuando el corporativo central (en dólares americanos US$) consolida contablemente las ventas de las filiales regionales que cobran a detallistas locales en Euros (€), Dólares de Singapur (Sing$), o Reales brasileños (R$). Las variaciones se traducen en un ajuste porcentual de ingresos (favorable o desfavorable)."
        ]
      },
      {
        title: "Fórmula de Proyección del Ajuste",
        content: "El simulador BSG automatiza estos cálculos simulando la volatilidad real. El tamaño del ajuste de tipo de cambio aplicado en el juego es igual a cinco (5) veces la fluctuación porcentual de la moneda en el mercado real en ese periodo. El ajuste máximo aplicable está topado en un ±20% entre periodos consecutivos.",
        tips: [
          "¡Consejo del manual! Puedes ver por adelantado en el Lobby Corporativo cuál será el ajuste proyectado para la siguiente gestión. Si el tipo de cambio proyectado en una región es altamente desfavorable, una estrategia de mitigación consiste en reducir la inversión en marketing y desviar los envíos de producción hacia regiones con tipos de cambio más favorables para proteger los márgenes."
        ]
      }
    ],
    quiz: [
      {
        id: 51,
        question: "¿Qué divisa oficial se asocia a la región Asia-Pacífico en el simulador?",
        options: [
          "Yen japonés (¥)",
          "Dólar de Singapur (Sing$)",
          "Yuan chino (RMB)",
          "Dólar estadounidense (US$)"
        ],
        correctAnswerIndex: 1,
        explanation: "La tabla de Monedas por mercado detalla expresamente que la moneda para el mercado de Asia-Pacífico es el Sing$ (Dólar de Singapur)."
      },
      {
        id: 52,
        question: "¿De cuánto es el ajuste del tipo de cambio durante el Año 11 del juego?",
        options: [
          "Es del 10% fijo.",
          "Es igual a 5 veces la inflación real.",
          "No existen ajustes de tipo de cambio en el año 11.",
          "Depende de la planta de producción elegida."
        ],
        correctAnswerIndex: 2,
        explanation: "El manual aclara expresamente en la sección 11.5.1 que 'En el año 11 no existe este ajuste' de tipo de cambio."
      },
      {
        id: 53,
        question: "¿Cuál es el tope o límite máximo permitido para el ajuste de tipo de cambio entre periodos consecutivos?",
        options: [
          "No tiene límites.",
          "Es de un máximo del 5%.",
          "Es de un máximo del 20% (favorable o desfavorable).",
          "Es de un máximo del 50%."
        ],
        correctAnswerIndex: 2,
        explanation: "La guía indica que 'debido a que las fluctuaciones de tipo de cambio son volátiles, el ajuste máximo entre periodos es de un máximo de 20%'."
      }
    ]
  },
  {
    id: "6-toma-de-decisiones-rrhh",
    title: "6. Decisiones Operativas: Compensación y Productividad",
    subtitle: "Cómo optimizar la fuerza de trabajo en tus plantas de producción",
    summary: "La productividad de tu personal y la tasa de pares defectuosos dependen directamente de las políticas de recursos humanos que apliques en tus plantas. Existen 6 decisiones clave de compensación laboral.",
    sections: [
      {
        title: "Las 6 Decisiones de Recursos Humanos",
        content: "Para cada planta de producción (Norteamérica y Asia-Pacífico) se deben configurar individualmente:",
        bullets: [
          "1. Porcentaje de aumento o disminución del salario base de los trabajadores (ajuste máximo permitido de +15% anual y reducción de hasta -10% anual).",
          "2. Pago de incentivo monetario por cada par producido que supere la inspección de calidad sin defectos.",
          "3. Costo y cobertura del paquete de beneficios anuales de salud y prestaciones de los trabajadores.",
          "4. Presupuesto anual de inversión en capacitación técnica para mejores prácticas de manufactura.",
          "5. Ratio supervisor/trabajador (cantidad de supervisores contratados por plantilla).",
          "6. Incremento porcentual de salario y beneficios para los supervisores de la planta."
        ]
      },
      {
        title: "Factores que Determinan la Productividad Laboral",
        content: "La productividad (cantidad de zapatillas producidas por cada operario por año) influye directamente en tus costos de producción unitarios y es regulada por 9 factores dinámicos del manual:",
        bullets: [
          "Aumentan la Productividad (+): Escala de salario base competitiva, montos atractivos de incentivos por par libre de defectos, un paquete completo de beneficios, mayor capacitación técnica acumulada, salarios competitivos para supervisores, instalación de nuevo equipamiento de fábrica, y la aplicación de la mejora de planta Opción D (+50% de productividad).",
          "Disminuyen la Productividad (-): Un número excesivamente alto de modelos producidos en la planta (el operario debe pasar tiempo ajustando y cambiando técnicas, reduciendo su especialización)."
        ]
      },
      {
        title: "Estrategias de Capacitación Recomendadas",
        content: "Invertir continuamente en la capacitación del personal genera 4 retornos masivos para tu fábrica: disminuye la tasa de rechazo de pares, mejora la calidad S/Q del calzado final (marca propia y privada), disminuye el desperdicio de materiales, y aumenta la productividad anual. En el Año 10 se gastaron $77.5 millones en total. Invertir en capacitación es un motor central para lograr ventajas competitivas sostenibles de costos a largo plazo (el manual estima retornos de ahorro del 5% al 10% en primeros años, y hasta el 20% anual acumulado en el largo plazo).",
        tips: [
          "¡Ojo con la tasa de rechazo! Al inicio, la tasa de rechazo fue de 7% en Norteamérica y 10.1% en Asia-Pacífico. Reducir esta tasa optimiza el uso de materiales. Recuerda que la empresa tiene una política de donar todas las zapatillas con fallas de control de calidad a organizaciones de caridad."
        ]
      }
    ],
    quiz: [
      {
        id: 61,
        question: "¿Cuáles fueron las tasas de rechazo iniciales en las plantas de Norteamérica y Asia-Pacífico en el Año 10?",
        options: [
          "2% en Norteamérica y 5% en Asia-Pacífico.",
          "7% en Norteamérica y 10.1% en Asia-Pacífico.",
          "10% en Norteamérica y 10% en Asia-Pacífico.",
          "Fueron de 0.5% en ambas debido a los robots."
        ],
        correctAnswerIndex: 1,
        explanation: "La guía estipula en la sección 11.2.1 que 'El año 10, la tasa de rechazo fue de 7% en Norteamérica y 10.1% en la planta de Asia-Pacífico'."
      },
      {
        id: 62,
        question: "¿Qué ocurre con las zapatillas que no superan la inspección de calidad y son rechazadas por defectos?",
        options: [
          "Se desarman para reutilizar el 100% del material.",
          "Se venden en el mercado de Marca Privada a mitad de precio.",
          "Se donan en su totalidad a organizaciones de caridad como política corporativa.",
          "Se queman y generan costos ambientales."
        ],
        correctAnswerIndex: 2,
        explanation: "El manual detalla expresamente: 'Es una política de la empresa donar todos los pares rechazados a organizaciones de caridad'."
      },
      {
        id: 63,
        question: "¿Cuál es el ajuste máximo permitido para incrementos o reducciones salariales anuales de los operarios?",
        options: [
          "Incremento máximo del 50% y reducción de hasta 20%.",
          "Incremento máximo de 15% y disminución de hasta 10% anual.",
          "Aumentos libres, pero no se permiten reducciones.",
          "Solo se permite modificar un 5% fijo anual."
        ],
        correctAnswerIndex: 1,
        explanation: "La sección de factores que afectan la productividad indica que 'El incremento máximo anual es 15%. Disminuciones en salarios son permitidos, hasta en un 10% anual'."
      }
    ]
  },
  {
    id: "7-produccion-mejoras-y-plantas",
    title: "7. Producción: Ampliaciones y Mejoras de Planta",
    subtitle: "Inversiones de capital para automatizar y mejorar la fábrica",
    summary: "Para satisfacer la creciente demanda, la empresa puede expandir el espacio de sus fábricas físicas, comprar nueva maquinaria (o de segunda mano restaurada), y aplicar 4 opciones distintas de mejoras de equipamiento tecnológico.",
    sections: [
      {
        title: "Ampliación de Fábricas y Costos de Construcción",
        content: "La empresa puede decidir ampliar los metros cuadrados de las plantas de Norteamérica y Asia-Pacífico, o levantar nuevas instalaciones físicas en Europa-África o Latinoamérica. Toda construcción tarda 1 año calendario completo en completarse. El tamaño mínimo para construir una planta regional debe ser para albergar al menos 1 millón de pares de capacidad en maquinaria.",
        table: {
          headers: ["Capacidad Física (pares)", "Inversión en Construcción (US$ dólares)"],
          rows: [
            ["1,000,000 pares", "$20,000,000"],
            ["2,000,000 pares", "$38,000,000"],
            ["3,000,000 pares", "$54,000,000"],
            ["4,000,000 pares", "$68,000,000"],
            ["5,000,000 pares", "$80,000,000"],
            ["Por cada millón adicional", "+$12,000,000"]
          ],
          caption: "Costos de construcción física de infraestructura de plantas (no incluye maquinaria)."
        }
      },
      {
        title: "Maquinaria Nueva vs. Maquinaria Reacondicionada",
        content: "Una vez que se dispone de espacio físico, se debe comprar maquinaria para producir. Existen dos opciones de compra, ambas con una vida útil garantizada de 10 años:",
        bullets: [
          "Maquinaria Nueva: Costo de US$ 5.0 millones por cada 250,000 pares de capacidad regular. Ofrece 3 grandes beneficios: Incrementa la calificación S/Q de la planta en 0.5 estrellas, aumenta la productividad laboral en 500 pares anuales por operario, y reduce la tasa de rechazos en un 20%.",
          "Maquinaria Reacondicionada (Segunda mano): Costo de US$ 3.6 millones por cada 250,000 pares de capacidad. No ofrece mejoras tecnológicas ni reducciones en la tasa de defectos."
        ],
        tips: [
          "¡Sustitución en el año 15! Toda la maquinaria inicial de la empresa fue comprada en el Año 5 y vencerá obligatoriamente al inicio del Año 15. Debes planificar el flujo de caja para reemplazar esta maquinaria a tiempo."
        ]
      },
      {
        title: "Las Cuatro Opciones de Mejora Tecnológica (Upgrades)",
        content: "Se permite implementar un máximo de una (1) opción de mejora por año, y un tope absoluto de dos (2) mejoras distintas por planta a lo largo de su vida útil. Tienen una amortización lineal de 10 años al 10% anual.",
        bullets: [
          "Opción A: Equipos especiales para reducir la tasa de defectos actual de la planta en un 50%. Costo: US$ 625,000 por cada 250,000 pares de capacidad instalada.",
          "Opción B: Reestructuración de la línea de producción para reducir a la mitad (50%) los costos de preparación de maquinaria para cambiar de modelo. Costo: US$ 400,000 por cada 250,000 pares de capacidad.",
          "Opción C: Equipos de precisión que incrementan permanentemente la calificación S/Q del calzado en 1.0 estrella. Costo: US$ 1,200,000 por cada 250,000 pares de capacidad.",
          "Opción D: Robots de ensamblaje industrial que incrementan la productividad de los operarios en un 50%. Costo: US$ 3,600,000 por cada 250,000 pares de capacidad."
        ]
      }
    ],
    quiz: [
      {
        id: 71,
        question: "¿Qué beneficios tecnológicos ofrece comprar Maquinaria Nueva en lugar de Maquinaria Reacondicionada?",
        options: [
          "Permite producir el doble de modelos y cuesta la mitad.",
          "Aumenta la calificación S/Q en 0.5 estrellas, incrementa la productividad en 500 pares por operario, y reduce la tasa de rechazos un 20%.",
          "Evita pagar aranceles y fletes de envío.",
          "Duplica el tamaño físico de la planta automáticamente."
        ],
        correctAnswerIndex: 1,
        explanation: "La guía estipula claramente estos tres beneficios financieros y de calidad para la maquinaria nueva en comparación con la maquinaria restaurada (Capítulo 11.3.1)."
      },
      {
        id: 72,
        question: "¿Cuáles son las limitantes para implementar opciones de mejoras de planta (Opción A, B, C, D) en una fábrica?",
        options: [
          "Se pueden instalar todas el mismo año de forma ilimitada.",
          "Solo se puede instalar una opción de mejora por año, con un máximo de dos mejoras en toda la vida útil de cada planta.",
          "Son exclusivas para la planta de Asia-Pacífico.",
          "Solo se pueden usar si la calificación crediticia de la empresa es de A+."
        ],
        correctAnswerIndex: 1,
        explanation: "El manual restringe expresamente las mejoras: 'Se puede realizar una mejora por año con un máximo de dos mejoras a lo largo del tiempo de vida útil de la planta'."
      },
      {
        id: 73,
        question: "Si deseas reducir a la mitad los costos anuales de preparación de maquinaria para cambiar entre modelos producidos, ¿qué mejora debes comprar?",
        options: [
          "Opción A (Equipos especiales)",
          "Opción B (Reestructuración de la línea)",
          "Opción C (Equipos de precisión)",
          "Opción D (Robots de ensamblaje)"
        ],
        correctAnswerIndex: 1,
        explanation: "La 'Opción B' consiste precisamente en la reestructuración de la línea de producción para reducir los costos de preparación de la maquinaria en un 50%."
      }
    ]
  },
  {
    id: "8-operaciones-marca-privada",
    title: "8. Operaciones de Marca Privada (Private Label)",
    subtitle: "Cómo adjudicarse contratos de marcas genéricas utilizando capacidad ociosa",
    summary: "El mercado de Marca Privada (calzado genérico vendido a grandes cadenas) te permite licitar volúmenes de producción excedentes para diluir costos fijos. No se gasta en publicidad en este canal, pero debes cumplir estrictas especificaciones técnicas para ganar los contratos.",
    sections: [
      {
        title: "Las Tres Especificaciones de Compra Obligatorias",
        content: "Para que tu oferta de Marca Privada sea siquiera evaluada por el centro de compras regional de las cadenas de descuento, debes cumplir de manera obligatoria con tres condiciones:",
        bullets: [
          "1. Calidad S/Q mínima requerida: Debe ser exactamente de al menos una (1) estrella por debajo del promedio de la calificación de calidad de marca propia de toda la industria del año anterior.",
          "2. Calidad S/Q máxima permitida: El tope de calidad aceptado en este segmento económico es de 5.0 estrellas.",
          "3. Catálogo de Modelos: Debe configurarse para ofrecer un catálogo fijo de 100 modelos diferentes (este requerimiento puede ser alterado en algunas simulaciones por el instructor)."
        ]
      },
      {
        title: "Reglas de Licitación y Adjudicación de Contratos",
        content: "Las cadenas minoristas recolectan todas las ofertas de la industria al inicio de la gestión. La adjudicación de contratos sigue una lógica competitiva muy estricta:",
        bullets: [
          "El centro de compras ordena todas las propuestas recibidas por región de menor a mayor precio unitario ofertado.",
          "Los contratos de suministro se otorgan priorizando siempre el precio más bajo, comenzando por la oferta más económica y avanzando secuencialmente hacia arriba hasta que se cubra el 100% de la demanda del mercado privado regional.",
          "Para calificar para una adjudicación de contrato, la propuesta debe ser de un mínimo de 100,000 pares por región.",
          "¡Criterio de desempate por imagen! Si dos o más empresas presentan exactamente la misma oferta de precio, el centro de compras adjudicará el contrato prioritariamente a la empresa que posea la mejor calificación de imagen de marca acumulada.",
          "¡Tope máximo de precio! El precio ofertado en Marca Privada debe ser obligatorio al menos de US$ 10.00 menos que el precio promedio global de venta del mercado de detallistas regular (Wholesale) en ese mismo año."
        ]
      },
      {
        title: "Consideraciones de Costos y Capacidad",
        content: "Los costos de preparación de maquinaria en el mercado de Marca Privada representan únicamente el 50% de los costos regulares de marca propia, debido a que las cadenas minoristas conceden total libertad técnica para empaquetar y surtir los modelos en la forma que sea más barata y eficiente para tu planta de producción.",
        tips: [
          "¡Riesgo de producción y horas extra! Recuerda que el calzado para marca privada se fabrica e importa ÚNICAMENTE si el contrato te es adjudicado. Si no ganas la licitación, los pares no se producirán, lo que evita que quedes con sobre-inventario, pero pierdes la oportunidad de prorratear costos."
        ]
      }
    ],
    quiz: [
      {
        id: 81,
        question: "¿Cuál es el límite máximo de calidad (estrellas S/Q) que aceptan las cadenas en el segmento de Marca Privada?",
        options: [
          "3.0 estrellas.",
          "5.0 estrellas.",
          "7.0 estrellas.",
          "No tiene límite de calidad."
        ],
        correctAnswerIndex: 1,
        explanation: "El manual detalla que en Marca Privada la especificación de calidad máxima aceptada por el centro de compras es de 5.0 estrellas."
      },
      {
        id: 82,
        question: "¿Cuál es la regla de oro para fijar el precio máximo permitido en el mercado de Marca Privada?",
        options: [
          "Debe ser igual al costo de flete regional más $2.00.",
          "Debe ser obligatoriamente al menos US$ 10.00 menor que el precio promedio de venta en el mercado de detallistas (Wholesale).",
          "No puede superar los US$ 50.00 por par.",
          "Debe ser al menos un 40% superior al costo de producción."
        ],
        correctAnswerIndex: 1,
        explanation: "El manual en el Capítulo 11.7.4 declara explícitamente: 'Importante: El precio máximo en esta industria debe ser de US$.10.00 menos que el promedio del precio en el mercado de detallistas de la misma gestión'."
      },
      {
        id: 83,
        question: "¿Cómo decide el centro de compras de marca privada las adjudicaciones si hay dos ofertas con el mismo precio?",
        options: [
          "Divide el volumen en partes iguales.",
          "Adjudica el contrato a la empresa que presente la mejor calificación de imagen.",
          "Adjudica a la empresa con mayor número de supervisores.",
          "Anula ambas ofertas y abre una nueva licitación."
        ],
        correctAnswerIndex: 1,
        explanation: "La guía estipula claramente: 'En caso de ofertas idénticas en precio, el centro de compras preferirá al proveedor con la mejor calificación de imagen'."
      }
    ]
  },
  {
    id: "9-finanzas-y-flujo-de-caja",
    title: "9. Finanzas, Préstamos y Crédito",
    subtitle: "Cómo mantener tu índice de crédito y la solvencia financiera de tu corporativo",
    summary: "Todas tus decisiones operativas concluyen en la pantalla de Finanzas. Aquí decides cómo financiar tu expansión, emitir o recomprar acciones, pagar deudas acumuladas, y declarar dividendos atractivos para tus accionistas.",
    sections: [
      {
        title: "Las Tres Reglas del Índice de Crédito",
        content: "La calificación crediticia de tu empresa es evaluada anualmente por agencias de riesgo independientes, otorgándote notas que van desde A+ (máxima) hasta C- (mínima). Un índice crediticio alto reduce de manera masiva las tasas de interés de tus préstamos bancarios. Se calcula basándose en tres ratios financieros:",
        bullets: [
          "1. Ratio de Cobertura de Intereses: Utilidad operativa anual dividida entre el pago anual de intereses de deuda.",
          "2. Ratio Deuda/Activo: La relación porcentual entre el pasivo total (corto y largo plazo) y tus activos totales.",
          "3. Ratio de Riesgo de Impago: Flujo de caja libre anual dividido entre la sumatoria de las amortizaciones de créditos obligatorias de la gestión."
        ]
      },
      {
        title: "Escalas de Riesgo y Notas Crediticias",
        content: "El manual proporciona la tabla de correspondencia utilizada por las agencias calificadoras de riesgo:",
        table: {
          headers: ["Ratio de Cobertura de Intereses", "Nivel de Riesgo", "Calificación Proyectada"],
          rows: [
            ["Mayor a 4.0", "Bajo", "A (A-, A, A+)"],
            ["Entre 2.0 y 4.0", "Medio", "B (B-, B, B+)"],
            ["Menor a 2.0", "Alto", "C (C-, C, C+)"]
          ]
        },
        tips: [
          "¡Riesgo de sobregiro! Si tu saldo de caja final es negativo al cierre de la ronda, el Banco Internacional de Comercio (IBC) te otorgará de forma automática un préstamo de sobregiro de emergencia a 1 año para cubrir tus pasivos, pero aplicando un recargo de penalización del 2.0% adicional sobre la tasa base de interés."
        ]
      },
      {
        title: "Tipos de Créditos Bancarios Disponibles",
        content: "El banco IBC ofrece a la empresa tres tipos de financiamientos según tus necesidades de amortización:",
        bullets: [
          "A 1 Año: Tasa de interés base preferencial (durante el Año 11, la tasa base es de 7.0% con un índice de crédito de 'B').",
          "A 5 Años: Tasa de interés base más un recargo del 0.5% sobre la tasa base anual.",
          "A 10 Años: Tasa de interés base más un recargo de 1% sobre la tasa base."
        ]
      },
      {
        title: "Acciones, Dividendos y Recompras",
        content: "Las decisiones de capital social definen la rentabilidad para el inversionista:",
        bullets: [
          "Emisión de Acciones: Permite recaudar fondos sin intereses para financiar fábricas, pero diluye las utilidades y reduce directamente el EPS y el ROE de la gestión.",
          "Recompra de Acciones (Buybacks): Utiliza el dinero de caja para retirar acciones del mercado, aumentando de forma inmediata el EPS, el ROE y el precio bursátil de la acción. Restricciones: El precio de la acción en el periodo anterior debe ser mayor a US$ 15.00, la empresa debe mantener un mínimo de 15 millones de acciones circulantes en el mercado, y tu capital contable mínimo debe ser superior a US$ 150 millones.",
          "Declaración de Dividendos: El dividendo inicial en el Año 10 fue de US$ 1.00 por acción. Restricciones: El dividendo máximo no puede superar dos veces las ganancias por acción (EPS) proyectadas de la gestión. No se permite declarar ni pagar dividendos si el capital total contable proyectado es menor a US$ 150 millones."
        ]
      }
    ],
    quiz: [
      {
        id: 91,
        question: "¿Qué ratio de cobertura de intereses se requiere para proyectar una calificación crediticia en el rango de 'A' (Bajo Riesgo)?",
        options: [
          "Un ratio menor a 2.0",
          "Un ratio entre 2.0 y 4.0",
          "Un ratio mayor a 4.0",
          "No depende de este ratio sino de las ventas de marca privada."
        ],
        correctAnswerIndex: 2,
        explanation: "La tabla de niveles de riesgo del manual establece claramente que para un ratio de cobertura 'Más de 4.0', el riesgo es Bajo y la calificación proyectada es de rango A."
      },
      {
        id: 92,
        question: "¿Qué penalización aplica el banco IBC si la empresa incurre en un sobregiro de cuenta al final del año?",
        options: [
          "Te expulsa inmediatamente de la simulación.",
          "Concede un crédito automático a 1 año cobrando un interés del 2% adicional sobre la tasa de interés base.",
          "Te obliga a emitir 10 millones de acciones nuevas.",
          "No aplica penalización, se refinancia sin intereses."
        ],
        correctAnswerIndex: 1,
        explanation: "La sección 11.10.1 indica que ante un sobregiro, el banco concede automáticamente un préstamo a 1 año para nivelar la caja, aplicando un recargo de interés de '2% adicional a la tasa base'."
      },
      {
        id: 93,
        question: "¿Cuál de las siguientes es una restricción oficial para declarar y pagar dividendos a los accionistas?",
        options: [
          "Deben ser de mínimo $5.00 por par.",
          "No se permite el pago de dividendos si el capital contable proyectado de la empresa es menor a US$ 150 millones.",
          "Solo se permite si no se tienen deudas con el banco IBC.",
          "Debe ser exactamente el 50% de la utilidad operativa."
        ],
        correctAnswerIndex: 1,
        explanation: "El manual restringe los dividendos indicando expresamente: 'En el caso que el capital proyectado de la compañía sea menor a US$ 150 millones, no se permite el pago de dividendos'."
      }
    ]
  },
  {
    id: "10-expectativas-y-calificacion",
    title: "10. Expectativas de la Junta y Calificación de Desempeño",
    subtitle: "Los 5 objetivos de tu junta directiva y cómo se calcula tu nota final",
    summary: "La junta directiva te ha contratado para liderar la empresa y te evaluará de manera implacable en base a 5 indicadores clave. Tu calificación de desempeño global pondera el cumplimiento de estas metas junto con tu posición frente al mejor competidor de la industria.",
    sections: [
      {
        title: "Los 5 Objetivos de Desempeño Establecidos",
        content: "Tu junta directiva exige que tu empresa crezca anualmente cumpliendo metas estrictas de desempeño que se incrementan año con año:",
        bullets: [
          "1. Ganancias por Acción (EPS): Meta inicial del Año 11 de US$ 2.50, escalando año tras año hasta llegar a US$ 10.00 en el Año 20.",
          "2. Retorno sobre el Capital (ROE): Meta inicial del Año 11 de 21%, escalando gradualmente hasta un 30% en el Año 20.",
          "3. Precio de la Acción: Meta inicial del Año 11 de US$ 40, subiendo de forma agresiva hasta alcanzar los US$ 250 en el Año 20.",
          "4. Calificación de Crédito: Meta de mantener un nivel mínimo de 'B+' del Año 11 al 13, de 'A-' del Año 14 al 16, y un estándar de 'A' del Año 17 al 20.",
          "5. Calificación de Imagen de Marca: Meta de lograr al menos 70 puntos iniciales (Años 11-12), 72 puntos (Años 12-13), 75 puntos (Años 14-15), 77 puntos (Años 16-17), y consolidar 80 puntos del Año 18 al 20."
        ]
      },
      {
        title: "Los Dos Enfoques del Tablero de Puntuaciones",
        content: "Tu calificación de gestión final del simulador se calcula en una escala de 0 a 100 puntos (con un potencial de hasta 120 puntos si superas ampliamente las expectativas), y se evalúa combinando con una ponderación de 50%-50% desde dos ópticas:",
        bullets: [
          "1. Perspectiva del Cumplimiento de Expectativas del Inversionista: Mide de forma absoluta qué tan cerca o lejos estuviste de cumplir los 5 objetivos anuales de tu junta directiva. Si los cumples al 100%, recibes una nota de 100 puntos. Los accionistas otorgan hasta un 20% de puntos adicionales de bono por superar las metas fijadas.",
          "2. Perspectiva Comparativa con el Mejor de la Industria (Best-in-Industry): Mide de forma relativa tu desempeño comparándote cara a cara con la empresa líder de tu grupo de simulación en los mismos 5 indicadores. La empresa con el mejor resultado recibe 20 puntos por indicador (100 totales), y el resto recibe un puntaje proporcional a su distancia del líder."
        ],
        tips: [
          "¡Las tres condiciones del campeonato! Para lograr una puntuación perfecta absoluta de 100 puntos en la perspectiva comparativa de la industria, tu empresa debe lograr de forma simultánea: tener el mejor resultado de la industria en EPS, ROE, Precio de acción e Imagen de marca, cumplir con todas las expectativas de los inversionistas, y lograr una calificación de crédito perfecta de A+."
        ]
      }
    ],
    quiz: [
      {
        id: 101,
        question: "¿Cuál es la meta de ganancia por acción (EPS) que exige la junta directiva para el Año 11 y para el Año 20 respectivamente?",
        options: [
          "US$ 1.00 en el Año 11 y US$ 5.00 en el Año 20.",
          "US$ 2.50 en el Año 11 y US$ 10.00 en el Año 20.",
          "US$ 2.00 en el Año 11 y US$ 30.00 en el Año 20.",
          "Se mantiene fija en US$ 2.00 en todo el juego."
        ],
        correctAnswerIndex: 1,
        explanation: "La tabla de objetivos del manual del gerente estipula una meta inicial de EPS para el Año 11 de US$ 2.50, subiendo paulatinamente hasta US$ 10.00 en el Año 20."
      },
      {
        id: 102,
        question: "¿Qué dos perspectivas ponderadas al 50%-50% determinan la calificación final de cada ronda?",
        options: [
          "Las ventas de marca propia y las de marca privada.",
          "La perspectiva de cumplimiento de expectativas del inversionista y la perspectiva comparativa con el mejor de la industria.",
          "El margen operativo de Norteamérica y el de Asia-Pacífico.",
          "La tasa de rechazo y el saldo final de caja de la empresa."
        ],
        correctAnswerIndex: 1,
        explanation: "El Capítulo 16 del manual detalla que la nota de desempeño final combina la perspectiva del cumplimiento de las expectativas del inversionista junto con la perspectiva comparativa con el mejor de la industria, normalmente en proporción de 50%-50%."
      },
      {
        id: 103,
        question: "¿Qué calificación de crédito exige la junta directiva lograr a partir del Año 17 de la simulación?",
        options: [
          "Exige una calificación mínima de B+",
          "Exige una calificación mínima de A-",
          "Exige una calificación de A",
          "No exige calificación de crédito."
        ],
        correctAnswerIndex: 2,
        explanation: "La tabla de objetivos del manual indica en el Capítulo 15.4 que para los años 17, 18, 19 y 20 de la simulación la meta de calificación de crédito exigida es 'A'."
      }
    ]
  }
];
