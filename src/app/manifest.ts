import type { MetadataRoute } from "next";

// Permite instalar Veta como app en el móvil o el ordenador («Añadir a pantalla de inicio»).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Veta",
    short_name: "Veta",
    description: "Tu herramienta personal de productos ganadores para dropshipping contra entrega.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5f7f6",
    theme_color: "#0f766e",
    lang: "es",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
