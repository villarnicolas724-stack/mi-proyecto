import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetail } from "@/components/screens/product-detail";
import { getAllListingIds, getListing } from "@/lib/data";

export function generateStaticParams() {
  return getAllListingIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/app/productos/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: getListing(id)?.name ?? "Producto" };
}

async function Detail({ params }: { params: PageProps<"/app/productos/[id]">["params"] }) {
  const { id } = await params;
  if (!getListing(id)) notFound();
  return <ProductDetail id={id} />;
}

export default function Page({ params }: PageProps<"/app/productos/[id]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-surface-2" aria-label="Cargando producto" />}>
      <Detail params={params} />
    </Suspense>
  );
}
