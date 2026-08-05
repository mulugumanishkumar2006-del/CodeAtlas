import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AuthProvider } from '@/context/auth-context';
import { TourProvider } from '@/context/tour-context';

const geistSans = { variable: 'font-sans' };
const geistMono = { variable: 'font-mono' };

export const metadata: Metadata = {
  title: 'CodeAtlas Dashboard',
  description: 'Enterprise AI Software Intelligence Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <TourProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <DashboardLayout>{children}</DashboardLayout>
            </ThemeProvider>
          </TourProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
