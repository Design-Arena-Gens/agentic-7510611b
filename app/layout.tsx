import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Agentic Video Downloader',
  description: 'Download videos from popular platforms with multiple formats',
  manifest: '/manifest.webmanifest',
  themeColor: '#0ea5e9'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <header className="topbar">
          <nav className="nav">
            <Link href="/" className="navLink">Home</Link>
            <Link href="/history" className="navLink">Search History</Link>
            <Link href="/downloads" className="navLink">Downloads</Link>
          </nav>
        </header>
        <main className="main">{children}</main>
        <footer className="footer">? {new Date().getFullYear()} Agentic Video Downloader</footer>
        <script dangerouslySetInnerHTML={{__html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `}} />
      </body>
    </html>
  );
}
