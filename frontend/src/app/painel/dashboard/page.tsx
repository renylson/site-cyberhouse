'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Briefcase, Users, TrendingUp, Wifi, FileText, Settings } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [plansRes, applicationsRes, usersRes] = await Promise.all([
        api.get('/plans/admin/all'),
        api.get('/applications'),
        api.get('/users')
      ]);

      const plans = plansRes.data.data;
      const applications = applicationsRes.data.data;
      const users = usersRes.data.data;

      setStats({
        totalPlans: plans.length,
        activePlans: plans.filter((p: any) => p.status === 'active').length,
        totalApplications: applications.length,
        pendingApplications: applications.filter((a: any) => a.status === 'pending').length,
        totalUsers: users.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total de Planos',
      value: stats.totalPlans,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Planos Ativos',
      value: stats.activePlans,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Candidaturas',
      value: stats.totalApplications,
      icon: Briefcase,
      color: 'bg-purple-500',
    },
    {
      title: 'Pendentes',
      value: stats.pendingApplications,
      icon: Users,
      color: 'bg-orange-500',
    },
    {
      title: 'Total Usuários',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-indigo-500',
    },
  ];

  const quickActions = [
    { title: 'Gerenciar Planos', icon: Wifi, href: '/painel/planos', color: 'text-blue-600 bg-blue-50' },
    { title: 'Ver Banco de Currículos', icon: FileText, href: '/painel/formularios', color: 'text-purple-600 bg-purple-50' },
    { title: 'Personalização', icon: Settings, href: '/painel/personalizacao', color: 'text-green-600 bg-green-50' },
    { title: 'Gerenciar Usuários', icon: Users, href: '/painel/usuarios', color: 'text-orange-600 bg-orange-50' }
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-secondary">Bem-vindo ao painel administrativo da Cyberhouse</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-hover"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">{card.title}</p>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-4 rounded-lg`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Link
                      href={action.href}
                      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 ${action.color} rounded-lg`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-500">Acessar módulo</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-bold mb-4">Visão Geral dos Planos</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Planos Cadastrados</span>
                  <span className="text-lg font-bold text-blue-600">{stats.totalPlans}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Planos Ativos</span>
                  <span className="text-lg font-bold text-green-600">{stats.activePlans}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-bold mb-4">Status das Candidaturas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-700">Total Recebidas</span>
                  <span className="text-lg font-bold text-purple-600">{stats.totalApplications}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-gray-700">Aguardando Análise</span>
                  <span className="text-lg font-bold text-yellow-600">{stats.pendingApplications}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
