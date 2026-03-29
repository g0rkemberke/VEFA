import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Image as ImageIcon, MapPin, CheckCircle, AlertCircle, Clock, User, Plus, Edit2, FileText, Printer, X, Home, CheckSquare, Briefcase, Camera, Star, Save, Trash2, RefreshCw, ShoppingCart, Navigation } from 'lucide-react';
import { db, auth } from '../firebase'; 
import { doc, updateDoc, onSnapshot, arrayUnion, setDoc } from 'firebase/firestore'; 
import { updateProfile } from 'firebase/auth';

const compactPackages = [
  { id: 'standart', title: 'Standart Bakım', price: 1200, desc: 'Temel temizlik ve yıkama' },
  { id: 'premium', title: 'Premium Bakım', price: 2400, desc: 'Çiçek ekimi ve mermer bakımı' },
  { id: 'vip', title: 'VIP Bakım', price: 4750, desc: 'Özel bitkiler ve tam restorasyon' }
];

const UserDashboard = ({ globalOrders = [], user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReport, setSelectedReport] = useState(null);
  const [userData, setUserData] = useState({ phone: '', graves: [] });
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.displayName || '', phone: '' });

  const [isAddingGrave, setIsAddingGrave] = useState(false);
  const [graveForm, setGraveForm] = useState({ deceasedName: '', cemetery: '', selectedPackage: null });
  const [isProcessing, setIsProcessing] = useState(false);

  const [reviewingId, setReviewingId] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [ratingData, setRatingData] = useState({ stars: 0, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const userOrders = globalOrders.filter(o => o.customerEmail === user?.email);
  const completedHistory = userOrders.filter(o => o.status === 'completed');
  const activeOrders = userOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  
  const latestOrder = activeOrders[0];
  const displayCemetery = latestOrder?.cemetery || (userData.graves.length > 0 ? userData.graves[0].cemetery : "Henüz mezar kaydı yok");
  const displayDeceased = latestOrder?.deceasedName || (userData.graves.length > 0 ? userData.graves[0].deceasedName : "Kayıtlı isim yok");

  useEffect(() => {
    if (!user?.uid) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({ phone: data.phone || '', graves: data.graves || [] });
        setProfileForm(prev => ({ ...prev, phone: data.phone || '' }));
      }
    });
    return () => unsubscribe();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      if (profileForm.name !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: profileForm.name });
      }
      await updateDoc(doc(db, 'users', user.uid), { name: profileForm.name, phone: profileForm.phone });
      setIsEditingProfile(false);
      alert("Profil bilgileriniz başarıyla güncellendi.");
    } catch (error) {
      alert("Bir hata oluştu.");
    }
  };

  const handleAddGrave = async () => {
    if (!graveForm.deceasedName || !graveForm.cemetery) {
      alert("Lütfen merhum adı ve mezarlık alanlarını doldurun.");
      return;
    }
    setIsProcessing(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        graves: arrayUnion({ deceasedName: graveForm.deceasedName, cemetery: graveForm.cemetery })
      });

      if (graveForm.selectedPackage) {
        const orderId = `VF-${Math.floor(1000 + Math.random() * 9000)}`;
        const finalPrice = graveForm.selectedPackage.price;
        
        await setDoc(doc(db, 'orders', orderId), {
          id: orderId,
          customer: user.displayName,
          customerEmail: user.email,
          package: graveForm.selectedPackage.title,
          cemetery: graveForm.cemetery,
          deceasedName: graveForm.deceasedName,
          graveDetails: 'Standart İşlem (Profil Üzerinden)',
          price: finalPrice,
          date: new Date().toLocaleDateString('tr-TR'),
          status: 'pending',
          autoRenew: true,
          createdAt: Date.now()
        });

        const savedFin = localStorage.getItem('vefa_adminFinance');
        const adminFin = savedFin ? JSON.parse(savedFin) : { revenue: 0, cut: 0 };
        localStorage.setItem('vefa_adminFinance', JSON.stringify({
          revenue: Number(adminFin.revenue) + finalPrice,
          cut: Number(adminFin.cut) + (finalPrice * 0.2)
        }));
      }

      setIsAddingGrave(false);
      setGraveForm({ deceasedName: '', cemetery: '', selectedPackage: null });
      alert(graveForm.selectedPackage ? "Mezar eklendi ve bakım aboneliği başlatıldı!" : "Yeni mezar başarıyla eklendi.");
    } catch (error) {
      console.error("İşlem hatası:", error);
      alert("Bir hata oluştu.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleAutoRenew = async (orderId, currentStatus) => {
    try { await updateDoc(doc(db, 'orders', orderId), { autoRenew: !currentStatus }); } catch (error) { console.error(error); }
  };

  const handleCancelSubscription = async (orderId) => {
    if (window.confirm("Bu mezar için aboneliğinizi iptal etmek istediğinize emin misiniz?")) {
      try {
        await updateDoc(doc(db, 'orders', orderId), { status: 'cancelled', notes: 'Müşteri tarafından iptal edildi.' });
        alert("Aboneliğiniz başarıyla iptal edildi.");
      } catch (error) { console.error(error); }
    }
  };

  const handleSubmitReview = async (orderId) => {
    if (ratingData.stars === 0) return alert("Lütfen yıldız seçin.");
    setIsSubmittingReview(true);
    try {
      await updateDoc(doc(db, 'orders', orderId), { rating: ratingData.stars, reviewComment: ratingData.comment, reviewedAt: new Date().toISOString() });
      setReviewingId(null); setRatingData({ stars: 0, comment: '' });
    } catch (error) {} finally { setIsSubmittingReview(false); }
  };

  // YENİ: Google Maps Link Yönlendiricisi
  const openGoogleMaps = (cemeteryName) => {
    if (!cemeteryName || cemeteryName === "Henüz mezar kaydı yok") return;
    const query = encodeURIComponent(`${cemeteryName} Mezarlığı`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'Ü';
  const getProtoImageBefore = (orderId) => `https://via.placeholder.com/400x300/F8F6F0/134B36?text=${encodeURIComponent('Öncesi\n' + orderId)}`;
  const getProtoImageAfter = (orderId) => `https://via.placeholder.com/400x300/F8F6F0/C9A84C?text=${encodeURIComponent('Sonrası\n' + orderId)}`;

  return (
    <div className="min-h-screen bg-[#F8F6F0] pt-[120px] pb-20 font-sans relative z-20">
      <style>{`@media print { body * { visibility: hidden; } #printable-report, #printable-report * { visibility: visible; } #printable-report { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; } .print-hide { display: none !important; } }`}</style>

      {selectedReport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0d1a10]/80 backdrop-blur-md transition-all print-hide">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#e5e5e5] p-4 sm:p-8 rounded-2xl flex flex-col items-center shadow-2xl">
            <div className="w-full flex justify-end gap-4 mb-4 print-hide">
               <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#134B36] text-white px-6 py-2.5 rounded-xl font-bold"><Printer size={18} /> Yazdır</button>
               <button onClick={() => setSelectedReport(null)} className="p-2.5 bg-white text-red-500 rounded-xl"><X size={20} /></button>
            </div>
            <div id="printable-report" className="w-full bg-white p-10 sm:p-16 shadow-lg relative mx-auto" style={{ minHeight: '297mm', maxWidth: '210mm' }}>
               <div className="border-b-2 border-[#134B36] pb-8 mb-8 flex justify-between items-end">
                  <div><h2 className="text-4xl font-serif tracking-widest text-[#134B36] mb-1">VEFA</h2><p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Profesyonel Mezar Bakım Atölyesi</p></div>
                  <div className="text-right text-sm text-[#134B36]/70"><p className="font-bold uppercase tracking-widest text-[#1a1c19]">HİZMET RAPORU</p><p className="mt-2">Tarih: {selectedReport.date}</p><p>Rapor No: {selectedReport.id}</p></div>
               </div>
               <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
                  <div className="p-5 bg-[#F8F6F0] border border-[#134B36]/10 rounded-xl"><p className="text-[10px] font-bold text-[#134B36]/50 uppercase tracking-widest mb-2">Müşteri</p><p className="font-bold text-[#1a1c19] text-base">{selectedReport.customer}</p></div>
                  <div className="p-5 bg-[#F8F6F0] border border-[#134B36]/10 rounded-xl"><p className="text-[10px] font-bold text-[#134B36]/50 uppercase tracking-widest mb-2">Hizmet</p><p className="font-bold text-[#1a1c19] text-base">{selectedReport.package}</p><p className="text-[#134B36]/80 mt-1">{selectedReport.deceasedName}</p></div>
               </div>
               <div className="mb-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-100 rounded-xl overflow-hidden relative"><img src={selectedReport.beforeImg || getProtoImageBefore(selectedReport.id)} alt="Öncesi" className="w-full h-full object-cover" /><span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Öncesi</span></div>
                    <div className="h-64 bg-gray-100 rounded-xl overflow-hidden relative"><img src={selectedReport.afterImg || getProtoImageAfter(selectedReport.id)} alt="Sonrası" className="w-full h-full object-cover" /><span className="absolute top-3 left-3 bg-[#134B36] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Sonrası</span></div>
                  </div>
               </div>
               <div className="absolute bottom-0 left-0 w-full h-2 bg-[#C9A84C]"></div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-80 md:sticky md:top-[120px] md:h-[calc(100vh-160px)] shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] border border-[#134B36]/10 shadow-lg p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-20 h-20 bg-gradient-to-br from-[#134B36] to-[#0B2E21] rounded-full flex items-center justify-center mb-4 shadow-md relative z-10 border-4 border-white">
              <span className="text-2xl font-serif text-[#C9A84C]">{getInitials(user?.displayName)}</span>
            </div>
            <h2 className="text-xl font-serif text-[#1a1c19] relative z-10">{user?.displayName || 'Değerli Üyemiz'}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C9A84C]/10 rounded-full mt-2 border border-[#C9A84C]/20 relative z-10">
               <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span><p className="text-[10px] font-bold text-[#8B6914] tracking-widest uppercase">Premium Üye</p>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] border border-[#134B36]/10 shadow-lg p-4 flex-1 flex flex-col justify-between">
            <nav className="space-y-2">
              <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all w-full text-left font-medium ${activeTab === 'overview' ? 'bg-[#134B36] text-[#f8f6f0] shadow-md' : 'hover:bg-[#134B36]/5 text-[#134B36]/80'}`}><LayoutDashboard size={18} /> Abonelik Özeti</button>
              <button onClick={() => setActiveTab('gallery')} className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all w-full text-left font-medium ${activeTab === 'gallery' ? 'bg-[#134B36] text-[#f8f6f0] shadow-md' : 'hover:bg-[#134B36]/5 text-[#134B36]/80'}`}>
                <ImageIcon size={18} /> Bakım Raporları {completedHistory.length > 0 && <span className="ml-auto bg-[#C9A84C] text-[#0d1a10] text-[10px] px-2 py-0.5 rounded-full">{completedHistory.length}</span>}
              </button>
              <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all w-full text-left font-medium ${activeTab === 'profile' ? 'bg-[#134B36] text-[#f8f6f0] shadow-md' : 'hover:bg-[#134B36]/5 text-[#134B36]/80'}`}><User size={18} /> Profil & Abonelik</button>
            </nav>
            <button onClick={() => window.location.href = '/'} className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl w-full bg-[#f8f6f0] text-[#134B36] hover:bg-[#134B36]/10 font-bold transition-all mt-4 border border-[#134B36]/20">
               <Home size={18} /> Ana Sayfaya Dön
            </button>
          </div>
        </aside>

        <main className="flex-1 w-full max-w-4xl print-hide">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-[#134B36]">
              {activeTab === 'overview' && 'Abonelik Özeti'}
              {activeTab === 'gallery' && 'Bakım Raporları & Fotoğraflar'}
              {activeTab === 'profile' && 'Profil & Abonelik Yönetimi'}
            </h1>
          </header>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#134B36] to-[#0d1a10] rounded-[2.5rem] p-8 md:p-12 text-[#f8f6f0] shadow-2xl relative overflow-hidden">
                 <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                   <div className="flex-1">
                     <div className="inline-block border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 rounded-full mb-4"><p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Güncel Mezar Bilgisi</p></div>
                     <h3 className="text-3xl md:text-4xl font-serif mb-2 text-white">{displayDeceased}</h3>
                     <div className="flex items-center gap-3 mt-4">
                       <p className="opacity-80 flex items-center gap-2 text-sm text-[#e8e6df]"><MapPin size={16} className="text-[#C9A84C]"/> {displayCemetery}</p>
                       <button onClick={() => openGoogleMaps(displayCemetery)} className="text-[10px] font-bold bg-[#C9A84C]/20 text-[#C9A84C] px-3 py-1 rounded-full hover:bg-[#C9A84C] hover:text-[#0d1a10] transition-colors flex items-center gap-1">
                         <Navigation size={12} /> Haritada Gör
                       </button>
                     </div>
                   </div>
                   <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shrink-0 flex flex-col justify-center">
                     <p className="text-xs uppercase tracking-wider text-white/50 mb-2 font-bold flex items-center gap-2"><Clock size={14}/> Sistem Durumu</p>
                     <p className="text-xl font-bold text-[#C9A84C]">{activeOrders.length > 0 ? `${activeOrders.length} Aktif Abonelik` : 'Abonelik Yok'}</p>
                   </div>
                 </div>
              </div>

              {latestOrder && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-[#134B36]/10 shadow-sm mt-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-serif text-[#134B36]">Sipariş Durumu</h3>
                    <span className="text-xs font-bold text-[#134B36]/60 bg-[#F8F6F0] px-3 py-1 rounded-full">{latestOrder.deceasedName}</span>
                  </div>
                  <div className="relative">
                    <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 rounded-full z-0 hidden md:block"></div>
                    <div className="absolute top-6 left-6 h-1 bg-[#C9A84C] rounded-full z-0 hidden md:block transition-all duration-1000 ease-in-out" style={{ width: latestOrder.status === 'pending' ? '0%' : latestOrder.status === 'in-progress' ? '50%' : '100%' }}></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md mb-3 transition-colors ${latestOrder.status === 'pending' || latestOrder.status === 'in-progress' ? 'bg-[#C9A84C] text-[#0d1a10]' : 'bg-gray-200 text-gray-500'}`}><CheckSquare size={20} /></div>
                        <h4 className={`text-sm font-bold ${latestOrder.status === 'pending' || latestOrder.status === 'in-progress' ? 'text-[#134B36]' : 'text-gray-400'}`}>Sipariş Alındı</h4>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md mb-3 transition-colors ${latestOrder.status === 'in-progress' ? 'bg-[#C9A84C] text-[#0d1a10]' : 'bg-gray-200 text-gray-500'}`}><Briefcase size={20} /></div>
                        <h4 className={`text-sm font-bold ${latestOrder.status === 'in-progress' ? 'text-[#134B36]' : 'text-gray-400'}`}>Esnaf Sahada</h4>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md mb-3 bg-gray-200 text-gray-500 transition-colors"><Camera size={20} /></div>
                        <h4 className="text-sm font-bold text-gray-400">Rapor Bekleniyor</h4>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
             <div className="space-y-8">
             {completedHistory.length === 0 ? <p className="text-[#134B36]/60">Henüz tamamlanmış bir bakım raporu yok.</p> : completedHistory.map((record) => (
                 <div key={record.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-[#134B36]/10 shadow-lg transition-transform hover:-translate-y-1 duration-300 flex flex-col">
                   <div className="p-6 md:p-8 border-b border-[#134B36]/5 flex justify-between items-center bg-gradient-to-r from-white to-[#f8f6f0]">
                     <div>
                       <h3 className="font-serif text-[#134B36] text-2xl flex items-center gap-2"><CheckCircle size={22} className="text-green-600" /> Tamamlandı</h3>
                       <p className="text-xs font-bold text-[#134B36]/50 uppercase tracking-widest mt-2">{record.deceasedName} • {record.date}</p>
                     </div>
                     <button onClick={() => setSelectedReport(record)} className="bg-[#134B36] text-white text-sm font-bold px-5 py-3 rounded-full flex items-center gap-2 hover:bg-[#0B2E21] hover:shadow-md transition-all"><FileText size={16}/> Raporu Görüntüle</button>
                   </div>
                   
                   <div className="p-6 md:p-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="relative rounded-3xl overflow-hidden border border-[#134B36]/10 shadow-inner group"><img src={record.beforeImg || getProtoImageBefore(record.id)} alt="Öncesi" className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" /><div className="absolute top-4 left-4 bg-white/40 backdrop-blur-md text-[#1a1c19] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">Öncesi</div></div>
                       <div className="relative rounded-3xl overflow-hidden border-2 border-[#C9A84C]/40 shadow-[0_10px_30px_rgba(201,168,76,0.15)] group"><img src={record.afterImg || getProtoImageAfter(record.id)} alt="Sonrası" className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" /><div className="absolute top-4 left-4 bg-[#C9A84C] text-[#0d1a10] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Sonrası</div></div>
                     </div>
                   </div>

                   <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                     <div className="border-t border-[#134B36]/10 pt-6 mt-2">
                       {record.rating ? (
                         <div className="flex flex-col md:flex-row md:items-center gap-4 bg-[#F8F6F0] p-5 rounded-2xl border border-[#134B36]/5">
                           <div className="flex gap-1">{[1,2,3,4,5].map(star => (<Star key={star} size={20} className={star <= record.rating ? "text-[#C9A84C] fill-[#C9A84C]" : "text-gray-300"} />))}</div>
                           <p className="text-sm text-[#134B36]/80 italic">"{record.reviewComment || 'Değerlendirme için teşekkür ederiz.'}"</p>
                         </div>
                       ) : reviewingId === record.id ? (
                         <div className="bg-[#F8F6F0] p-6 rounded-2xl border border-[#134B36]/10 animate-in fade-in zoom-in-95 duration-300">
                           <p className="text-sm font-bold text-[#134B36] mb-3 uppercase tracking-widest">Hizmetimizi Değerlendirin</p>
                           <div className="flex gap-2 mb-4">
                             {[1,2,3,4,5].map(star => (
                               <button key={star} onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)} onClick={() => setRatingData({...ratingData, stars: star})} className="transition-transform hover:scale-110"><Star size={32} className={`transition-all ${star <= (hoveredStar || ratingData.stars) ? "text-[#C9A84C] fill-[#C9A84C]" : "text-gray-300"}`} /></button>
                             ))}
                           </div>
                           <textarea placeholder="Ekibimize bir not bırakmak ister misiniz? (İsteğe bağlı)" className="w-full p-4 text-sm rounded-xl border border-[#134B36]/10 outline-none focus:border-[#C9A84C] bg-white resize-none mb-4 shadow-sm" rows="2" value={ratingData.comment} onChange={(e) => setRatingData({...ratingData, comment: e.target.value})} />
                           <div className="flex gap-3">
                             <button onClick={() => handleSubmitReview(record.id)} disabled={isSubmittingReview} className="bg-[#134B36] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#0B2E21] transition-all shadow-md disabled:opacity-70">{isSubmittingReview ? 'Gönderiliyor...' : 'Gönder'}</button>
                             <button onClick={() => {setReviewingId(null); setRatingData({stars:0, comment:''})}} className="px-6 py-3 text-[#134B36]/60 text-sm font-bold hover:bg-[#134B36]/10 rounded-xl transition-all">İptal</button>
                           </div>
                         </div>
                       ) : (
                         <button onClick={() => setReviewingId(record.id)} className="flex items-center gap-2 text-sm font-bold bg-white border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white px-6 py-3 rounded-xl transition-all shadow-sm"><Star size={18} /> Hizmeti Değerlendir</button>
                       )}
                     </div>
                   </div>
                 </div>
               ))
             }
           </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8">
              
              <div className="bg-white rounded-[2.5rem] p-8 border border-[#134B36]/10 shadow-sm relative">
                {!isEditingProfile ? (
                  <button onClick={() => setIsEditingProfile(true)} className="absolute top-8 right-8 text-[#134B36]/40 hover:text-[#C9A84C] transition-colors"><Edit2 size={20} /></button>
                ) : (
                  <button onClick={handleSaveProfile} className="absolute top-8 right-8 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors"><Save size={16}/> Kaydet</button>
                )}
                <h3 className="text-xl font-serif text-[#134B36] mb-6">İletişim Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-[#134B36]/50 uppercase tracking-wider mb-1">Ad Soyad</p>
                    {isEditingProfile ? <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full border border-[#134B36]/20 rounded-xl px-4 py-2 outline-none focus:border-[#C9A84C]" /> : <p className="text-[#1a1c19] font-medium">{user?.displayName || 'Belirtilmemiş'}</p>}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#134B36]/50 uppercase tracking-wider mb-1">Telefon</p>
                    {isEditingProfile ? <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} placeholder="05XX XXX XX XX" className="w-full border border-[#134B36]/20 rounded-xl px-4 py-2 outline-none focus:border-[#C9A84C]" /> : <p className="text-[#1a1c19] font-medium">{userData.phone || 'Kayıtlı Değil'}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-[#134B36]/10 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-serif text-[#134B36]">Kayıtlı Mezarlarım</h3>
                   <button onClick={() => setIsAddingGrave(!isAddingGrave)} className="flex items-center gap-2 text-xs font-bold bg-[#134B36]/5 text-[#134B36] px-4 py-2 rounded-full hover:bg-[#134B36]/10 transition-colors">
                     {isAddingGrave ? 'Vazgeç' : <><Plus size={14}/> Yeni Ekle</>}
                   </button>
                </div>

                {isAddingGrave && (
                  <div className="bg-[#F8F6F0] p-6 rounded-3xl border border-[#C9A84C]/30 mb-8 animate-in fade-in slide-in-from-top-4 shadow-inner">
                    <p className="text-sm font-bold text-[#134B36] mb-4">1. Mezar Bilgilerini Girin</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <input type="text" placeholder="Merhumun Adı Soyadı" value={graveForm.deceasedName} onChange={(e) => setGraveForm({...graveForm, deceasedName: e.target.value})} className="w-full p-4 rounded-xl border border-[#134B36]/10 outline-none focus:border-[#C9A84C] bg-white shadow-sm" />
                      <input type="text" placeholder="Mezarlık Adı / Konumu" value={graveForm.cemetery} onChange={(e) => setGraveForm({...graveForm, cemetery: e.target.value})} className="w-full p-4 rounded-xl border border-[#134B36]/10 outline-none focus:border-[#C9A84C] bg-white shadow-sm" />
                    </div>

                    <p className="text-sm font-bold text-[#134B36] mb-4 flex items-center gap-2"><ShoppingCart size={16}/> 2. İsteğe Bağlı: Bakım Paketi Seçin</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {compactPackages.map(pkg => (
                        <div key={pkg.id} onClick={() => setGraveForm({...graveForm, selectedPackage: pkg})} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${graveForm.selectedPackage?.id === pkg.id ? 'border-[#C9A84C] bg-white shadow-md' : 'border-gray-200 bg-white/50 hover:border-[#C9A84C]/50'}`}>
                          <h4 className="font-bold text-[#134B36] text-sm mb-1">{pkg.title}</h4>
                          <p className="text-[10px] text-[#134B36]/60 leading-tight mb-3 h-6">{pkg.desc}</p>
                          <p className="text-lg font-black text-[#1a1c19]">₺{pkg.price}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end border-t border-[#134B36]/10 pt-6">
                      <button onClick={handleAddGrave} disabled={isProcessing} className="bg-[#134B36] text-white px-8 py-4 rounded-xl text-sm font-bold hover:bg-[#0B2E21] transition-all shadow-lg hover:-translate-y-1 disabled:opacity-50 flex items-center gap-2">
                        {isProcessing ? 'İşleniyor...' : graveForm.selectedPackage ? 'Kaydet ve Aboneliği Başlat' : 'Sadece Mezarı Kaydet'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {userData.graves.length === 0 ? (
                    <p className="text-sm text-[#134B36]/50">Kayıtlı bir mezar profili bulunamadı.</p>
                  ) : (
                    userData.graves.map((grave, idx) => {
                      const graveActiveOrder = activeOrders.find(o => o.deceasedName === grave.deceasedName);
                      return (
                        <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${graveActiveOrder ? 'bg-[#F8F6F0] border-[#C9A84C]/30 shadow-sm' : 'bg-white border-[#134B36]/10'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`${graveActiveOrder ? 'bg-[#134B36]/10 text-[#134B36]' : 'bg-gray-100 text-gray-400'} p-3 rounded-full shrink-0`}>
                              <MapPin size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-[#1a1c19]">{grave.deceasedName}</p>
                              <p className="text-xs text-[#134B36]/60 mt-0.5">{grave.cemetery}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                            <button onClick={() => openGoogleMaps(grave.cemetery)} className="text-xs font-bold text-[#C9A84C] hover:text-[#134B36] flex items-center gap-1 transition-colors">
                              <Navigation size={14} /> Haritada Aç
                            </button>
                            {graveActiveOrder ? (
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap">
                                {graveActiveOrder.package} (Aktif)
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">Abonelik Yok</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-[#C9A84C]/30 shadow-sm">
                <h3 className="text-xl font-serif text-[#134B36] mb-6 flex items-center gap-2"><RefreshCw size={20} className="text-[#C9A84C]" /> Aktif Abonelikleriniz</h3>
                
                {activeOrders.length > 0 ? (
                  <div className="space-y-6">
                    {activeOrders.map(order => (
                      <div key={order.id} className="p-6 bg-[#F8F6F0] rounded-3xl border border-[#134B36]/5">
                        <div className="flex items-center justify-between mb-4 border-b border-[#134B36]/5 pb-4">
                          <div>
                            <p className="font-bold text-[#134B36] text-lg">{order.package}</p>
                            <p className="text-xs text-[#134B36]/70 mt-1">{order.deceasedName} • {order.cemetery}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-[#134B36]/50 uppercase tracking-widest">Tutar</p>
                            <p className="text-xl font-bold text-[#134B36]">₺{order.price.toLocaleString('tr-TR')}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div onClick={() => handleToggleAutoRenew(order.id, order.autoRenew !== false)} className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${order.autoRenew !== false ? 'bg-[#134B36]' : 'bg-gray-300'}`}>
                              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${order.autoRenew !== false ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#1a1c19]">Otomatik Yenileme</p>
                              <p className="text-[10px] text-[#134B36]/60">Süresi bitince otomatik uzatılır.</p>
                            </div>
                          </div>
                          <button onClick={() => handleCancelSubscription(order.id)} className="w-full sm:w-auto px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2 border border-red-100">
                            <Trash2 size={14} /> Aboneliği İptal Et
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#134B36]/60">Şu an aktif bir aboneliğiniz veya devam eden siparişiniz bulunmuyor.</p>
                )}
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;