import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  // Bildirimin 3 saniye sonra kendi kendine kapanmasını sağlayan zamanlayıcı
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Bildirim tipine göre ikonlar
  const icons = {
    success: <CheckCircle className="text-green-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
    info: <AlertCircle className="text-[#C9A84C]" size={20} />
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-[#0d1a10] border border-[#C9A84C]/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
        <div className="shrink-0">
           {icons[type]}
        </div>
        <p className="text-[#f8f6f0] text-sm font-medium flex-1 pr-4">{message}</p>
        <button onClick={onClose} className="text-[#f8f6f0]/40 hover:text-[#f8f6f0] transition-colors shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;