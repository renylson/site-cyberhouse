'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Plan {
  id: number;
  name: string;
  speed: string;
  price: string | number;
  features: string[];
  is_popular: boolean;
  order_position: number;
  status: string;
}

export default function PlanosAdminPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    speed: '',
    price: '',
    features: [''],
    is_popular: false,
    order_position: 1,
    status: 'active'
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const res = await api.get('/plans/admin/all');
      setPlans(res.data.data);
    } catch (error) {
      toast.error('Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.filter(f => f.trim() !== '')
      };

      if (editingPlan) {
        await api.put(`/plans/${editingPlan.id}`, data);
        toast.success('Plano atualizado com sucesso!');
      } else {
        await api.post('/plans', data);
        toast.success('Plano criado com sucesso!');
      }

      setShowModal(false);
      resetForm();
      loadPlans();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar plano');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return;

    try {
      await api.delete(`/plans/${id}`);
      toast.success('Plano excluído com sucesso!');
      loadPlans();
    } catch (error) {
      toast.error('Erro ao excluir plano');
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      speed: plan.speed,
      price: plan.price.toString(),
      features: plan.features,
      is_popular: plan.is_popular,
      order_position: plan.order_position,
      status: plan.status
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      speed: '',
      price: '',
      features: [''],
      is_popular: false,
      order_position: 1,
      status: 'active'
    });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
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
    <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Planos</h1>
          <p className="text-gray-600 mt-1">Crie, edite e organize seus planos de internet</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Plano</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-lg shadow-md p-6 ${
              plan.is_popular ? 'ring-2 ring-primary' : ''
            }`}
          >
            {plan.is_popular && (
              <span className="inline-block bg-primary text-white text-xs px-3 py-1 rounded-full mb-3">
                Mais Popular
              </span>
            )}

            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="text-3xl font-bold text-primary mb-4">
              R$ {typeof plan.price === 'number' ? plan.price.toFixed(2) : parseFloat(plan.price).toFixed(2)}
              <span className="text-sm text-gray-500">/mês</span>
            </div>
            <p className="text-lg font-semibold mb-4">{plan.speed}</p>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-gray-600">
                  <span className="text-primary mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(plan)}
                className="flex-1 btn-outline flex items-center justify-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDelete(plan.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingPlan ? 'Editar Plano' : 'Novo Plano'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nome do Plano</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    required
                    placeholder="Ex: 500MB"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Velocidade</label>
                    <input
                      type="text"
                      value={formData.speed}
                      onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                      className="input"
                      required
                      placeholder="Ex: 500 Mega"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input"
                      required
                      placeholder="Ex: 80.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Benefícios</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="input flex-1"
                        placeholder="Ex: Instalação grátis"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-primary hover:underline text-sm"
                  >
                    + Adicionar Benefício
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_popular"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="w-4 h-4 text-primary"
                  />
                  <label htmlFor="is_popular" className="text-sm font-medium">
                    Marcar como "Mais Popular"
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 btn-outline"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    {editingPlan ? 'Salvar Alterações' : 'Criar Plano'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
