import React from 'react';
import VefaAtolyesi from './VefaAtolyesi';
import { MapPin, Camera, ClipboardCheck, BellRing } from 'lucide-react';

const ProcessPage = ({ graveDesign, setGraveDesign }) => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#F8F6F0] relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-serif text-[#134B36] tracking-tight">İşleyiş ve Süreç</h1>
          <div className="h-1 w-24 bg-[#C9A84C] mt-8 mx-auto rounded-full" />
          <p className="mt-8 text-lg text-[#134B36]/70 max-w-2xl mx-auto leading-relaxed">
            Sipariş anından teslimata kadar tamamen şeffaf, raporlanabilir ve profesyonel operasyon sürecimiz.
          </p>
        </div>

        {/* Yeni: Dikey İşlem Adımları (Timeline) */}
        <div className="max-w-4xl mx-auto relative mb-32">
          {/* Timeline Çizgisi */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#134B36]/20 -translate-x-1/2"></div>
          
          <div className="space-y-16">
            {/* Adım 1 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="md:w-5/12 text-right order-2 md:order-1 mt-6 md:mt-0 px-4">
                <h3 className="text-2xl font-serif text-[#134B36] mb-2">Sipariş & Planlama</h3>
                <p className="text-sm text-[#134B36]/70 leading-relaxed">Sistem üzerinden mezar konumu ve istenilen hizmet paketi seçilir. Seçiminiz anında bölgedeki en yetkin saha ekibimize iş emri olarak düşer.</p>
              </div>
              <div className="w-16 h-16 bg-white border-4 border-[#F8F6F0] shadow-lg rounded-full flex items-center justify-center relative z-10 order-1 md:order-2 text-[#C9A84C] group-hover:scale-110 group-hover:bg-[#134B36] group-hover:text-white transition-all">
                <MapPin size={24} />
              </div>
              <div className="md:w-5/12 order-3"></div>
            </div>

            {/* Adım 2 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="md:w-5/12 order-3 md:order-1"></div>
              <div className="w-16 h-16 bg-white border-4 border-[#F8F6F0] shadow-lg rounded-full flex items-center justify-center relative z-10 order-1 md:order-2 text-[#C9A84C] group-hover:scale-110 group-hover:bg-[#134B36] group-hover:text-white transition-all">
                <Camera size={24} />
              </div>
              <div className="md:w-5/12 text-left order-2 md:order-3 mt-6 md:mt-0 px-4">
                <h3 className="text-2xl font-serif text-[#134B36] mb-2">Sahaya İntikal & Öncesi Raporu</h3>
                <p className="text-sm text-[#134B36]/70 leading-relaxed">Ekibimiz mezarlığa ulaştığında, işleme başlamadan önce mezarın o anki durumunu yüksek çözünürlüklü fotoğraflarla sisteme yükler.</p>
              </div>
            </div>

            {/* Adım 3 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="md:w-5/12 text-right order-2 md:order-1 mt-6 md:mt-0 px-4">
                <h3 className="text-2xl font-serif text-[#134B36] mb-2">Bakım & Temizlik İşlemleri</h3>
                <p className="text-sm text-[#134B36]/70 leading-relaxed">Seçilen pakete göre; yosun temizliği, mermer parlatma, toprak değişimi ve peyzaj ekimleri profesyonelce gerçekleştirilir.</p>
              </div>
              <div className="w-16 h-16 bg-white border-4 border-[#F8F6F0] shadow-lg rounded-full flex items-center justify-center relative z-10 order-1 md:order-2 text-[#C9A84C] group-hover:scale-110 group-hover:bg-[#134B36] group-hover:text-white transition-all">
                <ClipboardCheck size={24} />
              </div>
              <div className="md:w-5/12 order-3"></div>
            </div>

            {/* Adım 4 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="md:w-5/12 order-3 md:order-1"></div>
              <div className="w-16 h-16 bg-white border-4 border-[#F8F6F0] shadow-lg rounded-full flex items-center justify-center relative z-10 order-1 md:order-2 text-[#C9A84C] group-hover:scale-110 group-hover:bg-[#134B36] group-hover:text-white transition-all">
                <BellRing size={24} />
              </div>
              <div className="md:w-5/12 text-left order-2 md:order-3 mt-6 md:mt-0 px-4">
                <h3 className="text-2xl font-serif text-[#134B36] mb-2">Teslimat & PDF Rapor</h3>
                <p className="text-sm text-[#134B36]/70 leading-relaxed">İşlem bittiğinde "Sonrası" fotoğrafları çekilir. Sisteme onay düşer düşmez telefonunuza bildirim gelir ve PDF raporunuz panelinize eklenir.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Atölye Tasarım Aracı */}
        <div className="border-t border-[#134B36]/10 pt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-[#134B36]">Kendiniz Deneyimleyin</h2>
            <p className="text-[#134B36]/60 mt-2">Uygulayacağımız mermer ve çiçek değişimlerini sanal olarak test edin.</p>
          </div>
          <VefaAtolyesi graveDesign={graveDesign} setGraveDesign={setGraveDesign} />
        </div>

      </div>
    </div>
  );
};

export default ProcessPage;