import {
  Baby,
  Car,
  CookingPot,
  Dumbbell,
  HeartPulse,
  House,
  Minus,
  PawPrint,
  Smartphone,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Watch,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { cn, formatPct } from "@/lib/format";
import type { Category, SaturationLevel } from "@/lib/data/types";

const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Belleza: Sparkles,
  Hogar: House,
  Cocina: CookingPot,
  Tecnología: Smartphone,
  "Salud y bienestar": HeartPulse,
  Mascotas: PawPrint,
  Bebés: Baby,
  Deportes: Dumbbell,
  Herramientas: Wrench,
  Accesorios: Watch,
  Vehículos: Car,
};

// Tonos suaves por categoría para la miniatura (la imagen real del producto llegará con el backend).
const CATEGORY_TINT: Record<Category, string> = {
  Belleza: "from-pink-200/70 to-rose-100/40 text-rose-700 dark:from-rose-900/40 dark:to-rose-950/20 dark:text-rose-300",
  Hogar: "from-amber-200/70 to-orange-100/40 text-amber-800 dark:from-amber-900/40 dark:to-amber-950/20 dark:text-amber-300",
  Cocina: "from-orange-200/70 to-yellow-100/40 text-orange-800 dark:from-orange-900/40 dark:to-orange-950/20 dark:text-orange-300",
  Tecnología: "from-sky-200/70 to-blue-100/40 text-sky-800 dark:from-sky-900/40 dark:to-sky-950/20 dark:text-sky-300",
  "Salud y bienestar": "from-emerald-200/70 to-teal-100/40 text-emerald-800 dark:from-emerald-900/40 dark:to-emerald-950/20 dark:text-emerald-300",
  Mascotas: "from-lime-200/70 to-green-100/40 text-lime-800 dark:from-lime-900/40 dark:to-lime-950/20 dark:text-lime-300",
  Bebés: "from-violet-200/70 to-purple-100/40 text-violet-800 dark:from-violet-900/40 dark:to-violet-950/20 dark:text-violet-300",
  Deportes: "from-red-200/70 to-orange-100/40 text-red-800 dark:from-red-900/40 dark:to-red-950/20 dark:text-red-300",
  Herramientas: "from-stone-300/70 to-stone-100/40 text-stone-800 dark:from-stone-800/50 dark:to-stone-900/20 dark:text-stone-300",
  Accesorios: "from-indigo-200/70 to-slate-100/40 text-indigo-800 dark:from-indigo-900/40 dark:to-indigo-950/20 dark:text-indigo-300",
  Vehículos: "from-cyan-200/70 to-slate-100/40 text-cyan-800 dark:from-cyan-900/40 dark:to-cyan-950/20 dark:text-cyan-300",
};

export function ProductThumb({
  category,
  size = "md",
  className,
}: {
  category: Category;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const Icon = CATEGORY_ICON[category];
  const box = size === "sm" ? "h-11 w-11 rounded-xl" : size === "lg" ? "h-28 w-28 rounded-2xl" : "h-16 w-16 rounded-xl";
  const icon = size === "sm" ? 20 : size === "lg" ? 44 : 28;
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center bg-gradient-to-br", CATEGORY_TINT[category], box, className)}
      aria-hidden
    >
      <Icon size={icon} strokeWidth={1.75} />
    </div>
  );
}

export function TrendBadge({ growth }: { growth: number }) {
  if (growth > 10)
    return (
      <Badge tone="success">
        <TrendingUp size={13} aria-hidden /> {formatPct(growth)}
      </Badge>
    );
  if (growth < -10)
    return (
      <Badge tone="danger">
        <TrendingDown size={13} aria-hidden /> {formatPct(growth)}
      </Badge>
    );
  return (
    <Badge tone="neutral">
      <Minus size={13} aria-hidden /> {formatPct(growth)}
    </Badge>
  );
}

const SAT: Record<SaturationLevel, { tone: "success" | "warning" | "danger"; label: string }> = {
  baja: { tone: "success", label: "Saturación baja" },
  media: { tone: "warning", label: "Saturación media" },
  alta: { tone: "danger", label: "Saturación alta" },
};

export function SaturationBadge({ level, short }: { level: SaturationLevel; short?: boolean }) {
  const s = SAT[level];
  return <Badge tone={s.tone}>{short ? level.charAt(0).toUpperCase() + level.slice(1) : s.label}</Badge>;
}

/** Puntuación en anillo. El número va siempre visible: el color solo acompaña. */
export function ScoreRing({ score, size = 52 }: { score: number; size?: number }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const color = score >= 75 ? "var(--success)" : score >= 55 ? "var(--accent)" : "var(--muted)";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Puntuación ${score} de 100`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--grid)" strokeWidth="4" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="tabular absolute inset-0 flex items-center justify-center text-sm font-extrabold text-text">
        {score}
      </span>
    </div>
  );
}
