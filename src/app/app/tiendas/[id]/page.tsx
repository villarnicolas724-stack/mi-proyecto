import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StoreDetail } from "@/components/screens/stores";
import { getAllStoreIds, getStore } from "@/lib/data";

export function generateStaticParams() {
  return getAllStoreIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/app/tiendas/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: getStore(id)?.name ?? "Tienda" };
}

async function Detail({ params }: { params: PageProps<"/app/tiendas/[id]">["params"] }) {
  const { id } = await params;
  if (!getStore(id)) notFound();
  return <StoreDetail id={id} />;
}

export default function Page({ params }: PageProps<"/app/tiendas/[id]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-surface-2" aria-label="Cargando tienda" />}>
      <Detail params={params} />
    </Suspense>
  );
}
