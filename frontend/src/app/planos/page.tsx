'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPlans } from '@/store/slices/plansSlice';
import PlanCard from '@/components/PlanCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Filter } from 'lucide-react';
import PublicPageWrapper from '@/components/PublicPageWrapper';

export default function PlansPage() {
  const dispatch = useAppDispatch();
  const { plans, isLoading } = useAppSelector((state) => state.plans);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  return (
    <PublicPageWrapper>
    <div className="pt-24">
    <section className="section-padding bg-gradient-dark text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-white mb-4">Escolha seu Plano</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Planos personalizados para residências e empresas. Sem taxa de instalação e sem fidelidade.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-custom">
          {isLoading ? (
            <LoadingSpinner size="lg" className="py-20" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}

          {plans.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <p className="text-xl text-text-secondary">
                Nenhum plano disponível no momento. Entre em contato para mais informações.
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Tem taxa de instalação?',
                a: 'Não! A instalação é completamente gratuita para todos os nossos planos.',
              },
              {
                q: 'Quanto tempo leva a instalação?',
                a: 'Em média, a instalação é realizada em até 48 horas após a contratação.',
              },
              {
                q: 'O Wi-Fi está incluído?',
                a: 'Sim! Todos os planos incluem roteador Wi-Fi sem custo adicional.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card"
              >
                <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                <p className="text-text-secondary">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </PublicPageWrapper>
  );
}
