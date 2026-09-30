import React, { useState, useEffect } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Interests from './components/Interests';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './admin/AdminLogin';
import AdminPanel from './admin/AdminPanel';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem('portfolio_admin_auth') === 'true'
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    const [pathPart, hashPart] = path.split('#');
    const cleanPath = pathPart || '/';
    const cleanHash = hashPart ? `#${hashPart}` : '';
    window.history.pushState({}, '', path);
    setCurrentPath(cleanPath);
    setCurrentHash(cleanHash);
    if (cleanHash) {
      setTimeout(() => {
        const id = cleanHash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          const headerHeight = 75;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('portfolio_admin_auth');
    setIsAdminAuthenticated(false);
    navigateTo('/');
  };

  const isAdminRoute =
    currentPath === '/admin' ||
    currentPath === '/admin/' ||
    currentHash === '#/admin' ||
    currentHash === '#admin';

  return (
    <PortfolioProvider>
      {isAdminRoute ? (
        isAdminAuthenticated ? (
          <AdminPanel
            onBackToPortfolio={(section = '/') => navigateTo(section)}
            onLogout={handleLogout}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={() => setIsAdminAuthenticated(true)}
            onBackToPortfolio={() => navigateTo('/')}
          />
        )
      ) : (
        <div className="min-h-screen bg-[#0c0f15] text-zinc-200 transition-colors duration-300 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-yellow-500 selection:text-black">
          <Header />

          <main className="flex-grow relative z-10">
            <Hero />
            <AboutMe />
            <Skills />
            <Projects />
            <Experience />
            <Interests />
            <Contact />
          </main>

          <Footer />
        </div>
      )}
    </PortfolioProvider>
  );
}
