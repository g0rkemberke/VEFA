import React from 'react';
import { Check } from 'lucide-react';

const PackageCard = ({ title, price, features = [], onSelect }) => {
  return (
    <div className="p-8 rounded-[2.5rem] flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-serif text-mossGreen font-semibold">{title}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-5xl font-light text-mossGreen">₺{price}</span>
          <span className="text-mossGreen/70 text-base">/aylık</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-mossGreen/80 text-sm">
            <Check size={18} className="text-oliveGreen flex-shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>

      <button 
        onClick={onSelect}
        className="w-full py-4 rounded-2xl bg-mossGreen text-white hover:bg-oliveGreen transition-all font-medium shadow-md active:scale-95 cursor-pointer"
      >
        Paketi Seç
      </button>
    </div>
  );
};

export default PackageCard;