import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, ShieldCheck, Loader2, CheckCircle, Receipt } from 'lucide-react';

// YENİ: priceDetails prop'u eklendi
const CheckoutModal = ({ isOpen, onClose, selectedPackage, onPaymentSuccess, priceDetails }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(false);
      }, 500);
    }
  }, [isOpen]);

  if (!isOpen || !selectedPackage || !priceDetails) return null;

  // Fiyat Hesaplamaları (Gelen dinamik fiyata göre KDV hesabı)
  const price = priceDetails.total;
  const subtotal = Math.round(price / 1.20);
  const vat = price - subtotal;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        onPaymentSuccess(selectedPackage);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0d1a10]/80 backdrop-blur-md transition-all duration-500">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col md:flex-row border border-[#134B36]/10">
        
        <button onClick={onClose} disabled={isProcessing || isSuccess} className="absolute top-6 right-6 text-[#134B36]/40 hover:text-[#134B36] transition-colors z-20 disabled:opacity-0">
          <X size={24} />
        </button>

        {/* SOL TARAF: DETAYLI SİPARİŞ ÖZETİ (Fatura Görünümü) */}
        <div className="w-full md:w-2/5 bg-[#F8F6F0] p-8 md:p-10 border-r border-[#134B36]/10 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#134B36]/5 rounded-full mb-6 border border-[#134B36]/10">
              <Receipt size={14} className="text-[#134B36]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#134B36]">Şeffaf Fiyatlandırma</span>
            </div>
            
            <h3 className="text-2xl font-serif text-[#134B36] mb-2">Hizmet Dökümü</h3>
            <p className="text-sm text-[#134B36]/70 mb-6 pb-4 border-b border-[#134B36]/10">Vefa Atölyesi tasarımınıza göre hesaplanan operasyonel maliyetler.</p>

            {/* DİNAMİK FİYAT KALEMLERİ */}
            <div className="space-y-3 text-sm mb-6">
              {priceDetails.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-[#1a1c19]/80">{item.name}</span>
                  <span className="text-[#1a1c19] font-medium">₺{item.price.toLocaleString('tr-TR')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm pt-4 border-t border-[#134B36]/10">
              <div className="flex justify-between items-center text-[#134B36]/60">
                <span>Ara Toplam</span>
                <span>₺{subtotal.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between items-center text-[#134B36]/60">
                <span>KDV (%20)</span>
                <span>₺{vat.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#134B36]/20">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-[#134B36]/60 uppercase tracking-wider">Genel Toplam</span>
              <span className="text-4xl font-bold text-[#134B36]">₺{price.toLocaleString('tr-TR')}</span>
            </div>
          </div>
        </div>

        {/* SAĞ TARAF: KREDİ KARTI FORMU */}
        <div className="w-full md:w-3/5 p-8 md:p-10 relative">
          {isSuccess && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-green-600 animate-in zoom-in duration-500 delay-150" />
              </div>
              <h3 className="text-3xl font-serif text-[#134B36] mb-2">Ödeme Başarılı!</h3>
              <p className="text-[#134B36]/60 text-center max-w-xs">Siparişiniz alındı. Hesabınıza yönlendiriliyorsunuz...</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif text-[#134B36]">Kart Bilgileri</h3>
            <div className="flex items-center gap-1 text-[#134B36]/40"><ShieldCheck size={18}/><Lock size={18}/></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#134B36]/70 uppercase tracking-wider pl-1">Kart Üzerindeki İsim</label>
              <input type="text" required placeholder="Görkem Berke Tutkun" disabled={isProcessing} className="w-full px-5 py-4 bg-[#F8F6F0] border border-transparent rounded-2xl outline-none focus:border-[#C9A84C] focus:bg-white transition-all text-[#1a1c19] disabled:opacity-50" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#134B36]/70 uppercase tracking-wider pl-1">Kart Numarası</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#134B36]/40">
                  <CreditCard size={20} />
                </div>
                <input type="text" required maxLength="19" placeholder="0000 0000 0000 0000" disabled={isProcessing} className="w-full pl-12 pr-5 py-4 bg-[#F8F6F0] border border-transparent rounded-2xl outline-none focus:border-[#C9A84C] focus:bg-white transition-all text-[#1a1c19] font-mono disabled:opacity-50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#134B36]/70 uppercase tracking-wider pl-1">Son Kul. Tarihi</label>
                <input type="text" required maxLength="5" placeholder="AA/YY" disabled={isProcessing} className="w-full px-5 py-4 bg-[#F8F6F0] border border-transparent rounded-2xl outline-none focus:border-[#C9A84C] focus:bg-white transition-all text-[#1a1c19] text-center disabled:opacity-50" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#134B36]/70 uppercase tracking-wider pl-1">CVC / CVV</label>
                <div className="relative">
                  <input type="text" required maxLength="3" placeholder="123" disabled={isProcessing} className="w-full pl-5 pr-12 py-4 bg-[#F8F6F0] border border-transparent rounded-2xl outline-none focus:border-[#C9A84C] focus:bg-white transition-all text-[#1a1c19] text-center disabled:opacity-50" />
                  <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-[#134B36]/40">
                    <Lock size={16} />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isProcessing || isSuccess} className="w-full py-5 mt-4 bg-[#134B36] text-[#f8f6f0] rounded-2xl font-bold text-lg hover:bg-[#0B2E21] hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-90 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-wait">
              {isProcessing ? (
                <>Ödeme Alınıyor <Loader2 size={22} className="animate-spin" /></>
              ) : (
                <>₺{price.toLocaleString('tr-TR')} Ödemeyi Tamamla</>
              )}
            </button>
            
            <p className="text-center text-xs text-[#134B36]/40 mt-4 flex items-center justify-center gap-2">
              <Lock size={12}/> 256-bit SSL şifreleme ile korunmaktadır.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CheckoutModal;