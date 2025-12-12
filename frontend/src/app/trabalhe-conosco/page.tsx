'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Upload, Send } from 'lucide-react';
import api from '@/lib/api';
import PublicPageWrapper from '@/components/PublicPageWrapper';

interface Position {
  id: number;
  name: string;
}

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  position: string;
  message: string;
  resume: FileList;
}

export default function TrabalheConoscoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ApplicationForm>();

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      const res = await api.get('/positions/active');
      setPositions(res.data.data);
    } catch (error) {
      console.error('Erro ao carregar cargos:', error);
    }
  };

  const onSubmit = async (data: ApplicationForm) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('position', data.position);
      formData.append('message', data.message || '');
      
      if (data.resume && data.resume[0]) {
        formData.append('resume', data.resume[0]);
      }

      await api.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Candidatura enviada com sucesso!');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao enviar candidatura. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicPageWrapper>
    <div className="pt-24">
    <section className="section-padding bg-gradient-dark text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-white mb-4">Trabalhe Conosco</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Faça parte da nossa equipe! Envie seu currículo e venha construir o futuro da conectividade com a gente.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="mb-8 text-center">Envie sua Candidatura</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                  Nome Completo *
                </label>
                <input
                  {...register('name', { required: 'Nome é obrigatório' })}
                  type="text"
                  id="name"
                  className="input"
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    E-mail *
                  </label>
                  <input
                    {...register('email', {
                      required: 'E-mail é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'E-mail inválido',
                      },
                    })}
                    type="email"
                    id="email"
                    className="input"
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                    Telefone *
                  </label>
                  <input
                    {...register('phone', { required: 'Telefone é obrigatório' })}
                    type="tel"
                    id="phone"
                    className="input"
                    placeholder="(87) 99999-9999"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-semibold mb-2">
                  Cargo Pretendido *
                </label>
                <select
                  {...register('position', { required: 'Cargo é obrigatório' })}
                  id="position"
                  className="input"
                >
                  <option value="">Selecione um cargo</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.name}>
                      {position.name}
                    </option>
                  ))}
                </select>
                {errors.position && (
                  <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2">
                  Mensagem (opcional)
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  rows={4}
                  className="input"
                  placeholder="Conte-nos um pouco sobre você..."
                />
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-semibold mb-2">
                  Currículo (PDF, DOC, DOCX) *
                </label>
                <div className="relative">
                  <input
                    {...register('resume', {
                      required: 'Currículo é obrigatório',
                      validate: {
                        fileSize: (files) =>
                          !files?.[0] || files[0].size <= 5242880 || 'Arquivo deve ter no máximo 5MB',
                        fileType: (files) =>
                          !files?.[0] ||
                          ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(files[0].type) ||
                          'Apenas PDF, DOC ou DOCX são permitidos',
                      },
                    })}
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    className="input file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-dark"
                  />
                  <Upload className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                </div>
                {errors.resume && (
                  <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Candidatura
                  </>
                )}
              </button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <p className="text-text-secondary">
              Seus dados serão tratados com total confidencialidade de acordo com a LGPD.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
    </PublicPageWrapper>
  );
}
