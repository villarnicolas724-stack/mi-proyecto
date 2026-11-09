import { ButtonLink } from "@/components/ui/primitives";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Logo />
      <h1 className="text-2xl font-extrabold text-text">No encontramos esta página</h1>
      <p className="max-w-md text-text-2">Puede que el producto ya no esté en el catálogo o que el enlace esté mal escrito.</p>
      <div className="flex gap-2">
        <ButtonLink href="/app/productos">Buscar productos</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Inicio
        </ButtonLink>
      </div>
    </div>
  );
}
