import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Settings {
  logo: string | null;
  favicon: string | null;
  phone: string;
  whatsapp: string;
  address: string;
  client_area_url: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    logo: null,
    favicon: null,
    phone: '(87) 98169-0984',
    whatsapp: '5587988694529',
    address: 'Rua 11, nº 50 - Cosme e Damião - Petrolina-PE',
    client_area_url: 'https://cliente.cyberhousenet.com.br'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};
