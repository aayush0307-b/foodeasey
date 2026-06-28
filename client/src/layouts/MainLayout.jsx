import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  const location = useLocation();
  const noFooterPages = ['/cart', '/checkout', '/partner/dashboard', '/partner/register', '/partner/success', '/admin'];
  const showFooter = !noFooterPages.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-[72px] page-enter">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
