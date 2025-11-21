'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermosPage() {
  return (
    <div className="min-h-screen py-20 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-8">
            <FileText className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Termos de Uso</h1>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Última atualização:</strong> 21 de outubro de 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
                <p className="text-gray-700 mb-4">
                  Ao contratar os serviços da Cyberhouse, você concorda com estes Termos de Uso. Se você não 
                  concordar com qualquer parte destes termos, não utilize nossos serviços.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição dos Serviços</h2>
                <p className="text-gray-700 mb-4">
                  A Cyberhouse oferece serviços de provimento de acesso à internet em banda larga para residências 
                  e empresas na região de Petrolina-PE e arredores. Nossos serviços incluem:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Acesso à internet em diversas velocidades</li>
                  <li>Instalação e configuração de equipamentos</li>
                  <li>Suporte técnico</li>
                  <li>Wi-Fi incluso (conforme plano contratado)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cadastro e Responsabilidades do Cliente</h2>
                <p className="text-gray-700 mb-4">O cliente é responsável por:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Fornecer informações verdadeiras e atualizadas durante o cadastro</li>
                  <li>Manter a confidencialidade de suas credenciais de acesso</li>
                  <li>Utilizar o serviço de forma legal e ética</li>
                  <li>Pagar as mensalidades nas datas estabelecidas</li>
                  <li>Manter os equipamentos instalados em bom estado</li>
                  <li>Notificar a Cyberhouse sobre qualquer uso não autorizado</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Uso Adequado do Serviço</h2>
                <p className="text-gray-700 mb-4">É proibido utilizar nossos serviços para:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Atividades ilegais ou que violem direitos de terceiros</li>
                  <li>Envio de spam ou conteúdo malicioso</li>
                  <li>Compartilhamento ilegal de conteúdo protegido por direitos autorais</li>
                  <li>Revenda do serviço sem autorização expressa</li>
                  <li>Ataques a redes ou sistemas (hacking, DDoS, etc.)</li>
                  <li>Uso excessivo que prejudique outros usuários</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Planos e Pagamentos</h2>
                <p className="text-gray-700 mb-4">
                  <strong>5.1. Mensalidade:</strong> O pagamento da mensalidade é devido até a data de vencimento 
                  especificada na fatura.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>5.2. Atraso:</strong> Em caso de atraso no pagamento, o serviço poderá ser suspenso 
                  após 5 dias do vencimento, sendo restabelecido em até 24 horas após a confirmação do pagamento.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>5.3. Reajuste:</strong> Os valores poderão ser reajustados anualmente conforme índices 
                  oficiais de inflação.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Instalação e Equipamentos</h2>
                <p className="text-gray-700 mb-4">
                  <strong>6.1.</strong> A instalação é gratuita conforme disponibilidade técnica.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>6.2.</strong> Os equipamentos fornecidos pela Cyberhouse permanecem como propriedade 
                  da empresa e devem ser devolvidos em bom estado em caso de cancelamento.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>6.3.</strong> O cliente é responsável por danos ou perda dos equipamentos instalados.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disponibilidade do Serviço</h2>
                <p className="text-gray-700 mb-4">
                  <strong>7.1.</strong> A Cyberhouse se compromete a manter disponibilidade de 99.5% do serviço.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>7.2.</strong> Manutenções programadas serão comunicadas com antecedência.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>7.3.</strong> A empresa não se responsabiliza por interrupções causadas por:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Força maior (tempestades, quedas de energia, etc.)</li>
                  <li>Problemas em equipamentos do cliente</li>
                  <li>Manutenções emergenciais necessárias</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Suporte Técnico</h2>
                <p className="text-gray-700 mb-4">
                  O suporte técnico está disponível 24/7 através dos seguintes canais:
                </p>
                <ul className="list-none text-gray-700 space-y-2 mb-4">
                  <li>• Telefone: (87) 3862-1234</li>
                  <li>• WhatsApp: (87) 98123-4567</li>
                  <li>• E-mail: suporte@cyberhouse.com.br</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cancelamento</h2>
                <p className="text-gray-700 mb-4">
                  <strong>9.1.</strong> Nossos planos não possuem fidelidade e podem ser cancelados a qualquer momento.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>9.2.</strong> Para cancelar, o cliente deve solicitar através de nossos canais oficiais 
                  com antecedência mínima de 5 dias.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>9.3.</strong> Mensalidades já pagas não serão reembolsadas proporcionalmente.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>9.4.</strong> Os equipamentos devem ser devolvidos em até 48 horas após o cancelamento.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitação de Responsabilidade</h2>
                <p className="text-gray-700 mb-4">
                  A Cyberhouse não se responsabiliza por:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Danos causados por uso inadequado do serviço</li>
                  <li>Perda de dados ou informações do cliente</li>
                  <li>Conteúdo acessado ou transmitido pelo cliente</li>
                  <li>Danos indiretos ou lucros cessantes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Privacidade</h2>
                <p className="text-gray-700 mb-4">
                  O tratamento de dados pessoais está descrito em nossa{' '}
                  <a href="/privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </a>
                  , que faz parte integrante destes Termos de Uso.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Alterações nos Termos</h2>
                <p className="text-gray-700 mb-4">
                  A Cyberhouse reserva-se o direito de modificar estes termos a qualquer momento. As alterações 
                  entrarão em vigor imediatamente após sua publicação no site. Recomendamos que você revise 
                  periodicamente esta página.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Lei Aplicável</h2>
                <p className="text-gray-700 mb-4">
                  Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será 
                  submetida ao foro da comarca de Petrolina-PE.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contato</h2>
                <p className="text-gray-700 mb-4">
                  Para dúvidas sobre estes Termos de Uso, entre em contato:
                </p>
                <ul className="list-none text-gray-700 space-y-2">
                  <li><strong>E-mail:</strong> contato@cyberhouse.com.br</li>
                  <li><strong>Telefone:</strong> (87) 3862-1234</li>
                  <li><strong>WhatsApp:</strong> (87) 98123-4567</li>
                  <li><strong>Endereço:</strong> Petrolina-PE</li>
                </ul>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
