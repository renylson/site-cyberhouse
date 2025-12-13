'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Wifi, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Início', href: '/' },
    { label: 'Planos', href: '/planos' },
    { label: 'Teste de Velocidade', href: '/teste-velocidade' },
    { label: 'Suporte', href: '/suporte' },
    { label: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
  ];

  const logoSrc = settings.logo ? settings.logo : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-lg py-4">
      <div className="container-custom px-4">
        <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
            {logoSrc ? (
              <img src={logoSrc} alt="Cyberhouse" className="h-[70px] w-[120px] object-contain" />
            ) : (
              <>
                <Wifi className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-secondary">
                  Cyberhouse
                </span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium transition-colors hover:text-primary text-text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href={settings.client_area_url || '#'}
              className="flex items-center space-x-2 btn-outline"
            >
              <User className="w-4 h-4" />
              <span>Área do Cliente</span>
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 btn-primary"
            >
              <Phone className="w-4 h-4" />
              <span>Contratar</span>
            </a>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-secondary"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="flex flex-col space-y-2 p-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-text-primary font-medium py-2 px-4 rounded-lg hover:bg-background transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link
                    href={settings.client_area_url || '#'}
                    className="btn-outline text-center"
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Área do Cliente
                  </Link>
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-center"
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    Contratar
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
