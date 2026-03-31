import React, { useState, useEffect } from 'react';
import { X, MapPin, Check, Plus, CreditCard, Info, Map, AlertCircle, ChevronRight, ChevronLeft, CheckCircle, User } from 'lucide-react';

const OrderDrawer = ({ 
  isOpen, 
  onClose, 
  selectedPackage, 
  onProceed, 
  priceDetails, 
  selectedExtras, 
  setSelectedExtras,
  graveDesign,       
  setGraveDesign 
}) => {
  
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError('');
    }
  }, [isOpen]);

  const popularCemeteries = [
    "Zincirlikuyu Mezarlığı", "Karacaahmet Mezarlığı", "Aşiyan Mezarlığı", 
    "Edirnekapı Şehitliği", "Feriköy Mezarlığı", "Nakkaştepe Mezarlığı", 
    "Çengelköy Mezarlığı", "Kilyos Mezarlığı", "Hasdal Mezarlığı", 
    "Büyükçekmece Yeni Mezarlığı", "Ihlamurkuyu Mezarlığı", "Habipler Mezarlığı"
  ];

  const toggleExtra = (extraId) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId));
    } else {
      setSelectedExtras([...selectedExtras, extraId]);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!graveDesign?.name?.trim() || !graveDesign?.cemetery?.trim() || !graveDesign?.ada?.trim() || !graveDesign?.parsel?.trim()) {
        setError('Lütfen işleme devam etmeden önce tüm alanları eksiksiz doldurun.');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleValidationAndProceed = () => {
    setError(''); 
    onProceed(); 
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-[#0d1a10]/60 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-[#F8F6F0] shadow-[auto_-10px_50px_rgba(0,0,0,0.3)] z-[110] flex flex-col animate-in slide-in-from-right-full duration-500 border-l border-[#134B36]/10">
        
        <div className="bg-white border-b border-[#134B36]/10 pt-6 pb-4 px-5 md:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-1 block">Sipariş Ekranı</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#134B36] font-medium leading-none truncate max-w-[200px] md:max-w-[250px]">
                {selectedPackage?.title || 'Özel Tasarım'}
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 bg-[#F8F6F0] rounded-full flex items-center justify-center text-[#134B36] hover:bg-[#134B36] hover:text-[#F8F6F0] transition-colors shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex-1 h-1.5 rounded-full bg-[#134B36]/10 overflow-hidden relative">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${num < step ? 'bg-[#134B36] w-full' : num === step ? 'bg-[#C9A84C] w-full' : 'w-0'}`}
                />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-[#134B36]/40 uppercase tracking-widest mt-2 text-right">
            Adım {step} / 3
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 no-scrollbar relative">
          
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-serif text-[#134B36] flex items-center gap-2 border-b border-[#134B36]/10 pb-3">
                <MapPin size={20} className="text-[#C9A84C]" /> Konum ve Bilgiler
              </h3>
              
              <div className="space-y-5">
                 <div>
                    <label className="text-[10px] font-bold text-[#134B36]/60 uppercase tracking-widest mb-2 block">
                      Merhum Adı Soyadı
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Örn: Ahmet Yılmaz"
                        value={graveDesign?.name || ''}
                        onChange={(e) => {
                          setGraveDesign({...graveDesign, name: e.target.value});
                          if(error) setError(''); 
                        }}
                        className={`w-full pl-11 pr-4 py-4 bg-white border ${error && !graveDesign?.name?.trim() ? 'border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.1)]' : 'border-[#134B36]/10 focus:border-[#C9A84C]'} rounded-xl outline-none focus:ring-4 focus:ring-[#C9A84C]/10 transition-all text-[#1a1c19] text-sm font-medium`}
                      />
                      <User size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${error && !graveDesign?.name?.trim() ? 'text-red-400' : 'text-[#134B36]/40'}`} />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-[#134B36]/60 uppercase tracking-widest mb-2 block">
                      Mezarlık Adı
                    </label>
                    <input 
                      list="cemeteries" 
                      placeholder="Listeden seçin veya yazın..."
                      value={graveDesign?.cemetery || ''}
                      onChange={(e) => {
                        setGraveDesign({...graveDesign, cemetery: e.target.value});
                        if(error) setError(''); 
                      }}
                      className={`w-full p-4 bg-white border ${error && !graveDesign?.cemetery?.trim() ? 'border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.1)]' : 'border-[#134B36]/10 focus:border-[#C9A84C]'} rounded-xl outline-none focus:ring-4 focus:ring-[#C9A84C]/10 transition-all text-[#1a1c19] text-sm font-medium`}
                    />
                    <datalist id="cemeteries">
                      {popularCemeteries.map((cem, idx) => (
                        <option key={idx} value={cem} />
                      ))}
                    </datalist>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-5">
                   <div className="flex-1">
                      <label className="text-[10px] font-bold text-[#134B36]/60 uppercase tracking-widest mb-2 block">
                        Ada No
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Örn: 15"
                          value={graveDesign?.ada || ''}
                          onChange={(e) => {
                            setGraveDesign({...graveDesign, ada: e.target.value});
                            if(error) setError('');
                          }}
                          className={`w-full pl-11 pr-4 py-4 bg-white border ${error && !graveDesign?.ada?.trim() ? 'border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.1)]' : 'border-[#134B36]/10 focus:border-[#C9A84C]'} rounded-xl outline-none focus:ring-4 focus:ring-[#C9A84C]/10 transition-all text-[#1a1c19] text-sm font-medium`}
                        />
                        <Map size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${error && !graveDesign?.ada?.trim() ? 'text-red-400' : 'text-[#134B36]/40'}`} />
                      </div>
                   </div>
                   <div className="flex-1">
                      <label className="text-[10px] font-bold text-[#134B36]/60 uppercase tracking-widest mb-2 block">
                        Parsel No
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Örn: 240"
                          value={graveDesign?.parsel || ''}
                          onChange={(e) => {
                            setGraveDesign({...graveDesign, parsel: e.target.value});
                            if(error) setError('');
                          }}
                          className={`w-full pl-11 pr-4 py-4 bg-white border ${error && !graveDesign?.parsel?.trim() ? 'border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.1)]' : 'border-[#134B36]/10 focus:border-[#C9A84C]'} rounded-xl outline-none focus:ring-4 focus:ring-[#C9A84C]/10 transition-all text-[#1a1c19] text-sm font-medium`}
                        />
                        <MapPin size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${error && !graveDesign?.parsel?.trim() ? 'text-red-400' : 'text-[#134B36]/40'}`} />
                      </div>
                   </div>
                 </div>
                 
                 <div className="bg-[#134B36]/5 p-4 rounded-xl border border-[#134B36]/10 flex items-start gap-3 mt-2">
                   <Info size={16} className="text-[#C9A84C] shrink-0 mt-0.5" />
                   <p className="text-[11px] text-[#134B36]/70 leading-relaxed">
                     Mezarın doğru tespiti ve bakımın eksiksiz yapılması için Ada ve Parsel numaralarını doğru girmeniz operasyonumuz için kritiktir.
                   </p>
                 </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between border-b border-[#134B36]/10 pb-3">
                <h3 className="text-lg font-serif text-[#134B36] flex items-center gap-2">
                  <Plus size={20} className="text-[#C9A84C]" /> İsteğe Bağlı Ekstralar
                </h3>
                <span className="text-[10px] font-bold text-[#134B36]/40 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-[#134B36]/5">İsteğe Bağlı</span>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 'polish', name: 'Özel Mermer Cilası', price: 300, desc: 'Mermerin ömrünü uzatır ve ilk günkü gibi parlatır.' },
                  { id: 'birdbath', name: 'Mermer Kuşluk', price: 250, desc: 'Mezar üzerine kuşların su içebileceği şık bir oyuk eklenir.' },
                  { id: 'pebbles', name: 'Kar Beyazı Çakıl Taşı', price: 150, desc: 'Toprak yüzeyine veya etrafına temizleyici beyaz taşlar serilir.' }
                ].map(extra => {
                  const isSelected = selectedExtras.includes(extra.id);
                  return (
                    <button 
                      key={extra.id} 
                      onClick={() => toggleExtra(extra.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-start gap-4 ${
                        isSelected ? 'border-[#134B36] bg-[#134B36]/5 shadow-[0_5px_15px_rgba(19,75,54,0.05)]' : 'border-[#134B36]/10 bg-white hover:border-[#134B36]/30'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? 'bg-[#134B36] text-white' : 'bg-[#F8F6F0] border border-[#134B36]/20'}`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-bold ${isSelected ? 'text-[#134B36]' : 'text-[#134B36]/80'}`}>{extra.name}</p>
                          <p className="text-xs font-black text-[#C9A84C]">+{extra.price} ₺</p>
                        </div>
                        <p className="text-[11px] text-[#134B36]/60 leading-relaxed pr-2">{extra.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-serif text-[#134B36] flex items-center gap-2 border-b border-[#134B36]/10 pb-3">
                <CreditCard size={20} className="text-[#C9A84C]" /> Hesap Özeti
              </h3>
              
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#134B36]/10 shadow-sm space-y-4">
                {priceDetails.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-[#134B36]/80 pr-4">{item.name}</span>
                    <span className="font-semibold text-[#134B36] shrink-0">{item.price} ₺</span>
                  </div>
                ))}
                
                <div className="h-px bg-[#134B36]/10 w-full my-4"></div>
                
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#134B36]/60">Genel Toplam</span>
                  <span className="text-3xl md:text-4xl font-black text-[#134B36]">
                    {priceDetails.total} <span className="text-xl text-[#C9A84C]">₺</span>
                  </span>
                </div>
              </div>

              <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 flex items-start gap-3 mt-2">
                 <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                 <p className="text-[11px] text-green-800 leading-relaxed">
                   Tüm seçimleriniz başarıyla kaydedildi. Ödeme adımında kredi kartı bilgilerinizi güvenle girebilirsiniz.
                 </p>
              </div>
            </div>
          )}

        </div>

        <div className="p-5 md:p-8 pb-8 md:pb-8 bg-white border-t border-[#134B36]/10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] flex flex-col gap-3.5 z-20">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-in slide-in-from-bottom-2 duration-300">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-red-600 leading-relaxed">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <button 
                onClick={handlePrevStep}
                className="w-14 md:w-16 py-4 bg-[#F8F6F0] text-[#134B36] rounded-2xl border border-[#134B36]/10 hover:bg-[#134B36]/5 hover:border-[#134B36]/30 transition-all flex items-center justify-center shrink-0"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {step < 3 ? (
              <button 
                onClick={handleNextStep}
                className="flex-1 py-4 md:py-5 bg-[#134B36] text-[#F8F6F0] rounded-2xl font-bold text-base shadow-[0_8px_20px_rgba(19,75,54,0.15)] hover:bg-[#0B2E21] hover:shadow-[0_15px_30px_rgba(19,75,54,0.25)] hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                Sonraki Adım <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                onClick={handleValidationAndProceed}
                className="flex-1 py-4 md:py-5 bg-[#C9A84C] text-[#134B36] rounded-2xl font-black uppercase tracking-wider text-sm shadow-[0_8px_20px_rgba(201,168,76,0.3)] hover:bg-[#b0913b] hover:shadow-[0_15px_30px_rgba(201,168,76,0.4)] hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                Güvenli Ödemeye Geç <CreditCard size={18} />
              </button>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default OrderDrawer;