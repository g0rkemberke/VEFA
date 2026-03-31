import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ClipboardList, Wallet, TrendingUp, CheckCircle, Clock, XCircle, LogOut, MessageSquare, MapPin, Users, Briefcase, Phone, Mail, Check, UserCheck, Eye, Star, Trash2, X, Camera, AlertCircle, CheckSquare, XSquare, Navigation } from 'lucide-react';
import { db } from '../firebase'; 
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'; 

const AdminDashboard = ({ onLogout, globalOrders = [], adminFinance, updateOrderStatus, cityDemands = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState([]); 
  const [inspectOrder, setInspectOrder] = useState(null);
  
  const activeOrdersCount = globalOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;

  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(collection(db, 'partner_applications'), (snapshot) => {
      const appsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      appsData.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setApplications(appsData);
    });
    return () => unsubscribe();
  }, []);

  const pendingApps = applications.filter(app => app.status === 'pending');
  const approvedPartners = applications.filter(app => app.status === 'approved');

  // Yorum Yönetimi
  const reviewedOrders = globalOrders.filter(o => o.reviewComment || (o.rating && o.rating > 0));

  const handleDeleteReview = async (orderId) => {
    if (!window.confirm("Bu yorumu ve puanı silmek istediğinize emin misiniz? Sipariş kaydı silinmeyecektir.")) return;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        reviewComment: "",
        rating: 0,
        isFeatured: false // Silinirse vitrinden de düşsün
      });
    } catch (error) {
      console.error("Yorum silme hatası:", error);
    }
  };

  // YENİ: Yorumu Ana Sayfaya (Vitrine) Ekleme/Kaldırma Fonksiyonu
  const handleToggleFeatureReview = async (orderId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        isFeatured: !currentStatus
      });
    } catch (error) {
      console.error("Vitrin güncelleme hatası:", error);
      alert("Durum güncellenemedi, lütfen tekrar deneyin.");
    }
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Bu siparişi iptal etmek istediğinize emin misiniz?")) {
      updateOrderStatus(orderId, 'cancelled', { notes: 'Sistem Yöneticisi tarafından iptal edildi.' });
      setInspectOrder(null);
    }
  };

  const handleApprovePartner = async (application) => {
    if (!window.confirm(`${application.name} isimli kişiyi onaylıyor musunuz?`)) return;
    try {
      await updateDoc(doc(db, 'partner_applications', application.id), { status: 'approved' });
    } catch (error) { console.error(error); }
  };

  const handleRejectPartner = async (appId) => {
    if (!window.confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) return;
    try { await deleteDoc(doc(db, 'partner_applications', appId)); } catch (error) { console.error(error); }
  };

  const handleRevokePartner = async (appId) => {
    if (!window.confirm("Yetkiyi iptal etmek istiyor musunuz?")) return;
    try { await updateDoc(doc(db, 'partner_applications', appId), { status: 'revoked' }); } catch (error) { console.error(error); }
  };

  const handleRejectPhotos = async (orderId) => {
    if (window.confirm("Fotoğrafları reddetmek istediğinize emin misiniz? Esnaf yeniden fotoğraf yüklemek zorunda kalacak.")) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          beforeUploaded: false,
          afterUploaded: false,
          beforeImgLocal: null,
          afterImgLocal: null,
          beforeImg: null,
          afterImg: null,
          notes: 'Sistem Yöneticisi fotoğrafları yetersiz buldu. Lütfen tekrar yükleyin.'
        });
        setInspectOrder(null);
      } catch (error) { console.error(error); }
    }
  };

  const openGoogleMaps = (cemeteryName) => {
    const query = encodeURIComponent(`${cemeteryName} Mezarlığı`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col md:flex-row font-sans relative">
      
      {/* İNCELEME MODALI (DETAY PENCERESİ) */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1a10]/60 backdrop-blur-sm transition-all">
          <div className="bg-[#f8f6f0] rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-[#C9A84C]/20 animate-in zoom-in-95 duration-300 no-scrollbar">
            
            <div className="sticky top-0 bg-[#f8f6f0]/95 backdrop-blur-md px-8 py-6 border-b border-[#134B36]/10 flex justify-between items-center z-10 shadow-sm">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C] block mb-1">Sipariş İncelemesi</span>
                <h3 className="text-2xl font-serif text-[#134B36] flex items-center gap-3">
                  Detay Ekranı <span className="text-sm font-sans font-bold opacity-40 bg-[#134B36]/10 px-3 py-1 rounded-full">#{inspectOrder.id}</span>
                </h3>
              </div>
              <button onClick={() => setInspectOrder(null)} className="p-3 bg-white rounded-full text-[#134B36]/50 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                <X size={24}/>
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-[#134B36]/10 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#134B36]/50 mb-4">Müşteri & Konum Bilgisi</h4>
                  <p className="font-bold text-xl text-[#1a1c19] mb-4">{inspectOrder.customer}</p>
                  <div className="flex items-center justify-between bg-[#F8F6F0] p-4 rounded-xl border border-[#134B36]/5">
                    <p className="flex items-center gap-3 text-[#134B36] font-medium"><MapPin size={18} className="text-[#C9A84C]"/> {inspectOrder.cemetery}</p>
                    <button onClick={() => openGoogleMaps(inspectOrder.cemetery)} className="text-[#C9A84C] hover:text-[#134B36] transition-colors"><Navigation size={18} /></button>
                  </div>
                  <p className="text-sm text-[#134B36]/60 mt-4 leading-relaxed"><strong>Talep:</strong> {inspectOrder.graveDetails}</p>
                </div>

                <div className="bg-[#134B36] p-8 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Finansal Değer</h4>
                    <p className="font-serif text-2xl text-white mb-6">{inspectOrder.package}</p>
                  </div>
                  <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-6 mt-auto">
                    <p className="text-sm text-white/70 font-medium">Toplam Tutar</p>
                    <p className="text-4xl font-black text-[#C9A84C]">₺{inspectOrder.price.toLocaleString('tr-TR')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#134B36]/50 mb-4 pl-2">Saha Fotoğrafları</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-3 rounded-[2rem] border-2 border-dashed border-[#134B36]/20 h-80 relative overflow-hidden group">
                    {(inspectOrder.beforeImg || inspectOrder.beforeImgLocal) ? (
                      <img src={inspectOrder.beforeImg || inspectOrder.beforeImgLocal} alt="Öncesi" className="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full opacity-30 text-[#134B36]">
                        <Camera size={48} className="mb-3" />
                        <p className="font-bold uppercase tracking-widest text-xs">Öncesi Fotoğrafı Yok</p>
                      </div>
                    )}
                    <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">Öncesi</div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-[2rem] border-2 border-[#C9A84C]/40 h-80 relative overflow-hidden group shadow-lg shadow-[#C9A84C]/5">
                    {(inspectOrder.afterImg || inspectOrder.afterImgLocal) ? (
                      <img src={inspectOrder.afterImg || inspectOrder.afterImgLocal} alt="Sonrası" className="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full opacity-30 text-[#134B36]">
                        <Camera size={48} className="mb-3" />
                        <p className="font-bold uppercase tracking-widest text-xs">Sonrası Fotoğrafı Yok</p>
                      </div>
                    )}
                    <div className="absolute top-6 left-6 bg-[#C9A84C] text-[#0d1a10] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-md">Sonrası</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-[#134B36]/10">
                <button onClick={() => handleRejectPhotos(inspectOrder.id)} className="px-8 py-4 bg-orange-50 border border-orange-200 text-orange-600 font-bold rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
                  <XSquare size={18} /> Fotoğrafları Reddet
                </button>
                <button onClick={() => handleCancelOrder(inspectOrder.id)} className="px-8 py-4 bg-red-50 border border-red-200 text-red-600 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
                  <Trash2 size={18} /> Siparişi İptal Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOL MENÜ (SİDEBAR) */}
      <aside className="w-full md:w-72 bg-[#0d1a10] text-[#f8f6f0] flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.2)] z-20 shrink-0">
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif tracking-widest text-[#C9A84C] font-bold">VEFA</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mt-1">Yönetici Paneli</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-hidden no-scrollbar">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'overview' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.2)]' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}>
            <LayoutDashboard size={20} /> Genel Bakış
          </button>
          <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'orders' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.2)]' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}>
            <ClipboardList size={20} /> Siparişler 
            {activeOrdersCount > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold">{activeOrdersCount}</span>}
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'reviews' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.2)]' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}>
            <MessageSquare size={20} /> Yorumlar 
            {reviewedOrders.length > 0 && <span className="ml-auto bg-green-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold">{reviewedOrders.length}</span>}
          </button>
          <button onClick={() => setActiveTab('applications')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'applications' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.2)]' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}>
            <Users size={20} /> Başvurular 
            {pendingApps.length > 0 && <span className="ml-auto bg-blue-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold">{pendingApps.length}</span>}
          </button>
          <button onClick={() => setActiveTab('partners')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'partners' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.2)]' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}>
            <UserCheck size={20} /> Saha Ekibi
          </button>
          <button onClick={() => setActiveTab('demands')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'demands' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.2)]' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}>
            <AlertCircle size={20} /> Şehir Talepleri
          </button>
          <button onClick={() => setActiveTab('finances')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'finances' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.2)]' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}>
            <Wallet size={20} /> Finansal Durum
          </button>
        </nav>
        <div className="p-6 border-t border-white/10 hidden md:block">
          <button onClick={onLogout} className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl w-full hover:bg-red-500/20 text-red-400 transition-all font-bold">
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full">
        <header className="mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-serif text-[#134B36] tracking-tight">
            {activeTab === 'overview' && 'Sistem Özeti'}
            {activeTab === 'orders' && 'Tüm Siparişler'}
            {activeTab === 'reviews' && 'Yorum Yönetimi'}
            {activeTab === 'applications' && 'Saha Ekibi Başvuruları'}
            {activeTab === 'partners' && 'Aktif Saha Ekibi'}
            {activeTab === 'demands' && 'Şehir Genişleme Talepleri'}
            {activeTab === 'finances' && 'Finansal Raporlar'}
          </h1>
          <p className="text-sm md:text-base text-[#134B36]/60 mt-2 font-medium">
            Tüm platform verilerini, finansal akışı ve saha operasyonlarını buradan yönetin.
          </p>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-[#134B36]/10 shadow-[0_10px_40px_rgba(19,75,54,0.04)] flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><TrendingUp size={24} /></div>
                <p className="text-xs font-black text-[#134B36]/50 uppercase tracking-widest">Sistemdeki Toplam Ciro</p>
              </div>
              <p className="text-4xl font-black text-[#134B36]">₺{(adminFinance?.revenue || 0).toLocaleString('tr-TR')}</p>
            </div>
            
            <div className="bg-[#134B36] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#C9A84C]/20 text-[#C9A84C] rounded-full"><Wallet size={24} /></div>
                <p className="text-xs font-black text-white/50 uppercase tracking-widest">Vefa Net Komisyon Karı</p>
              </div>
              <p className="relative z-10 text-5xl font-black text-[#C9A84C]">₺{(adminFinance?.cut || 0).toLocaleString('tr-TR')}</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-[#134B36]/10 shadow-[0_10px_40px_rgba(19,75,54,0.04)] flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-full"><ClipboardList size={24} /></div>
                <p className="text-xs font-black text-[#134B36]/50 uppercase tracking-widest">Bekleyen İşlemler</p>
              </div>
              <div>
                <p className="text-4xl font-black text-[#134B36]">{activeOrdersCount}</p>
                <p className="text-xs text-[#134B36]/50 mt-1 font-medium">Sipariş atama veya onay bekliyor</p>
              </div>
            </div>
          </div>
        )}

        {/* Sipariş Tablosu (Hem Overview hem Orders tabında çıkar) */}
        {(activeTab === 'overview' || activeTab === 'orders') && (
          <div className="bg-white rounded-[2.5rem] border border-[#134B36]/10 shadow-[0_10px_40px_rgba(19,75,54,0.03)] overflow-hidden mt-10">
            <div className="p-6 md:p-8 border-b border-[#134B36]/5 flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#134B36] font-bold">Son Sipariş Hareketleri</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#F8F6F0] text-[10px] uppercase tracking-[0.2em] text-[#134B36]/50 font-black">
                    <th className="p-6">Sipariş ID</th>
                    <th className="p-6">Müşteri</th>
                    <th className="p-6">Paket & Mezar</th>
                    <th className="p-6">Tutar</th>
                    <th className="p-6">Durum</th>
                    <th className="p-6 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {globalOrders.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-[#134B36]/40 italic">Henüz sistemde sipariş bulunmuyor.</td></tr>
                  ) : globalOrders.map((order, idx) => (
                    <tr key={idx} className="border-b border-[#134B36]/5 hover:bg-[#f8f6f0]/50 transition-colors group">
                      <td className="p-6 font-bold text-[#134B36]">#{order.id}</td>
                      <td className="p-6 text-[#1a1c19]">{order.customer}</td>
                      <td className="p-6">
                        <p className="text-[#134B36] font-bold">{order.package}</p>
                        <p className="text-xs text-[#134B36]/50 mt-0.5">{order.cemetery}</p>
                      </td>
                      <td className="p-6 font-black text-[#134B36]">₺{order.price.toLocaleString('tr-TR')}</td>
                      <td className="p-6">
                        <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full 
                          ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                            order.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                            order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            'bg-red-100 text-red-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button onClick={() => setInspectOrder(order)} className="p-3 bg-white border border-[#134B36]/10 text-[#134B36] rounded-xl hover:bg-[#134B36] hover:text-white transition-all shadow-sm">
                          <Eye size={18}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GÜNCELLENEN YORUMLAR SEKMESİ */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviewedOrders.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white border border-dashed border-[#134B36]/20 rounded-[2.5rem]">
                <MessageSquare size={40} className="mx-auto text-[#134B36]/20 mb-3" />
                <p className="text-[#134B36]/50 font-medium">Henüz değerlendirilmiş bir sipariş bulunmuyor.</p>
              </div>
            ) : reviewedOrders.map(order => (
              <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-[#134B36]/10 shadow-[0_10px_40px_rgba(19,75,54,0.03)] flex flex-col justify-between transition-all">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-1.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} className={i < order.rating ? "text-[#C9A84C] fill-[#C9A84C]" : "text-gray-200"} />)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-[#F8F6F0] text-[#134B36]/50 px-3 py-1 rounded-full">#{order.id}</span>
                  </div>
                  <p className="text-base text-[#1a1c19] italic leading-relaxed mb-6 font-medium">"{order.reviewComment || 'Yorum bırakılmadı, sadece puan verildi.'}"</p>
                </div>
                <div className="flex items-center justify-between border-t border-[#134B36]/5 pt-6 mt-auto">
                  <div>
                    <p className="text-sm font-bold text-[#134B36]">{order.customer}</p>
                    <p className="text-xs text-[#134B36]/50 font-medium mt-0.5">{order.cemetery}</p>
                  </div>
                  <div className="flex gap-2">
                    
                    {/* YENİ: VİTRİNE EKLE BUTONU */}
                    <button 
                      onClick={() => handleToggleFeatureReview(order.id, order.isFeatured)} 
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                        order.isFeatured 
                          ? 'bg-[#C9A84C] text-[#0d1a10] hover:bg-red-50 hover:text-red-500' // Vitrindeyse, basınca kalkacağını belli et
                          : 'bg-green-50 text-green-600 hover:bg-[#C9A84C] hover:text-[#0d1a10]'
                      }`}
                      title={order.isFeatured ? "Ana Sayfadan Kaldır" : "Ana Sayfaya Ekle"}
                    >
                      {order.isFeatured ? <Star className="fill-[#0d1a10]" size={14} /> : <Star size={14} />}
                      {order.isFeatured ? 'Vitrinde' : 'Vitrine Ekle'}
                    </button>

                    <button onClick={() => handleDeleteReview(order.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Tamamen Sil">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {pendingApps.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white border border-dashed border-[#134B36]/20 rounded-[2.5rem]">
                <Users size={40} className="mx-auto text-[#134B36]/20 mb-3" />
                <p className="text-[#134B36]/50 font-medium">Şu an onay bekleyen bir başvuru bulunmuyor.</p>
              </div>
            ) : pendingApps.map(app => (
              <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border border-[#134B36]/10 shadow-[0_10px_40px_rgba(19,75,54,0.03)] hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#134B36]/10 rounded-full flex items-center justify-center text-[#134B36] font-bold text-xl">{app.name.charAt(0)}</div>
                  <div>
                    <h4 className="text-xl font-serif text-[#134B36] font-bold">{app.name}</h4>
                    <span className="text-[9px] uppercase tracking-widest bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-black mt-1 inline-block">Yeni Başvuru</span>
                  </div>
                </div>
                <div className="text-sm space-y-3 font-medium text-[#1a1c19]/70 mb-8 p-5 bg-[#F8F6F0] rounded-2xl">
                  <p className="flex items-center gap-3"><MapPin size={16} className="text-[#C9A84C]" /> {app.city}</p>
                  <p className="flex items-center gap-3"><Phone size={16} className="text-[#C9A84C]" /> {app.phone}</p>
                  <p className="flex items-center gap-3"><Mail size={16} className="text-[#C9A84C]" /> {app.email}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleApprovePartner(app)} className="flex-1 bg-[#134B36] text-[#f8f6f0] py-4 rounded-[1.2rem] text-xs font-bold uppercase tracking-widest hover:bg-[#0B2E21] transition-all shadow-md"><Check size={18} className="inline mr-1 mb-0.5" /> Onayla</button>
                  <button onClick={() => handleRejectPartner(app.id)} className="flex-1 bg-white border border-red-200 text-red-500 py-4 rounded-[1.2rem] text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all">Reddet</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {approvedPartners.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white border border-dashed border-[#134B36]/20 rounded-[2.5rem]">
                <UserCheck size={40} className="mx-auto text-[#134B36]/20 mb-3" />
                <p className="text-[#134B36]/50 font-medium">Sistemde henüz onaylanmış bir saha çalışanı yok.</p>
              </div>
            ) : approvedPartners.map(partner => (
              <div key={partner.id} className="bg-white p-8 rounded-[2.5rem] border border-green-500/20 shadow-[0_10px_40px_rgba(19,75,54,0.03)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-[#134B36] text-[#C9A84C] rounded-full flex items-center justify-center font-bold text-xl">{partner.name.charAt(0)}</div>
                    <div>
                      <h4 className="font-bold text-lg text-[#134B36]">{partner.name}</h4>
                      <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-0.5"><CheckCircle size={12}/> Aktif Personel</p>
                    </div>
                  </div>
                  <div className="text-sm space-y-2 font-medium text-[#1a1c19]/70 mb-8 border-t border-[#134B36]/5 pt-6">
                    <p><span className="text-xs font-bold opacity-50 block mb-0.5">Bölge</span>{partner.city}</p>
                    <p><span className="text-xs font-bold opacity-50 block mb-0.5">İletişim</span>{partner.phone}</p>
                  </div>
                </div>
                <button onClick={() => handleRevokePartner(partner.id)} className="w-full py-4 border border-red-200 text-red-500 rounded-[1.2rem] text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all">Sistem Yetkisini İptal Et</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'demands' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cityDemands.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white border border-dashed border-[#134B36]/20 rounded-[2.5rem]">
                <MapPin size={40} className="mx-auto text-[#134B36]/20 mb-3" />
                <p className="text-[#134B36]/50 font-medium">Henüz yeni bir şehir talebi alınmadı.</p>
              </div>
            ) : cityDemands.map(demand => (
              <div key={demand.id} className="bg-white p-8 rounded-[2.5rem] border border-[#134B36]/10 shadow-[0_10px_40px_rgba(19,75,54,0.03)] relative overflow-hidden group hover:border-[#C9A84C]/50 transition-colors">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><MapPin size={100} /></div>
                <h4 className="text-3xl font-serif text-[#134B36] mb-2">{demand.city}</h4>
                <p className="text-sm font-medium text-[#1a1c19]/60 mb-6 relative z-10">{demand.email}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#134B36]/30 bg-[#F8F6F0] inline-block px-3 py-1.5 rounded-full">{demand.date}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="max-w-4xl bg-white p-8 md:p-12 rounded-[2.5rem] border border-[#134B36]/10 shadow-[0_10px_40px_rgba(19,75,54,0.03)]">
            <h3 className="text-2xl font-serif text-[#134B36] mb-8">Finansal Rapor Özeti</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-[#F8F6F0] rounded-[1.5rem]">
                <div>
                  <p className="text-sm font-bold text-[#134B36]/60 uppercase tracking-widest mb-1">Havuzdaki Toplam Para</p>
                  <p className="text-xs text-[#1a1c19]/50 font-medium">Sistemden geçen tüm siparişlerin toplam hacmi</p>
                </div>
                <p className="text-3xl font-black text-[#134B36]">₺{(adminFinance?.revenue || 0).toLocaleString('tr-TR')}</p>
              </div>
              <div className="flex items-center justify-between p-6 bg-[#134B36] text-white rounded-[1.5rem] shadow-lg">
                <div>
                  <p className="text-sm font-bold text-[#C9A84C] uppercase tracking-widest mb-1">Vefa Komisyon Geliri</p>
                  <p className="text-xs text-white/50 font-medium">Esnaf hakedişleri dağıtıldıktan sonra kalan %20'lik net kar</p>
                </div>
                <p className="text-3xl font-black text-[#C9A84C]">₺{(adminFinance?.cut || 0).toLocaleString('tr-TR')}</p>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-[#134B36]/10 flex justify-end">
              <button className="px-8 py-4 bg-[#f8f6f0] text-[#134B36] rounded-[1.2rem] font-bold uppercase tracking-widest text-sm hover:bg-[#134B36] hover:text-white transition-all shadow-sm">
                Detaylı Excel Raporu İndir
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;