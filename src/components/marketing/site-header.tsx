import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/primitives";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Veta, inicio">
          <Logo />
        </Link>
        <nav aria-label="Secciones" className="hidden items-center gap-6 text-sm font-semibold text-text-2 md:flex">
          <Link href="/#funciones" className="hover:text-text">
            Funciones
          </Link>
          <Link href="/precios" className="hover:text-text">
            Precios
          </Link>
          <Link href="/#preguntas" className="hover:text-text">
            Preguntas
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/app" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Ver demo
          </ButtonLink>
          <ButtonLink href="/ingresar" size="sm">
            Empezar gratis
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-text-2 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <Logo />
          <p className="mt-3">
            Investigación de productos para dropshipping contra entrega en Latinoamérica. Hecho en español, para quien vende en
            español.
          </p>
        </div>
        <div className="max-w-md text-xs text-muted">
          <p>
            Veta no está afiliada a Dropi, Aliclick, Mastershop, Meta, TikTok ni Shopify. Las marcas pertenecen a sus dueños y se
            mencionan solo para describir de dónde salen los datos.
          </p>
          <p className="mt-2">Esta versión usa datos de demostración.</p>
        </div>
      </div>
    </footer>
  );
}
