import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AuthProvider } from '@/context/auth-context';
import { TourProvider } from '@/context/tour-context';

const geistSans = Geist({
                        variable: '--font-geist-sans',
                        subsets: ['latin'],
});

const geistMono = Geist_Mono({
                        variable: '--font-geist-mono',
                        subsets: ['latin'],
});

export const metadata: Metadata = {
                        title: 'CodeAtlas Dashboard',
                        description: 'Enterprise operations dashboard',
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
                                                                        <body className="min-h-full flex flex-col">
                                                                                                <AuthProvider>
                                                                                                                        <TourProvider>
                                                                                                                                                <ThemeProvider
                                                                                                                                                                        attribute="class"
                                                                                                                                                                        defaultTheme="system"
                                                                                                                                                                        enableSystem
                                                                                                                                                                        disableTransitionOnChange
                                                                                                                                                >
                                                                                                                                                                        <DashboardLayout>
                                                                                                                                                                                                {
                                                                                                                                                                                                                        children
                                                                                                                                                                                                }
                                                                                                                                                                        </DashboardLayout>
                                                                                                                                                </ThemeProvider>
                                                                                                                        </TourProvider>
                                                                                                </AuthProvider>
                                                                        </body>
                                                </html>
                        );
}
