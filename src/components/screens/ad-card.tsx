import Link from "next/link";
import { Calendar, Copy, GalleryHorizontal, Heart, Image as ImageIcon, MessageCircle, Play, Share2 } from "lucide-react";
import { ProductThumb } from "@/components/product/bits";
import { Badge } from "@/components/ui/primitives";
import { COUNTRY_BY_CODE } from "@/lib/data/catalog";
import { formatShortDate } from "@/lib/data/dates";
import { getBestListing } from "@/lib/data";
import type { Ad } from "@/lib/data/types";
import { cn, formatCompact } from "@/lib/format";

const NETWORK: Record<Ad["network"], string> = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok" };
const FORMAT_ICON = { video: Play, imagen: ImageIcon, carrusel: GalleryHorizontal };

export function AdCard({ ad, compact }: { ad: Ad; compact?: boolean }) {
  const listing = getBestListing(ad.groupId, ad.country);
  const FormatIcon = FORMAT_ICON[ad.format];
  const longRunning = ad.daysActive >= 30;
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-4">
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-text">{ad.advertiser}</div>
          <div className="text-xs text-muted">
            {NETWORK[ad.network]} · {COUNTRY_BY_CODE[ad.country].name}
          </div>
        </div>
        <Badge tone={longRunning ? "success" : ad.daysActive <= 3 ? "info" : "neutral"}>
          {ad.daysActive} {ad.daysActive === 1 ? "día" : "días"}
        </Badge>
      </header>

      {!compact ? (
        <div className="relative mt-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-surface-2">
          <ProductThumb category={ad.category} size="lg" className="opacity-90" />
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 text-xs font-semibold text-text">
            <FormatIcon size={12} aria-hidden /> {ad.format}
          </span>
          {ad.variants > 1 ? (
            <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 text-xs font-semibold text-text">
              <Copy size={12} aria-hidden /> {ad.variants} variantes
            </span>
          ) : null}
        </div>
      ) : null}

      <p className={cn("mt-3 text-sm text-text", compact ? "line-clamp-2" : "line-clamp-3")}>{ad.copy}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-2">
        <span className="inline-flex items-center gap-1" title="Reacciones">
          <Heart size={13} aria-hidden /> {formatCompact(ad.likes)}
        </span>
        <span className="inline-flex items-center gap-1" title="Comentarios">
          <MessageCircle size={13} aria-hidden /> {formatCompact(ad.comments)}
        </span>
        <span className="inline-flex items-center gap-1" title="Compartidos">
          <Share2 size={13} aria-hidden /> {formatCompact(ad.shares)}
        </span>
        <span className="inline-flex items-center gap-1" title="Fecha de inicio">
          <Calendar size={13} aria-hidden /> desde {formatShortDate(ad.startedAt)}
        </span>
      </div>

      <footer className="mt-auto pt-3">
        {listing ? (
          <Link
            href={`/app/productos/${listing.id}`}
            className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2 text-sm hover:bg-border"
          >
            <span className="truncate font-semibold text-text">{ad.productName}</span>
            <span className="shrink-0 text-xs font-semibold text-primary-ink">
              {listing.stock === 0 ? "Agotado" : `Stock ${formatCompact(listing.stock)}`}
            </span>
          </Link>
        ) : (
          <div className="truncate text-sm font-semibold text-text">{ad.productName}</div>
        )}
        <div className="mt-1.5 truncate text-xs text-muted">Destino: {ad.landingDomain}</div>
      </footer>
    </article>
  );
}
