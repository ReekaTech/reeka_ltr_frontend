import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import { Bounce, ToastContainer } from 'react-toastify';
import { Inter, Modak, Nunito } from 'next/font/google';

import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { QueryProvider } from '@/components/providers/query-provider';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const modak = Modak({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-modak',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Reeka Long Term Rentals',
  description: 'Reeka Long Term Rentals - Property Management System',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#ffffff',
  openGraph: {
    type: 'website',
    title: 'Reeka Long Term Rentals',
    description: 'Reeka Long Term Rentals - Property Management System',
    siteName: 'Reeka Long Term Rentals',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${inter.variable} ${modak.variable} antialiased`}
      >
        <QueryProvider>
          <Providers>{children}</Providers>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
