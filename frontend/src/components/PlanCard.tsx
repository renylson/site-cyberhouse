'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Plan } from '@/store/slices/plansSlice';
import { useSettings } from '@/hooks/useSettings';

interface PlanCardProps {
  plan: Plan;
  onSelect?: (plan: Plan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  const price = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;
  const { settings } = useSettings();
  
  const handleContact = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de contratar o plano ${plan.name} (${plan.speed}) por R$ ${price.toFixed(2)}/mês.`
    );
    window.open(`https://wa.me/${settings.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`card-hover relative flex flex-col ${
        plan.is_popular ? 'border-2 border-primary' : ''
      }`}
    >
      {plan.is_popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-primary text-white px-6 py-1 rounded-full text-sm font-semibold">
            Mais Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <div className="flex items-baseline justify-center mb-2">
          <span className="text-4xl font-bold text-primary">{plan.speed}</span>
        </div>
        <div className="flex items-baseline justify-center">
          <span className="text-3xl font-bold">R$ {price.toFixed(2)}</span>
          <span className="text-text-secondary ml-2">/mês</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-text-primary">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleContact}
        className={`w-full mt-auto ${
          plan.is_popular ? 'btn-primary' : 'btn-outline'
        }`}
      >
        Contratar Agora
      </button>
    </motion.div>
  );
};

export default PlanCard;
