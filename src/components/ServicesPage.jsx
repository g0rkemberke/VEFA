import React, { useState } from 'react';
import Packages from './Packages';
import { Leaf, Droplets, Sparkles, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

const ServicesPage = ({ onSelectPackage }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "Bakım sonrası fotoğraflar ne zaman yüklenir?", a: "Ekibimiz sahada işlemi bitirdiği an, sistem üzerinden 'Öncesi' ve 'Sonrası' fotoğraflarını yükler. Anında SMS ve e-posta ile bilgilendirilirsiniz." },
    { q: "Kullandığınız temizlik malzemeleri mermere zarar verir mi?", a: "Kesinlikle hayır. Mermer ve granit yüzeyler için özel üretilmiş, asit içermeyen biyo-çözünür solüsyonlar kullanıyoruz." },
    { q: "Çiçekler kurursa ne oluyor?", a: "Abonelikli (Düzenli) paketlerimizde çiçeklerin durumu her ay kontrol edilir. Kuruyan veya solan mevsimlik çiçekler, bakım kapsamında ücretsiz yenilenir." },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#F8F6F0] relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Sayfa Başlığı */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-serif text-[#134B36] tracking-tight">Hizmetlerimiz</h1>
          <div className="h-1 w-24 bg-[#C9A84C] mt-8 mx-auto rounded-full" />
          <p className="mt-8 text-lg text-[#134B36]/70 max-w-2xl mx-auto leading-relaxed">
            Uzaktaki sevdiklerinizin emanetlerine en iyi şekilde bakmak için hazırladığımız profesyonel bakım ve peyzaj çözümleri.
          </p>
        </div>

        {/* Yeni: Hizmet Kapsamı Detayları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
          <div className="bg-white p-8 rounded-3xl border border-[#134B36]/10 shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-[#134B36]/10 rounded-2xl flex items-center justify-center mb-6"><Leaf className="text-[#134B36]" size={28}/></div>
            <h3 className="text-xl font-serif text-[#134B36] mb-3">Peyzaj & Ekim</h3>
            <p className="text-sm text-[#134B36]/70 leading-relaxed">Toprak havalandırması, yabani ot temizliği ve iklime uygun mevsimlik çiçek ekimi özenle yapılır.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-[#134B36]/10 shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-[#134B36]/10 rounded-2xl flex items-center justify-center mb-6"><Sparkles className="text-[#134B36]" size={28}/></div>
            <h3 className="text-xl font-serif text-[#134B36] mb-3">Mermer Temizliği</h3>
            <p className="text-sm text-[#134B36]/70 leading-relaxed">Zamanla oluşan yosun, kuş pisliği ve kararmalar özel fırçalar ve kimyasal olmayan ilaçlarla temizlenir.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-[#134B36]/10 shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-[#C9A84C]/20 rounded-2xl flex items-center justify-center mb-6"><Droplets className="text-[#8B6914]" size={28}/></div>
            <h3 className="text-xl font-serif text-[#134B36] mb-3">Düzenli Sulama</h3>
            <p className="text-sm text-[#134B36]/70 leading-relaxed">Sıcak yaz aylarında kurumaya yüz tutan toprak ve bitkiler için planlı periyotlarla sulama işlemi sağlanır.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-[#134B36]/10 shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-[#134B36]/10 rounded-2xl flex items-center justify-center mb-6"><ShieldCheck className="text-[#134B36]" size={28}/></div>
            <h3 className="text-xl font-serif text-[#134B36] mb-3">Fiziki Kontrol</h3>
            <p className="text-sm text-[#134B36]/70 leading-relaxed">Mezar taşında kayma, mermerde çatlama veya çökme gibi durumlar tespit edilirse size anında raporlanır.</p>
          </div>
        </div>

        {/* Ana Paketler */}
        <Packages onSelect={onSelectPackage} />

        {/* Yeni: Sıkça Sorulan Sorular */}
        <div className="mt-32 max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif text-[#134B36] text-center mb-10">Sıkça Sorulan Sorular</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-[#134B36]/10 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-[#1a1c19]">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="text-[#C9A84C]"/> : <ChevronDown className="text-[#134B36]/40"/>}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-[#134B36]/70 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServicesPage;