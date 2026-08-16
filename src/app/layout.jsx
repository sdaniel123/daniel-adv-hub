import './globals.css';
import AppLayout from '@/components/layout/AppLayout';

export const metadata = {
  title: 'Daniel Adv Hub - Gestão Jurídica',
  description: 'Hub de gestão para escritório de advocacia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
