import React, { useState } from 'react';
import { X, MapPin, Check, Plus, CreditCard, Info, Map, AlertCircle } from 'lucide-react';

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
  
  // YENİ: Hata mesajını tutacağımız state
  const [error, setError] = useState('');

  // Hazır Mezarlık Listesi
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

  // YENİ: Ödeme sayfasına gitmeden önceki kontrol noktası
  const handleValidationAndProceed = () => {
    if (!graveDesign?.cemetery?.trim() || !graveDesign?.ada?.trim() || !graveDesign?.parsel?.trim()) {
      setError('Lütfen işleme devam etmeden önce Mezarlık Adı, Ada No ve Parsel No alanlarını eksiksiz doldurun.');
      return;
    }
    setError(''); // Her şey tamamsa hatayı temizle
    onProceed();  // App.js'teki ödeme modalını tetikle
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-[#0d1a10]/40 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#F8F6F0] shadow-[auto_-10px_50px_rgba(0,0,0,0.3)] z-[110] flex flex-col animate-in slide-in-from-right-full duration-500 border-l border-[#134B36]/10">
        
        {/* BAŞLIK ALANI */}
        <div className="flex items-center justify-between p-6 md:p-8 bg-white border-b border-[#134B36]/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-1 block">Sipariş Özeti</span>
            <h2 className="text-2xl font-serif text-[#134B36] font-medium leading-none">
              {selectedPackage?.title || 'Özel Tasarım'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-[#F8F6F0] rounded-full flex items-center justify-center text-[#134B36] hover:bg-[#134B36] hover:text-[#F8F6F0] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* KAYDIRILABİLİR İÇERİK ALANI */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar">
          
          {/* MEZARLIK & ADA PARSEL ALANI */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#134B36]/50 flex items-center gap-2">
              <MapPin size={16} /> Mezar Konumu
            </h3>
            
            <div className="bg-white p-5 rounded-2xl border border-[#134B36]/10 shadow-sm space-y-4 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-[#134B36]"></div>
               
               {/* Mezarlık Seçimi */}
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
                      if(error) setError(''); // Yazmaya başlayınca hatayı kaldır
                    }}
                    className={`w-full p-4 bg-[#F8F6F0] border ${error && !graveDesign?.cemetery?.trim() ? 'border-red-400 focus:border-red-500 bg-red-50/50' : 'border-transparent focus:border-[#C9A84C] focus:bg-white'} rounded-xl outline-none transition-all text-[#1a1c19] text-sm font-medium`}
                  />
                  <datalist id="cemeteries">
                    {popularCemeteries.map((cem, idx) => (
                      <option key={idx} value={cem} />
                    ))}
                  </datalist>
               </div>

               {/* Ada ve Parsel */}
               <div className="flex gap-4">
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
                        className={`w-full pl-10 pr-4 py-4 bg-[#F8F6F0] border ${error && !graveDesign?.ada?.trim() ? 'border-red-400 focus:border-red-500 bg-red-50/50' : 'border-transparent focus:border-[#C9A84C] focus:bg-white'} rounded-xl outline-none transition-all text-[#1a1c19] text-sm font-medium`}
                      />
                      <Map size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${error && !graveDesign?.ada?.trim() ? 'text-red-400' : 'text-[#134B36]/40'}`} />
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
                        className={`w-full pl-10 pr-4 py-4 bg-[#F8F6F0] border ${error && !graveDesign?.parsel?.trim() ? 'border-red-400 focus:border-red-500 bg-red-50/50' : 'border-transparent focus:border-[#C9A84C] focus:bg-white'} rounded-xl outline-none transition-all text-[#1a1c19] text-sm font-medium`}
                      />
                      <MapPin size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${error && !graveDesign?.parsel?.trim() ? 'text-red-400' : 'text-[#134B36]/40'}`} />
                    </div>
                 </div>
               </div>
               
               <p className="text-[9px] text-[#134B36]/50 flex items-start gap-1.5 leading-relaxed pt-2">
                 <Info size={12} className="shrink-0 mt-0.5" />
                 Mezarın doğru tespiti ve bakımın eksiksiz yapılması için Ada ve Parsel numaralarını doğru girmeniz çok önemlidir.
               </p>
            </div>
          </div>

          {/* EKSTRA HİZMETLER */}
          <div className="space-y-4 border-t border-[#134B36]/5 pt-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#134B36]/50 flex items-center gap-2">
              <Plus size={16} /> İsteğe Bağlı Ekstralar
            </h3>
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
                      isSelected ? 'border-[#134B36] bg-[#134B36]/5 shadow-sm' : 'border-[#134B36]/10 bg-white hover:border-[#134B36]/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? 'bg-[#134B36] text-white' : 'bg-[#F8F6F0] border border-[#134B36]/20'}`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-bold ${isSelected ? 'text-[#134B36]' : 'text-[#134B36]/80'}`}>{extra.name}</p>
                        <p className="text-xs font-black text-[#C9A84C]">+{extra.price} ₺</p>
                      </div>
                      <p className="text-[10px] text-[#134B36]/50 leading-relaxed pr-4">{extra.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* FİYAT DETAYLARI */}
          <div className="space-y-4 border-t border-[#134B36]/5 pt-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#134B36]/50">Hesap Özeti</h3>
            <div className="bg-white rounded-2xl p-5 border border-[#134B36]/10 shadow-sm space-y-3">
              {priceDetails.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-[#134B36]/70">{item.name}</span>
                  <span className="font-semibold text-[#134B36]">{item.price} ₺</span>
                </div>
              ))}
              <div className="h-px bg-[#134B36]/10 w-full my-2"></div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold uppercase tracking-widest text-[#134B36]/60">Toplam</span>
                <span className="text-3xl font-black text-[#C9A84C]">{priceDetails.total} ₺</span>
              </div>
            </div>
          </div>

        </div>

        {/* ALT SABİT BUTON ALANI VE HATA MESAJI */}
        <div className="p-6 md:p-8 bg-white border-t border-[#134B36]/10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] flex flex-col gap-4">
          
          {/* YENİ: Hata varsa göster */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-in slide-in-from-bottom-2 duration-300">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-red-600 leading-relaxed">{error}</p>
            </div>
          )}

          <button 
            onClick={handleValidationAndProceed}
            className="w-full py-5 bg-[#134B36] text-[#F8F6F0] rounded-[1.5rem] font-bold text-lg shadow-[0_10px_30px_rgba(19,75,54,0.2)] hover:bg-[#0B2E21] hover:shadow-[0_15px_40px_rgba(19,75,54,0.3)] hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
          >
            <CreditCard size={20} /> Ödeme Adımına Geç
          </button>
        </div>

      </div>
    </>
  );
};

export default OrderDrawer;