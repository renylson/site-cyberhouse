'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Settings {
  logo: string | null;
  favicon: string | null;
  phone: string;
  whatsapp: string;
  address: string;
  client_area_url: string;
}

export default function PersonalizacaoAdminPage() {
  const [settings, setSettings] = useState<Settings>({
    logo: null,
    favicon: null,
    phone: '',
    whatsapp: '',
    address: '',
    client_area_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data.data);
      if (res.data.data.logo) {
        setLogoPreview(res.data.data.logo);
      }
      if (res.data.data.favicon) {
        setFaviconPreview(res.data.data.favicon);
      }
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/png')) {
      toast.error('Apenas arquivos PNG são permitidos');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await api.post('/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSettings({ ...settings, logo: res.data.data.logo });
      setLogoPreview(URL.createObjectURL(file));
      toast.success('Logo atualizada com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao enviar logo');
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Apenas arquivos de imagem são permitidos');
      return;
    }

    const formData = new FormData();
    formData.append('favicon', file);

    try {
      const res = await api.post('/settings/favicon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSettings({ ...settings, favicon: res.data.data.favicon });
      setFaviconPreview(URL.createObjectURL(file));
      toast.success('Favicon atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao enviar favicon');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put('/settings', {
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        address: settings.address,
        client_area_url: settings.client_area_url
      });
      toast.success('Configurações salvas com sucesso!');
      loadSettings();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar configurações');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
    <div>
        <h1 className="text-3xl font-bold text-gray-900">Personalização do Site</h1>
        <p className="text-gray-600 mt-1">Configure a logo, favicon e informações de contato</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-4">Logo do Site</h2>
          <p className="text-sm text-gray-600 mb-4">Formato: PNG | Tamanho recomendado: 200x60px</p>

          <div className="flex flex-col items-center">
            <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="max-h-36 max-w-full object-contain" />
              ) : (
                <ImageIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>

            <label className="w-full">
              <input
                type="file"
                accept="image/png"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="btn-primary flex items-center justify-center space-x-2 cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Upload Logo (PNG)</span>
              </div>
            </label>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-4">Favicon</h2>
          <p className="text-sm text-gray-600 mb-4">Formato: ICO/PNG | Tamanho: 32x32px ou 64x64px</p>

          <div className="flex flex-col items-center">
            <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
              {faviconPreview ? (
                <img src={faviconPreview} alt="Favicon preview" className="h-16 w-16 object-contain" />
              ) : (
                <ImageIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>

            <label className="w-full">
              <input
                type="file"
                accept="image/png,image/x-icon"
                onChange={handleFaviconUpload}
                className="hidden"
              />
              <div className="btn-primary flex items-center justify-center space-x-2 cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Upload Favicon</span>
              </div>
            </label>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-bold mb-6">Informações de Contato</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Telefone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="input"
                placeholder="(87) 98169-0984"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Formato: (XX) XXXXX-XXXX</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">WhatsApp</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="input"
                placeholder="5587988694529"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Formato: 55 + DDD + Número (sem espaços)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Endereço Completo</label>
            <textarea
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="input min-h-[100px]"
              placeholder="Rua 11, nº 50 - Cosme e Damião - Petrolina-PE"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">URL da Área do Cliente</label>
            <input
              type="url"
              value={settings.client_area_url}
              onChange={(e) => setSettings({ ...settings, client_area_url: e.target.value })}
              className="input"
              placeholder="https://cliente.cyberhouse.com.br"
              required
            />
            <p className="text-xs text-gray-500 mt-1">URL completa incluindo https://</p>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex items-center space-x-2">
              <Save className="w-5 h-5" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </form>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-bold mb-4">Pré-visualização</h2>

        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <span className="font-semibold w-32">Telefone:</span>
            <span className="text-gray-700">{settings.phone || 'Não configurado'}</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold w-32">WhatsApp:</span>
            <span className="text-gray-700">{settings.whatsapp || 'Não configurado'}</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold w-32">Endereço:</span>
            <span className="text-gray-700">{settings.address || 'Não configurado'}</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold w-32">Área do Cliente:</span>
            <span className="text-gray-700">{settings.client_area_url || 'Não configurado'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
