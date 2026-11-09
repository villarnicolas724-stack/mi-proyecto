// Logo original de Veta: una veta (línea quebrada ascendente) dentro de un rombo redondeado.

export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="9" fill="var(--primary)" />
      <path
        d="M8 21.5 L13 16.5 L16.5 19.5 L24 11"
        fill="none"
        stroke="var(--primary-fg)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="11" r="2.4" fill="var(--accent-logo, #f6b73c)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark />
      <span className="text-lg font-extrabold tracking-tight text-text">veta</span>
    </span>
  );
}
