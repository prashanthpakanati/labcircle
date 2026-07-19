import '../src/app/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'LabCircle Dashboard',
  description: 'Patient dashboard for LabCircle',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full" data-theme="light">
      <body className="h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
