import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ThemeProvider from '@/components/ThemeProvider';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
