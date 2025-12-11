import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calculadora de Envíos - LARACAJAS',
  description: 'Encuentra la caja perfecta para tu producto',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
