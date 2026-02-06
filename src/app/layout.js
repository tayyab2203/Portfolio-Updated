import './globals.css';
import ErrorBoundary from '@/components/ErrorBoundary';
import LayoutClient from '@/components/LayoutClient';

export const metadata = {
  title: 'Professional Portfolio | Full-Stack Developer & AI Enthusiast',
  description: 'Professional portfolio showcasing full-stack development expertise, AI-powered solutions, and innovative projects. Specializing in Next.js, React, Node.js, and modern web technologies.',
  keywords: ['portfolio', 'full-stack developer', 'web developer', 'Next.js', 'React', 'AI developer', 'software engineer', 'freelance developer'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  openGraph: {
    title: 'Professional Portfolio | Full-Stack Developer',
    description: 'Full-stack developer specializing in modern web technologies and AI-powered solutions',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Portfolio | Full-Stack Developer',
    description: 'Full-stack developer specializing in modern web technologies and AI-powered solutions',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#333d29" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="bg-black text-khaki-beige-900 antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <LayoutClient>{children}</LayoutClient>
        </ErrorBoundary>
      </body>
    </html>
  );
}
