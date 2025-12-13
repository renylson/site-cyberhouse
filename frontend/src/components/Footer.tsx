'use client';

import Link from 'next/link';
import { Wifi, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  const logoSrc = settings.logo ? settings.logo : null;

  return (
    <footer className="bg-secondary text-white">
      <div className="container-custom px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {logoSrc ? (
                <img src={logoSrc} alt="Cyberhouse" className="h-10 w-auto object-contain filter brightness-0 invert" />
              ) : (
                <>
                  <Wifi className="w-8 h-8 text-primary" />
                  <span className="text-2xl font-bold">Cyberhouse</span>
                </>
              )}
            </div>
            <p className="text-gray-300 mb-4">
              Conectando você ao mundo digital com qualidade e estabilidade.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/planos" className="text-gray-300 hover:text-primary transition-colors">
                  Planos
                </Link>
              </li>
              <li>
                <Link href="/suporte" className="text-gray-300 hover:text-primary transition-colors">
                  Suporte
                </Link>
              </li>
              <li>
                <Link href="/teste-velocidade" className="text-gray-300 hover:text-primary transition-colors">
                  Teste de Velocidade
                </Link>
              </li>
              <li>
                <Link
                  href="/trabalhe-conosco"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Trabalhe Conosco
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-300">{settings.phone}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-300">contato@cyberhouse.com.br</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-300">{settings.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Fique por Dentro</h3>
            <p className="text-gray-300 mb-4">
              Receba novidades e promoções exclusivas.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full px-4 py-2 rounded-lg bg-secondary-light text-white border border-gray-600 focus:border-primary focus:outline-none"
              />
              <button type="submit" className="w-full btn-primary">
                Inscrever-se
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Cyberhouse. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacidade"
              className="text-gray-400 hover:text-primary transition-colors text-sm"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos"
              className="text-gray-400 hover:text-primary transition-colors text-sm"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
