import './globals.css'
import Top from '../components/Top'
export const metadata = { title: 'প্রহরী', icons: { icon: '/logo.webp' } }
export default function RootLayout({ children }) {
  return (<html lang="bn"><head><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap" rel="stylesheet" /></head>
    <body><Top /><main>{children}</main></body></html>)
}
