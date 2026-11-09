import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Veta · Productos ganadores que sí dejan dinero",
    template: "%s · Veta",
  },
  description:
    "Encuentra productos ganadores para dropshipping contra entrega en Latinoamérica y calcula cuánto ganas por pedido entregado antes de invertir en publicidad.",
  applicationName: "Veta",
  appleWebApp: { capable: true, title: "Veta", statusBarStyle: "default" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1110" },
  ],
};

// Aplica el tema guardado antes de pintar para evitar el parpadeo.
const themeScript = `try{var t=localStorage.getItem("veta:tema");if(t){t=JSON.parse(t)}if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-bg text-text">{children}</body>
    </html>
  );
}
