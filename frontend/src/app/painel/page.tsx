'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { LogIn, Wifi } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { useSettings } from '@/hooks/useSettings';

interface LoginForm {
  username: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const { settings } = useSettings();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      await dispatch(login(data)).unwrap();
      toast.success('Login realizado com sucesso!');
      router.push('/painel/dashboard');
    } catch (error: any) {
      toast.error(error || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {settings.logo ? (
              <div className="bg-white rounded-lg p-2">
                <img src={settings.logo} alt="Cyberhouse" className="h-[70px] w-[120px] object-contain" />
              </div>
            ) : (
              <>
                <Wifi className="w-12 h-12 text-primary" />
                <span className="text-3xl font-bold text-white">Cyberhouse</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-gray-400">Faça login para acessar o painel</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold mb-2">
                Usuário
              </label>
              <input
                {...register('username', {
                  required: 'Usuário é obrigatório',
                })}
                type="text"
                id="username"
                className="input"
                placeholder="admin"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                Senha
              </label>
              <input
                {...register('password', {
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'Senha deve ter no mínimo 6 caracteres',
                  },
                })}
                type="password"
                id="password"
                className="input"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary">
            <p>Credenciais padrão:</p>
            <p className="text-xs mt-1">admin / admin123456</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}