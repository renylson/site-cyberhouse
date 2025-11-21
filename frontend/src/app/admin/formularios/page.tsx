'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Eye, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  resume_url: string;
  status: string;
  created_at: string;
}

export default function FormulariosAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get('/applications');
      setApplications(res.data.data);
    } catch (error) {
      toast.error('Erro ao carregar formulários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este formulário?')) return;

    try {
      await api.delete(`/applications/${id}`);
      toast.success('Formulário excluído com sucesso!');
      loadApplications();
    } catch (error) {
      toast.error('Erro ao excluir formulário');
    }
  };

  const handleDownload = async (resumeUrl: string, fullName: string) => {
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `curriculo_${fullName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download iniciado!');
    } catch (error) {
      toast.error('Erro ao baixar currículo');
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.put(`/applications/${id}`, { status: newStatus });
      toast.success('Status atualizado!');
      loadApplications();
      setShowModal(false);
    } catch (error) {
      toast.error('Erro ao atualizar status');
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
        <h1 className="text-3xl font-bold text-gray-900">Formulários de Trabalhe Conosco</h1>
        <p className="text-gray-600 mt-1">Gerencie as candidaturas recebidas</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold">{applications.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-600">
            {applications.filter(a => a.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Em Análise</p>
          <p className="text-2xl font-bold text-blue-600">
            {applications.filter(a => a.status === 'reviewing').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Contratados</p>
          <p className="text-2xl font-bold text-green-600">
            {applications.filter(a => a.status === 'hired').length}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app, index) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {app.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {app.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {app.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'hired' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status === 'pending' ? 'Pendente' :
                       app.status === 'reviewing' ? 'Em Análise' :
                       app.status === 'hired' ? 'Contratado' : 'Rejeitado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(app.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(app.resume_url, app.full_name)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Baixar currículo"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum formulário recebido ainda</p>
          </div>
        )}
      </div>
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Detalhes da Candidatura</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
                  <p className="text-gray-900">{selectedApp.full_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone</label>
                    <p className="text-gray-900">{selectedApp.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cargo Pretendido</label>
                  <p className="text-gray-900">{selectedApp.position}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alterar Status</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedApp.id, 'pending')}
                      className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200"
                    >
                      Pendente
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedApp.id, 'reviewing')}
                      className="flex-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                    >
                      Em Análise
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedApp.id, 'hired')}
                      className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                    >
                      Contratado
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                    >
                      Rejeitado
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleDownload(selectedApp.resume_url, selectedApp.full_name)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Baixar Currículo</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
