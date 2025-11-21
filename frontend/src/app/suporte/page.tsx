'use client';

import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, Clock, Headphones } from 'lucide-react';
import PublicPageWrapper from '@/components/PublicPageWrapper';
import { useSettings } from '@/hooks/useSettings';

export default function SuportePage() {
  const { settings } = useSettings();

  const supportChannels = [
    {
      icon: Phone,
      title: 'Telefone',
      info: settings.phone || '(87) 98169-0984',
      description: 'Atendimento 24/7',
      color: 'bg-blue-500',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      info: 'Atendimento Rápido',
      description: 'Resposta em minutos',
      color: 'bg-green-500',
      link: `https://wa.me/${settings.whatsapp}`,
    },
    {
      icon: Mail,
      title: 'E-mail',
      info: 'contato@cyberhouse.com.br',
      description: 'Resposta em até 2h',
      color: 'bg-purple-500',
    },
  ];

  const faqs = [
    {
      q: 'Como posso solicitar suporte técnico?',
      a: 'Entre em contato através do nosso WhatsApp, telefone ou e-mail. Nossa equipe técnica está disponível 24/7 para resolver qualquer problema.',
    },
    {
      q: 'Quanto tempo leva para resolver um problema técnico?',
      a: 'Problemas urgentes são priorizados e resolvidos em até 24 horas. A maioria dos casos é resolvida remotamente em poucos minutos.',
    },
    {
      q: 'O suporte técnico tem custo adicional?',
      a: 'Não! O suporte técnico está incluso em todos os nossos planos, sem nenhum custo adicional.',
    },
    {
      q: 'Como verifico se há problemas na minha região?',
      a: 'Entre em contato com nosso suporte que verificaremos em tempo real a situação da rede na sua região.',
    },
    {
      q: 'Posso agendar uma visita técnica?',
      a: 'Sim! Entre em contato conosco para agendar uma visita técnica no melhor horário para você.',
    },
  ];

  return (
    <PublicPageWrapper>
    <div className="pt-24">
    <section className="section-padding bg-gradient-dark text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Headphones className="w-16 h-16 mx-auto mb-6 text-accent" />
            <h1 className="text-white mb-4">Central de Suporte</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Estamos aqui para ajudar você. Nossa equipe está pronta para resolver qualquer dúvida ou problema.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">Canais de Atendimento</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Escolha a melhor forma de entrar em contato conosco
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-hover text-center"
              >
                <div className={`w-16 h-16 ${channel.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <channel.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{channel.title}</h3>
                <p className="text-lg font-semibold text-primary mb-2">{channel.info}</p>
                <p className="text-text-secondary">{channel.description}</p>
                {channel.link && (
                  <a
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-4 inline-block"
                  >
                    Iniciar Conversa
                  </a>
                )}
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card bg-blue-50 border-l-4 border-primary"
          >
            <div className="flex items-start">
              <Clock className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-3">Horário de Atendimento</h3>
                <div className="space-y-2 text-text-secondary">
                  <p><strong>Suporte Técnico:</strong> 24 horas, 7 dias por semana</p>
                  <p><strong>Comercial:</strong> Segunda a Sexta, 8h às 18h | Sábado, 8h às 12h</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">Perguntas Frequentes</h2>
            <p className="text-xl text-text-secondary">
              Encontre respostas rápidas para as dúvidas mais comuns
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                <p className="text-text-secondary">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-gradient-dark text-white">
        <div className="container-custom text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white mb-4">Não encontrou o que procura?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Entre em contato conosco e teremos prazer em ajudar!
            </p>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-green-500 hover:bg-green-600 text-white inline-flex items-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar no WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </div>
    </PublicPageWrapper>
  );
}
