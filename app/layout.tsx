import './globals.css'

export const metadata = {
  title: process.env.BRAND_NAME || 'La Usina Rifas',
  description: 'Rifas con reserva por 10 minutos y pago seguro.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const brand = process.env.BRAND_NAME || 'La Usina Rifas';
  return (
    <html lang="es">
      <body>
        <header className="header">
          <div className="container">
            <strong>{brand}</strong>
          </div>
        </header>
        <main className="container">
          {children}
        </main>
        <footer className="footer"><div className="container">© {new Date().getFullYear()} {brand}</div></footer>
      </body>
    </html>
  )
}
