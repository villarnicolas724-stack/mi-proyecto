import { clamp } from "./random";
import type { SaturationLevel, ScorePart } from "./types";

interface ScoreInput {
  sales7d: number;
  growth: number;
  costPrice: number;
  suggestedPrice: number;
  shipping: number;
  adsInCountry: number;
  daysWithSales7d: number;
  stock: number;
  stockDays: number;
  countryName: string;
}

export function saturationFromAds(ads: number): SaturationLevel {
  if (ads <= 3) return "baja";
  if (ads <= 8) return "media";
  return "alta";
}

function verdict(t: number): ScorePart["verdict"] {
  if (t >= 0.6) return "bien";
  if (t >= 0.3) return "regular";
  return "mal";
}

function part(key: ScorePart["key"], label: string, max: number, t: number, explanation: string): ScorePart {
  return { key, label, max, points: Math.round(max * t), verdict: verdict(t), explanation };
}

/**
 * Puntuación Veta (0–100). Cada factor se explica en una frase para que
 * quien empieza entienda por qué un producto puntúa lo que puntúa.
 */
export function computeScore(input: ScoreInput): { score: number; parts: ScorePart[] } {
  const s7 = input.sales7d;
  const demand = clamp(Math.log10(1 + s7) / Math.log10(1 + 200));
  const momentum = clamp((input.growth + 40) / 120);
  const multiple = input.suggestedPrice / Math.max(1, input.costPrice + input.shipping);
  const margin = clamp((multiple - 1.6) / (3.2 - 1.6));
  const saturation = clamp(1 - input.adsInCountry / 12);
  const regularity = clamp(input.daysWithSales7d / 7);
  const stock = input.stock === 0 ? 0 : clamp(input.stockDays / 30);

  const growthText =
    input.growth > 15
      ? `Las ventas suben un ${input.growth} % frente a la semana anterior.`
      : input.growth < -15
        ? `Las ventas bajan un ${Math.abs(input.growth)} % frente a la semana anterior.`
        : "Ventas estables frente a la semana anterior.";

  const parts: ScorePart[] = [
    part(
      "demanda",
      "Demanda",
      25,
      demand,
      `${s7} ventas en 7 días. ` +
        (s7 >= 10
          ? "Llega al mínimo de 10 que suele indicar demanda real."
          : "Menos de 10: aún no hay demanda probada."),
    ),
    part("impulso", "Impulso", 20, momentum, growthText),
    part(
      "margen",
      "Margen",
      20,
      margin,
      `El precio sugerido es ${multiple.toFixed(1)} veces el costo más el flete. ` +
        (multiple >= 2.5
          ? "Hay espacio para pagar publicidad y devoluciones."
          : multiple >= 1.8
            ? "Margen justo: revisa la calculadora antes de lanzar."
            : "Margen muy ajustado para contra entrega."),
    ),
    part(
      "saturacion",
      "Saturación",
      15,
      saturation,
      `${input.adsInCountry} anuncios activos en ${input.countryName}. ` +
        (input.adsInCountry <= 3
          ? "Poca competencia todavía."
          : input.adsInCountry <= 8
            ? "Competencia moderada: necesitas un ángulo propio."
            : "Mucha competencia: entra solo con mejor oferta o mejor creativo."),
    ),
    part(
      "regularidad",
      "Regularidad",
      10,
      regularity,
      `Vendió ${input.daysWithSales7d} de los últimos 7 días. ` +
        (input.daysWithSales7d >= 5
          ? "Ventas repartidas: señal fiable."
          : input.daysWithSales7d >= 3
            ? "Algo irregular."
            : "Ventas concentradas en pocos días: pueden ser pruebas o un pedido grande."),
    ),
    part(
      "stock",
      "Stock",
      10,
      stock,
      input.stock === 0
        ? "Agotado en este proveedor."
        : input.stockDays >= 999
          ? `${input.stock} unidades y sin ventas recientes.`
          : `${input.stock} unidades: alcanzan para unos ${input.stockDays} días al ritmo actual.`,
    ),
  ];

  return { score: parts.reduce((s, p) => s + p.points, 0), parts };
}
