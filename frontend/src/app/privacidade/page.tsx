'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen py-20 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Política de Privacidade</h1>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Última atualização:</strong> 21 de outubro de 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
                <p className="text-gray-700 mb-4">
                  A Cyberhouse está comprometida em proteger a privacidade e os dados pessoais de nossos clientes. 
                  Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Informações que Coletamos</h2>
                <p className="text-gray-700 mb-4">Coletamos as seguintes informações:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Dados pessoais: nome, CPF, RG, endereço, telefone e e-mail</li>
                  <li>Informações de pagamento: dados bancários para processamento de pagamentos</li>
                  <li>Dados de navegação: endereço IP, tipo de navegador, páginas visitadas</li>
                  <li>Histórico de uso do serviço de internet</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Como Usamos suas Informações</h2>
                <p className="text-gray-700 mb-4">Utilizamos suas informações para:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Fornecer e manter nossos serviços de internet</li>
                  <li>Processar pagamentos e emitir faturas</li>
                  <li>Fornecer suporte técnico e atendimento ao cliente</li>
                  <li>Melhorar nossos serviços e desenvolver novos recursos</li>
                  <li>Enviar comunicações importantes sobre seu serviço</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Compartilhamento de Dados</h2>
                <p className="text-gray-700 mb-4">
                  Não vendemos suas informações pessoais. Podemos compartilhar seus dados apenas com:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Prestadores de serviços que nos auxiliam nas operações</li>
                  <li>Autoridades legais quando exigido por lei</li>
                  <li>Parceiros comerciais com seu consentimento explícito</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Segurança dos Dados</h2>
                <p className="text-gray-700 mb-4">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra 
                  acesso não autorizado, perda, destruição ou alteração. Utilizamos criptografia, firewalls e 
                  controles de acesso rigorosos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Seus Direitos (LGPD)</h2>
                <p className="text-gray-700 mb-4">Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Confirmar a existência de tratamento de dados</li>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                  <li>Revogar o consentimento</li>
                  <li>Solicitar a portabilidade dos dados</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Utilizamos cookies para melhorar sua experiência em nosso site. Você pode gerenciar suas 
                  preferências de cookies nas configurações do seu navegador.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Retenção de Dados</h2>
                <p className="text-gray-700 mb-4">
                  Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta 
                  política, a menos que um período de retenção mais longo seja exigido por lei.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contato</h2>
                <p className="text-gray-700 mb-4">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato conosco:
                </p>
                <ul className="list-none text-gray-700 space-y-2 mb-4">
                  <li><strong>E-mail:</strong> privacidade@cyberhouse.com.br</li>
                  <li><strong>Telefone:</strong> (87) 3862-1234</li>
                  <li><strong>Endereço:</strong> Petrolina-PE</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Alterações nesta Política</h2>
                <p className="text-gray-700">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre 
                  quaisquer alterações significativas através do e-mail cadastrado ou por meio de aviso em nosso site.
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
