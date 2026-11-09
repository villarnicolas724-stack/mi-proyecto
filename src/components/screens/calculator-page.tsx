"use client";

import { ProfitCalculator, defaultProfitInput } from "@/components/product/profit-calculator";
import { Card, PageHeader } from "@/components/ui/primitives";
import { COUNTRY_BY_CODE } from "@/lib/data/catalog";
import { useCountry } from "@/lib/state/stores";

export function CalculatorPage() {
  const country = useCountry();
  return (
    <>
      <PageHeader
        title="Calculadora de rentabilidad"
        description={`Antes de pautar, comprueba cuánto te queda por pedido entregado en ${COUNTRY_BY_CODE[country].name}. Incluye devoluciones, flete de vuelta y publicidad de los pedidos que no se entregan.`}
      />
      <Card className="p-5">
        {/* key: al cambiar de país se reinician los valores por defecto en su moneda */}
        <ProfitCalculator key={country} country={country} initial={defaultProfitInput(country)} />
      </Card>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            t: "CPA máximo",
            d: "Lo máximo que puedes pagar en anuncios por cada pedido sin perder dinero. Si tu CPA real está por encima, ajusta precio, oferta o creativo.",
          },
          {
            t: "ROAS mínimo",
            d: "Cuántas veces tienen que volver en ventas cobradas lo que gastas en publicidad. Compáralo con el ROAS que te muestra tu administrador de anuncios.",
          },
          {
            t: "Efectividad de entrega",
            d: "El dato que más cambia la utilidad en contra entrega. Confirmar pedidos por WhatsApp y elegir proveedores con buena entrega lo sube.",
          },
        ].map((x) => (
          <Card key={x.t} className="p-5">
            <h2 className="font-bold text-text">{x.t}</h2>
            <p className="mt-1 text-sm text-text-2">{x.d}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
