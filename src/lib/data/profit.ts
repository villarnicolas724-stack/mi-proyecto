// Calculadora de rentabilidad para venta contra entrega.
// Se calcula sobre 100 pedidos generados por publicidad, porque en contra entrega
// una parte no se entrega y esos pedidos también cuestan (flete de ida y de vuelta).

export interface ProfitInput {
  /** Precio de venta al cliente final. */
  price: number;
  /** Precio del proveedor por unidad. */
  cost: number;
  /** Flete de envío por pedido. */
  shipping: number;
  /** Flete de devolución por pedido no entregado. */
  returnShipping: number;
  /** Costo de publicidad por pedido generado (CPA). */
  cpa: number;
  /** Porcentaje de pedidos que se entregan y pagan (0–100). */
  deliveryRate: number;
  /** Comisión de plataforma o recaudo sobre la venta (0–100). */
  feePct: number;
  /** Otros costos por pedido entregado: empaque, regalo, etc. */
  extraCost: number;
}

export interface ProfitResult {
  orders: number;
  delivered: number;
  returned: number;
  revenue: number;
  productCost: number;
  shippingCost: number;
  adCost: number;
  fees: number;
  extra: number;
  profit: number;
  profitPerDelivered: number;
  profitPerOrder: number;
  marginPct: number;
  /** CPA máximo para no perder dinero. */
  breakEvenCpa: number;
  /** ROAS (ingresos / publicidad) mínimo para no perder dinero. */
  breakEvenRoas: number;
  /** Precio mínimo para no perder dinero con los demás valores fijos. */
  breakEvenPrice: number;
  verdict: "gana" | "justo" | "pierde";
}

export function calculateProfit(input: ProfitInput, orders = 100): ProfitResult {
  const rate = Math.min(100, Math.max(0, input.deliveryRate)) / 100;
  const fee = Math.min(100, Math.max(0, input.feePct)) / 100;
  const delivered = orders * rate;
  const returned = orders - delivered;

  const revenue = delivered * input.price;
  const productCost = delivered * input.cost;
  const shippingCost = delivered * input.shipping + returned * input.returnShipping;
  const adCost = orders * input.cpa;
  const fees = revenue * fee;
  const extra = delivered * input.extraCost;
  const profit = revenue - productCost - shippingCost - adCost - fees - extra;

  const beforeAds = revenue - productCost - shippingCost - fees - extra;
  const breakEvenCpa = Math.max(0, beforeAds / orders);
  const breakEvenRoas = breakEvenCpa > 0 ? revenue / (breakEvenCpa * orders) : Infinity;
  const fixed = productCost + shippingCost + adCost + extra;
  const breakEvenPrice = delivered > 0 && fee < 1 ? fixed / (delivered * (1 - fee)) : Infinity;
  const marginPct = revenue > 0 ? (profit / revenue) * 100 : 0;

  return {
    orders,
    delivered,
    returned,
    revenue,
    productCost,
    shippingCost,
    adCost,
    fees,
    extra,
    profit,
    profitPerDelivered: delivered > 0 ? profit / delivered : 0,
    profitPerOrder: profit / orders,
    marginPct,
    breakEvenCpa,
    breakEvenRoas,
    breakEvenPrice,
    verdict: marginPct >= 15 ? "gana" : marginPct >= 0 ? "justo" : "pierde",
  };
}
