import './globals.css'

export const metadata = {
  title: 'QR Order System',
  description: 'Digital ordering system using QR codes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}