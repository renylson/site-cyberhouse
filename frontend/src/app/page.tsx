'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wifi, Zap, Shield, Clock, Users, Award } from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPlans } from '@/store/slices/plansSlice';
import PlanCard from '@/components/PlanCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import PublicPageWrapper from '@/components/PublicPageWrapper';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { plans, isLoading } = useAppSelector((state) => state.plans);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const features = [
    {
      icon: Zap,
      title: 'Alta Velocidade',
      description: 'Conexão estável e ultra-rápida para sua família e empresa.',
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Rede protegida e monitorada 24/7 para sua tranquilidade.',
    },
    {
      icon: Clock,
      title: 'Suporte 24/7',
      description: 'Equipe técnica sempre disponível para te ajudar.',
    },
  ];

  const stats = [
    { number: '10+', label: 'Anos de Experiência' },
    { number: '5000+', label: 'Clientes Satisfeitos' },
    { number: '99.9%', label: 'Disponibilidade' },
    { number: '1Giga', label: 'Velocidade Máxima' },
  ];

  return (
    <PublicPageWrapper>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-primary-light rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container-custom px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Internet de <span className="gradient-text">Alta Velocidade</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Conecte-se ao futuro com qualidade e estabilidade. Wi-Fi incluso e instalação grátis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/planos" className="btn-primary text-lg">
                  Ver Planos
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </Link>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent text-lg"
                >
                  Fale Conosco
                </a>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4">Por que escolher a Cyberhouse?</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Oferecemos a melhor experiência em internet com tecnologia de ponta e atendimento personalizado.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-hover text-center"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4">Nossos Planos</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Escolha o plano perfeito para você e sua família. Sem taxa de instalação e sem fidelidade.
            </p>
          </motion.div>

          {isLoading ? (
            <LoadingSpinner size="lg" className="py-20" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.slice(0, 4).map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/planos" className="btn-primary">
              Ver Todos os Planos
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section-padding bg-gradient-dark text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card bg-gradient-primary text-white text-center max-w-4xl mx-auto p-12"
          >
            <Wifi className="w-20 h-20 mx-auto mb-6 opacity-80" />
            <h2 className="text-white mb-4">Pronto para ter a melhor internet?</h2>
            <p className="text-xl mb-8 opacity-90">
              Entre em contato agora e aproveite nossas ofertas especiais!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/planos" className="btn-secondary">
                Ver Planos
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white text-primary hover:bg-gray-100"
              >
                Fale no WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicPageWrapper>
  );
}
