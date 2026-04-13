import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Phone, User, Mail, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Ekledik

const ISTANBUL_ILCELERI = [
  "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler",
  "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü",
  "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt",
  "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane",
  "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer",
  "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla",
  "Ümraniye", "Üsküdar", "Zeytinburnu"
];

const PartnerApplication = () => {
  const [currentUser, setCurrentUser] = useState(null); // YENİ: Kullanıcı state'i
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', experience: '', message: '' });
  const [secilenIlceler, setSecilenIlceler] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // YENİ: Kullanıcı durumunu dinle (Giriş yapmış mı?)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Otomatik e-posta doldurma
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleIlceSecimi = (ilce) => {
    if (secilenIlceler.includes(ilce)) setSecilenIlceler(secilenIlceler.filter(i => i !== ilce));
    else setSecilenIlceler([...secilenIlceler, ilce]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    // GÜVENLİK KİLİDİ: UID yoksa başvuru yaptırma
    if (!currentUser || !currentUser.uid) {
      setErrorMsg('Sistemsel bir hata oluştu. Lütfen çıkış yapıp tekrar giriş yapın.');
      setIsSubmitting(false);
      return;
    }

    if (secilenIlceler.length === 0) {
      setErrorMsg('Lütfen hizmet verebileceğiniz en az bir ilçe seçiniz.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Başvuru formuna GERÇEK KİMLİĞİ ZIMBALIYORUZ
      await addDoc(collection(db, 'partner_applications'), {
        ...formData,
        uid: currentUser.uid,
        hizmetBolgeleri: secilenIlceler,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Başvuru gönderilemedi:", error);
      setErrorMsg("Bağlantı hatası oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-40 pb-32 min-h-screen bg-[#F8F6F0] flex justify-center items-center px-6 relative z-10">
        <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl border border-[#134B36]/10 text-center max-w-2xl">
          <div className="w-24 h-24 bg-[#134B36]/5 rounded-full flex items-center justify-center mx-auto mb-8"><CheckCircle2 size={48} className="text-[#C9A84C]" /></div>
          <h2 className="text-4xl font-serif text-[#134B36] mb-4">Başvurunuz Alındı</h2>
          <p className="text-[#1a1c19]/70 text-lg mb-8">Ekibimiz bilgilerinizi inceledikten sonra onay sürecini başlatacaktır.</p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-[#134B36] text-[#F8F6F0] rounded-full font-bold hover:bg-[#0B2E21] transition-all">Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#F8F6F0] relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 items-start">
        <div className="w-full lg:w-1/2 lg:sticky lg:top-32">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#134B36]/20 bg-white mb-8">
            <ShieldCheck size={16} className="text-[#C9A84C]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#134B36]">Vefa Saha Ekibi</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-[#134B36] tracking-tight mb-8">Bizimle Birlikte <br /><span className="text-[#C9A84C] italic">Değer Katın</span></h1>
          <p className="text-lg text-[#134B36]/80 leading-relaxed mb-10 max-w-lg">Sisteme dahil olun, bulunduğunuz şehirdeki iş fırsatlarını değerlendirin.</p>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-[#134B36]/10">
            <h3 className="text-3xl font-serif text-[#134B36] mb-8">Saha Ekibi Başvuru Formu</h3>

            {/* YENİ: KULLANICI GİRİŞ YAPMAMIŞSA UYARI VER VE FORMU GİZLE */}
            {!currentUser ? (
              <div className="text-center p-8 bg-orange-50 rounded-2xl border border-orange-100">
                <AlertCircle size={40} className="mx-auto text-orange-400 mb-4" />
                <h4 className="text-xl font-bold text-orange-800 mb-2">Önce Üye Girişi Yapmalısınız</h4>
                <p className="text-orange-600 text-sm mb-6">Başvuru yapabilmek ve ileride işleri takip edebilmek için sisteme kayıtlı bir hesabınız olmalıdır.</p>
                <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">Giriş Yap / Üye Ol</button>
              </div>
            ) : (
              // KULLANICI GİRİŞ YAPMIŞSA FORMU GÖSTER
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">{errorMsg}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center"><User size={18} className="text-[#134B36]/40" /></div><input type="text" name="name" required placeholder="Ad Soyad" value={formData.name} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-[#F8F6F0]/50 border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C]" /></div>
                  <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center"><Phone size={18} className="text-[#134B36]/40" /></div><input type="tel" name="phone" required placeholder="Telefon Numarası" value={formData.phone} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-[#F8F6F0]/50 border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C]" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center"><Mail size={18} className="text-[#134B36]/40" /></div><input type="email" name="email" required placeholder="E-posta Adresi" value={formData.email} onChange={handleChange} readOnly className="w-full pl-11 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-2xl outline-none text-gray-500 cursor-not-allowed" /></div>
                  <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center"><Briefcase size={18} className="text-[#134B36]/40" /></div><select name="experience" required value={formData.experience} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-[#F8F6F0]/50 border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C]"><option value="" disabled>Tecrübe Yılı</option><option value="1-3">1 - 3 Yıl</option><option value="5+">5 Yıldan Fazla</option></select></div>
                </div>

                <div className="pt-4 pb-2">
                  <h4 className="text-[12px] font-bold text-[#134B36]/60 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin size={16} /> Hizmet Bölgeleri Seçimi</h4>
                  <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto p-2 border border-[#134B36]/10 rounded-2xl bg-[#F8F6F0]/30 custom-scrollbar">
                    {ISTANBUL_ILCELERI.map(ilce => {
                      const isSelected = secilenIlceler.includes(ilce);
                      return (
                        <button type="button" key={ilce} onClick={() => handleIlceSecimi(ilce)} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${isSelected ? 'bg-[#134B36] text-[#F8F6F0] border-[#134B36]' : 'bg-white text-[#134B36]/60 border-[#134B36]/10 hover:border-[#134B36]/30'}`}>
                          {isSelected && <Check size={12} strokeWidth={3} className="inline mr-1" />}{ilce}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <textarea name="message" placeholder="Eklemek istedikleriniz" value={formData.message} onChange={handleChange} rows="3" className="w-full p-4 bg-[#F8F6F0]/50 border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C] resize-none"></textarea>

                <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 bg-[#134B36] text-[#f8f6f0] rounded-2xl font-bold hover:bg-[#0B2E21] hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Gönderiliyor...</> : <>Başvuruyu Tamamla <ArrowRight size={18} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PartnerApplication;