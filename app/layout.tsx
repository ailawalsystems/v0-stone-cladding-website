import type { Metadata } from 'next'
import { Geist, Geist_Mono, Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ConsultationProvider } from '@/components/consultation-provider'
import ConsultationPopup from '@/components/consultation-popup'
import { AIAssistantProvider } from '@/components/ai-assistant-provider'
import FloatingAIButton from '@/components/floating-ai-button'
import AIAssistantModal from '@/components/ai-assistant-modal'
import Footer from '@/components/footer'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'Octo 21st Stone Technology - Premium Stone Wall Cladding Solutions',
  description: 'Expert stone wall cladding consulting, design, supply, and installation. Premium Turkish stone materials for energy-efficient, durable building facades.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{
      ..._spaceGrotesk.style,
      ..._inter.style
    } as React.CSSProperties}>
      <body className="font-sans antialiased bg-[#0a0a0a] text-white flex flex-col min-h-screen">
        <AIAssistantProvider>
          <ConsultationProvider>
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <ConsultationPopup />
            <FloatingAIButton />
            <AIAssistantModal />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </ConsultationProvider>
        </AIAssistantProvider>
      </body>
    </html>
  )
}
