'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Exclude Navbar and Footer on admin pages
  const isAdmin = pathname && pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
