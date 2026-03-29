import React from 'react';
import { Target, Heart, Award, Users, Map, CheckCircle2 } from 'lucide-react';

const CorporatePage = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#F8F6F0] relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Başlık ve Vizyon */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-serif text-[#134B36] tracking-tight mb-8">Kurumsal Değerlerimiz</h1>
          <div className="h-1 w-24 bg-[#C9A84C] mb-8 mx-auto rounded-full" />
          <p className="text-[#134B36]/80 leading-relaxed text-xl max-w-3xl mx-auto font-light">
            "Vefa, mesafeleri ortadan kaldırarak sevdiklerinizin ebedi istirahatgahlarına hak ettikleri özeni göstermek amacıyla kurulmuş, Türkiye'nin ilk şeffaf dijital mezar bakım platformudur."
          </p>
        </div>
        
        {/* Misyon & Vizyon Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto">
          <div className="bg-white p-10 rounded-[2.5rem] border border-[#134B36]/10 shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-bl-[100px] -z-0"></div>
            <Target className="text-[#C9A84C] w-12 h-12 mb-6 relative z-10" />
            <h3 className="text-3xl font-serif text-[#134B36] mb-4 relative z-10">Misyonumuz</h3>
            <p className="text-[#1a1c19]/70 leading-relaxed relative z-10">
              Şehir dışında veya yurt dışında yaşayan vatandaşlarımızın "gözü arkada kalmadan", hizmet almasını sağlamak. Yaptığımız her işlemi öncesi ve sonrası fotoğraflarla raporlayarak sektörde daha önce olmayan bir güven standardı inşa ediyoruz.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#134B36] to-[#0B2E21] p-10 rounded-[2.5rem] shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] -z-0"></div>
            <Heart className="text-[#C9A84C] w-12 h-12 mb-6 relative z-10" />
            <h3 className="text-3xl font-serif text-white mb-4 relative z-10">Vizyonumuz</h3>
            <p className="text-[#F8F6F0]/80 leading-relaxed relative z-10">
              Türkiye'nin 81 ilinde standardize edilmiş, denetlenebilir bir saha ağı kurmak ve manevi değerlere saygı çerçevesinde teknolojiyi kullanarak bu kadim hizmeti modern çağa entegre etmektir.
            </p>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-sm border border-[#134B36]/10 mb-24 relative overflow-hidden">
           <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#C9A84C]"></div>
           <h2 className="text-3xl font-serif text-[#134B36] text-center mb-12">Rakamlarla Vefa</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             <div>
               <div className="text-5xl font-serif text-[#C9A84C] mb-2">12+</div>
               <div className="text-sm font-bold text-[#134B36]/60 uppercase tracking-widest flex items-center justify-center gap-2"><Map size={16}/> Aktif Şehir</div>
             </div>
             <div>
               <div className="text-5xl font-serif text-[#C9A84C] mb-2">850+</div>
               <div className="text-sm font-bold text-[#134B36]/60 uppercase tracking-widest flex items-center justify-center gap-2"><CheckCircle2 size={16}/> Tamamlanan İşlem</div>
             </div>
             <div>
               <div className="text-5xl font-serif text-[#C9A84C] mb-2">45+</div>
               <div className="text-sm font-bold text-[#134B36]/60 uppercase tracking-widest flex items-center justify-center gap-2"><Users size={16}/> Doğrulanmış Esnaf</div>
             </div>
             <div>
               <div className="text-5xl font-serif text-[#C9A84C] mb-2">%99</div>
               <div className="text-sm font-bold text-[#134B36]/60 uppercase tracking-widest flex items-center justify-center gap-2"><Award size={16}/> Memnuniyet</div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CorporatePage;