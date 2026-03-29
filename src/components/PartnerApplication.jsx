import React, { useState } from 'react';
import { Briefcase, MapPin, Phone, User, Mail, CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const PartnerApplication = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    experience: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Form verilerini Firestore'a ekliyoruz
      await addDoc(collection(db, 'partner_applications'), {
        ...formData,
        status: 'pending', // Başlangıç durumu: Bekliyor
        createdAt: serverTimestamp()
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Başvuru gönderilemedi:", error);
      setErrorMsg("Bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-40 pb-32 min-h-screen bg-[#F8F6F0] flex justify-center items-center px-6 relative z-10">
        <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl border border-[#134B36]/10 text-center max-w-2xl animate-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-[#134B36]/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-[#C9A84C]" />
          </div>
          <h2 className="text-4xl font-serif text-[#134B36] mb-4">Başvurunuz Alındı</h2>
          <p className="text-[#1a1c19]/70 text-lg leading-relaxed mb-8">
            Vefa saha ekibine katılma talebiniz başarıyla bize ulaştı. Ekibimiz bilgilerinizi inceledikten sonra en kısa sürede sizinle iletişime geçecektir.
          </p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-[#134B36] text-[#F8F6F0] rounded-full font-bold hover:bg-[#0B2E21] transition-all">
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#F8F6F0] relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Sol Taraf: Bilgi Alanı */}
        <div className="w-full lg:w-1/2 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#134B36]/20 bg-white mb-8">
            <ShieldCheck size={16} className="text-[#C9A84C]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#134B36]">Vefa Saha Ekibi</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-[#134B36] tracking-tight mb-8">
            Bizimle Birlikte <br/><span className="text-[#C9A84C] italic">Değer Katın</span>
          </h1>
          <p className="text-lg text-[#134B36]/80 leading-relaxed mb-10 max-w-lg">
            Türkiye'nin dört bir yanındaki mezar bakım ve peyzaj profesyonellerini tek bir dijital çatıda topluyoruz. Sisteme dahil olun, bulunduğunuz şehirdeki iş fırsatlarını anında değerlendirin.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-[#134B36]/10 shadow-sm"><Briefcase size={20} className="text-[#134B36]" /></div>
              <div>
                <h4 className="font-bold text-[#134B36] mb-1">Düzenli İş Akışı</h4>
                <p className="text-sm text-[#134B36]/70">Şehrinizden gelen tüm bakım ve peyzaj talepleri direkt olarak panelinize düşer.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-[#134B36]/10 shadow-sm"><CheckCircle2 size={20} className="text-[#134B36]" /></div>
              <div>
                <h4 className="font-bold text-[#134B36] mb-1">Güvenli ve Hızlı Ödeme</h4>
                <p className="text-sm text-[#134B36]/70">İşlemi tamamlayıp fotoğrafları yüklediğiniz an hakedişiniz cüzdanınıza yansır.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Başvuru Formu */}
        <div className="w-full lg:w-1/2 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-[#134B36]/10">
            <h3 className="text-3xl font-serif text-[#134B36] mb-8">Saha Ekibi Başvuru Formu</h3>
            
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User size={18} className="text-[#134B36]/40" /></div>
                  <input type="text" name="name" required disabled={isSubmitting} placeholder="Ad Soyad / Firma Adı" value={formData.name} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-[#F8F6F0]/50 border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C] transition-all text-[#1a1c19] placeholder:text-[#134B36]/40" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><MapPin size={18} className="text-[#134B36]/40" /></div>
                  <input type="text" name="city" required disabled={isSubmitting} placeholder="Hizmet Verdiğiniz Şehir" value={formData.city} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-[#F8F6F0]/50 border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C] transition-all text-[#1a1c19] placeholder:text-[#134B36]/40" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone size={18} className="text-[#134B36]/40" /></div>
                  <input type="tel" name="phone" required disabled={isSubmitting} placeholder="Telefon Numarası" value={formData.phone} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-[#F8F6F0]/50 border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C] transition-all text-[#1a1c19] placeholder:text-[#134B36]/40" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-[#134B36]/40" /></div>
                  <input type="email" name="email" required disabled={isSubmitting} placeholder="E-posta Adresi" value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-[#F8F6F0]/50 border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C] transition-all text-[#1a1c19] placeholder:text-[#134B36]/40" />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Briefcase size={18} className="text-[#134B36]/40" /></div>
                <select name="experience" required disabled={isSubmitting} value={formData.experience} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-[#F8F6F0]/50 border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C] transition-all text-[#134B36] appearance-none cursor-pointer">
                  <option value="" disabled>Tecrübe Yılı</option>
                  <option value="1-3">1 - 3 Yıl</option>
                  <option value="3-5">3 - 5 Yıl</option>
                  <option value="5+">5 Yıldan Fazla</option>
                </select>
              </div>

              <textarea name="message" disabled={isSubmitting} placeholder="Eklemek istedikleriniz (Varsa referanslarınız veya araç durumunuz)" value={formData.message} onChange={handleChange} rows="3" className="w-full p-4 bg-[#F8F6F0]/50 border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C] transition-all text-[#1a1c19] placeholder:text-[#134B36]/40 resize-none"></textarea>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 bg-[#134B36] text-[#f8f6f0] rounded-2xl font-bold hover:bg-[#0B2E21] hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Gönderiliyor...</> : <>Başvuruyu Tamamla <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PartnerApplication;