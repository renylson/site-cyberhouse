'use client';

import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const WhatsAppButton = () => {
  const { settings } = useSettings();
  const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os planos da Cyberhouse.');

  return (
    <a
      href={`https://wa.me/${settings.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 bg-green-500 text-white px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        Fale Conosco!
      </span>
    </a>
  );
};

export default WhatsAppButton;
