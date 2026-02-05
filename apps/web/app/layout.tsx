import './globals.css';
import { ReactNode } from 'react';
import { LocaleProvider } from '../components/LocaleContext';
import LocaleSwitcher from '../components/LocaleSwitcher';
import Header from '../components/Header';

export const metadata = {
  title: 'Exchanges Review & Arbitrage',
  description: 'Market analytics and arbitrage opportunities',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LocaleProvider>
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
              <Header />
              <LocaleSwitcher />
            </div>
          </header>
          <main className="p-4 max-w-7xl mx-auto">{children}</main>
        </LocaleProvider>
      </body>
    </html>
  );
}