import React, { useState } from 'react';
import { Search, MapPin, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const CEMETERIES_DATA = [
  { id: 1, name: 'Zincirlikuyu Mezarlığı', city: 'İstanbul', district: 'Şişli', inService: true },
  { id: 2, name: 'Karacaahmet Mezarlığı', city: 'İstanbul', district: 'Üsküdar', inService: true },
  { id: 3, name: 'Aşiyan Mezarlığı', city: 'İstanbul', district: 'Beşiktaş', inService: true },
  { id: 4, name: 'Feriköy Mezarlığı', city: 'İstanbul', district: 'Şişli', inService: true },
  { id: 5, name: 'Edirnekapı Şehitliği', city: 'İstanbul', district: 'Eyüpsultan', inService: true },
  { id: 6, name: 'Kilyos Mezarlığı', city: 'İstanbul', district: 'Sarıyer', inService: true },
  { id: 7, name: 'Bülbülderesi Mezarlığı', city: 'İstanbul', district: 'Üsküdar', inService: true },
  { id: 8, name: 'Cebeci Asri Mezarlığı', city: 'Ankara', district: 'Mamak', inService: false },
  { id: 9, name: 'Karşıyaka Mezarlığı', city: 'Ankara', district: 'Yenimahalle', inService: false },
  { id: 10, name: 'Asri Mezarlık', city: 'İzmir', district: 'Konak', inService: false },
];

// YENİ: onOpenDemand prop'u eklendi
const CemeterySearch = ({ onOpenDemand }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCemeteries = CEMETERIES_DATA.filter(cemetery => 
    cemetery.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cemetery.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cemetery.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
      <div className="mb-12 md:mb-16 md:text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-[#134B36] tracking-tight">Hizmet Bölgelerimiz</h2>
        <p className="text-sm md:text-base text-[#134B36]/60 mt-4 max-w-2xl md:mx-auto">
          Şu anda ağırlıklı olarak İstanbul bölgesinde hizmet vermekteyiz. Sevdiklerinizin istirahatgahının hizmet ağımızda olup olmadığını kontrol edin.
        </p>
        <div className="h-1 w-20 bg-[#C9A84C]/50 mt-6 md:mx-auto rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="relative group mb-10 shadow-2xl rounded-full">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-[#C9A84C] text-[#134B36]/40">
            <Search size={24} />
          </div>
          <input 
            type="text" 
            placeholder="Mezarlık adı, şehir veya ilçe arayın... (Örn: Zincirlikuyu, Ankara)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-6 bg-white border border-[#134B36]/10 rounded-full outline-none focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 transition-all text-[#1a1c19] text-lg placeholder:text-[#134B36]/30 shadow-sm"
          />
          <button className="absolute right-3 top-3 bottom-3 bg-[#134B36] text-[#F8F6F0] px-8 rounded-full font-bold hover:bg-[#0B2E21] transition-colors hidden sm:block">
            Sorgula
          </button>
        </div>

        <div className="bg-white rounded-[2rem] border border-[#134B36]/10 shadow-sm overflow-hidden flex flex-col">
           <div className="p-4 md:p-6 bg-[#F8F6F0] border-b border-[#134B36]/5 flex justify-between items-center">
              <span className="text-xs font-bold text-[#134B36]/60 uppercase tracking-widest">Arama Sonuçları</span>
              <span className="text-xs font-bold bg-[#134B36]/10 text-[#134B36] px-3 py-1 rounded-full">{filteredCemeteries.length} Mezarlık Bulundu</span>
           </div>

           <div className="max-h-[400px] overflow-y-auto no-scrollbar p-2">
             {filteredCemeteries.length === 0 ? (
                <div className="p-10 text-center text-[#134B36]/50">
                   <p className="text-lg mb-2 font-medium">Aradığınız kriterlere uygun mezarlık bulunamadı.</p>
                   <p className="text-sm">Lütfen farklı bir kelime ile tekrar deneyin.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 divide-y divide-[#134B36]/5">
                  {filteredCemeteries.map((cemetery) => (
                    <div key={cemetery.id} className="p-4 md:p-6 hover:bg-[#F8F6F0]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-default">
                       <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full mt-1 shrink-0 transition-colors ${cemetery.inService ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                             <MapPin size={20} />
                          </div>
                          <div>
                             <h4 className="text-lg font-serif text-[#134B36]">{cemetery.name}</h4>
                             <p className="text-sm text-[#134B36]/60 mt-1">{cemetery.district}, {cemetery.city}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center sm:justify-end gap-3 sm:w-1/3">
                          {cemetery.inService ? (
                             <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200 w-full sm:w-auto justify-center">
                                <CheckCircle size={16} />
                                <span className="text-xs font-bold tracking-wider">Hizmet Veriliyor</span>
                             </div>
                          ) : (
                             <div className="flex items-center gap-2 text-orange-700 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 w-full sm:w-auto justify-center">
                                <Clock size={16} />
                                <span className="text-xs font-bold tracking-wider">Çok Yakında</span>
                             </div>
                          )}
                       </div>
                    </div>
                  ))}
                </div>
             )}
           </div>
           
           {/* YENİ: Doğrudan Talep formunu açan buton */}
           <div className="p-4 bg-[#134B36]/5 border-t border-[#134B36]/10 text-center">
              <button onClick={onOpenDemand} className="text-sm font-bold text-[#134B36] hover:text-[#C9A84C] transition-colors flex items-center justify-center gap-2 w-full">
                Aradığınız mezarlığı bulamadınız mı? Şehir talebi oluşturun <ArrowRight size={16} />
              </button>
           </div>
           
        </div>
      </div>
    </div>
  );
};

export default CemeterySearch;