import React, { useState, useRef } from 'react';
import { MapPin, Clock, Camera, CheckCircle, Wallet, ListTodo, LogOut, UploadCloud, ChevronRight, Briefcase, User, Building, Loader2, Navigation, ArrowUpRight, CheckSquare } from 'lucide-react';

const PartnerDashboard = ({ onLogout, globalOrders = [], updateOrderStatus, partnerBalance = 0 }) => {
  const [activeTab, setActiveTab] = useState('pool'); 
  const poolOrders = globalOrders.filter(o => o.status === 'pending');
  const activeOrders = globalOrders.filter(o => o.status === 'in-progress');
  const completedOrders = globalOrders.filter(o => o.status === 'completed');

  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);
  const [uploadingOrderId, setUploadingOrderId] = useState(null);
  const [isUploading, setIsUploading] = useState({ orderId: null, type: null });

  // YENİ: IBAN state'i ve formatlayıcı fonksiyon
  const [iban, setIban] = useState('TR');
  
  const handleIbanChange = (e) => {
    // Sadece harf ve rakamları al
    let rawValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Kullanıcının "TR" kısmını silmesini engelle
    if (!rawValue.startsWith('TR')) {
      rawValue = 'TR' + rawValue.replace(/^TR/, '');
    }
    
    // TR + 24 Rakam = 26 Karakter sınırı
    if (rawValue.length > 26) {
      rawValue = rawValue.slice(0, 26);
    }
    
    // 4'erli gruplara bölerek boşluk ekle (Banka stili)
    const formattedValue = rawValue.match(/.{1,4}/g)?.join(' ') || rawValue;
    setIban(formattedValue);
  };

  const handleAcceptOrder = (order) => { 
    updateOrderStatus(order.id, 'in-progress', { beforeUploaded: false, afterUploaded: false, beforeImgLocal: null, afterImgLocal: null }); 
    setActiveTab('active'); 
  };

  const triggerFileInput = (orderId, type) => {
    setUploadingOrderId(orderId);
    if (type === 'before' && beforeInputRef.current) beforeInputRef.current.click();
    if (type === 'after' && afterInputRef.current) afterInputRef.current.click();
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file || !uploadingOrderId) return;

    setIsUploading({ orderId: uploadingOrderId, type });

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result; 
      try {
        await updateOrderStatus(uploadingOrderId, 'in-progress', { 
          [type === 'before' ? 'beforeUploaded' : 'afterUploaded']: true,
          [type === 'before' ? 'beforeImgLocal' : 'afterImgLocal']: base64String 
        });
      } catch (error) {
        console.error("Yükleme hatası:", error);
        alert("Fotoğraf yüklenemedi.");
      } finally {
        setIsUploading({ orderId: null, type: null });
        e.target.value = null; 
      }
    };
    reader.readAsDataURL(file); 
  };

  const handleCompleteOrder = (order) => {
    updateOrderStatus(order.id, 'completed', {
      price: order.price, 
      beforeImg: order.beforeImgLocal,
      afterImg: order.afterImgLocal,
      notes: `${order.graveDetails} bakımı profesyonel şekilde yapıldı, temizlik sağlandı.`
    });
    setActiveTab('completed');
  };

  const openGoogleMaps = (cemeteryName) => {
    const query = encodeURIComponent(`${cemeteryName} Mezarlığı`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col md:flex-row font-sans">
      
      <input type="file" accept="image/*" capture="environment" ref={beforeInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'before')} />
      <input type="file" accept="image/*" capture="environment" ref={afterInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'after')} />

      {/* SOL MENÜ */}
      <aside className="w-full md:w-72 bg-[#134B36] text-[#f8f6f0] flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.1)] z-20 shrink-0">
        <div className="p-8 flex items-center justify-between border-b border-[#f8f6f0]/10">
          <div>
            <h2 className="text-2xl font-serif tracking-widest text-[#C9A84C] font-bold">VEFA</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">Saha Ekibi Portalı</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-3 flex flex-row md:flex-col overflow-x-auto md:overflow-hidden no-scrollbar">
          <button onClick={() => setActiveTab('pool')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'pool' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.3)]' : 'hover:bg-[#f8f6f0]/10 opacity-70 hover:opacity-100'}`}>
            <ListTodo size={20} /> İş Havuzu 
            {poolOrders.length > 0 && <span className="ml-auto bg-[#0d1a10] text-[#C9A84C] text-[10px] px-2.5 py-1 rounded-full font-bold">{poolOrders.length}</span>}
          </button>
          <button onClick={() => setActiveTab('active')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'active' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.3)]' : 'hover:bg-[#f8f6f0]/10 opacity-70 hover:opacity-100'}`}>
            <Briefcase size={20} /> Aktif Görevler 
            {activeOrders.length > 0 && <span className="ml-auto bg-blue-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold">{activeOrders.length}</span>}
          </button>
          <button onClick={() => setActiveTab('completed')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'completed' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.3)]' : 'hover:bg-[#f8f6f0]/10 opacity-70 hover:opacity-100'}`}>
            <CheckSquare size={20} /> Tamamlananlar
          </button>
          <button onClick={() => setActiveTab('wallet')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'wallet' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.3)]' : 'hover:bg-[#f8f6f0]/10 opacity-70 hover:opacity-100'}`}>
            <Wallet size={20} /> Cüzdanım
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal w-full font-medium ${activeTab === 'profile' ? 'bg-[#C9A84C] text-[#0d1a10] shadow-[0_8px_20px_rgba(201,168,76,0.3)]' : 'hover:bg-[#f8f6f0]/10 opacity-70 hover:opacity-100'}`}>
            <User size={20} /> Profil & IBAN
          </button>
        </nav>
        <div className="p-6 border-t border-[#f8f6f0]/10 hidden md:block">
          <button onClick={onLogout} className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl w-full hover:bg-red-500/20 text-red-300 transition-all font-bold">
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full relative">
        <header className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#134B36] tracking-tight">
              {activeTab === 'pool' && 'İş Havuzu'}
              {activeTab === 'active' && 'Aktif Görevlerim'}
              {activeTab === 'completed' && 'Geçmiş İşler'}
              {activeTab === 'wallet' && 'Finans & Cüzdan'}
              {activeTab === 'profile' && 'Esnaf Profili'}
            </h1>
            <p className="text-sm md:text-base text-[#134B36]/60 mt-2 font-medium">
              {activeTab === 'pool' && 'Bölgendeki bakım taleplerini üstlen ve kazancını artır.'}
              {activeTab === 'active' && 'Üzerine aldığın görevlerin öncesi/sonrası fotoğraflarını yükle.'}
              {activeTab === 'wallet' && 'Hakedişlerini takip et ve banka hesabına aktar.'}
            </p>
          </div>
          
          <button onClick={() => setActiveTab('wallet')} className="bg-white px-6 py-4 rounded-[1.5rem] shadow-[0_8px_30px_rgba(19,75,54,0.06)] border border-[#134B36]/5 flex items-center gap-5 shrink-0 hover:scale-105 transition-transform group cursor-pointer">
            <div className="bg-[#134B36]/5 p-3 rounded-full group-hover:bg-[#C9A84C]/10 transition-colors">
              <Wallet size={24} className="text-[#134B36] group-hover:text-[#C9A84C] transition-colors" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-widest text-[#134B36]/50 font-black">Çekilebilir Bakiye</p>
              <p className="text-2xl font-black text-[#134B36] mt-0.5">₺{partnerBalance.toLocaleString('tr-TR')}</p>
            </div>
          </button>
        </header>

        {activeTab === 'pool' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {poolOrders.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white border border-dashed border-[#134B36]/20 rounded-[2rem]">
                <ListTodo size={48} className="mx-auto text-[#134B36]/20 mb-4" />
                <p className="text-lg text-[#134B36]/60 font-medium">Şu an çevrenizde bekleyen yeni iş bulunmuyor.</p>
              </div>
            ) : poolOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-[2rem] p-8 border border-[#134B36]/10 shadow-[0_10px_40px_rgba(19,75,54,0.04)] hover:-translate-y-1 transition-all">
                  <div className="flex justify-between items-start mb-6 pb-6 border-b border-[#134B36]/5">
                    <div>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-[9px] font-black rounded-full mb-3 tracking-[0.2em] uppercase">Yeni Talep</span>
                      <h3 className="text-2xl font-serif text-[#134B36]">{order.package}</h3>
                      <p className="text-sm font-bold text-[#1a1c19] mt-2">{order.deceasedName}</p>
                      <p className="text-xs text-[#134B36]/60 leading-relaxed mt-1">{order.graveDetails}</p>
                    </div>
                    <div className="text-right bg-[#f8f6f0] px-4 py-3 rounded-2xl border border-[#134B36]/5">
                      <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#134B36]/50 mb-1">Hakediş</p>
                      <p className="text-xl font-black text-[#134B36]">₺{(order.price * 0.8).toLocaleString('tr-TR')}</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-[#1a1c19]/80 font-medium"><MapPin size={18} className="text-[#C9A84C]" /> <span>{order.cemetery}</span></div>
                      <button onClick={() => openGoogleMaps(order.cemetery)} className="text-[#C9A84C] hover:text-[#134B36] bg-[#C9A84C]/10 p-2 rounded-full transition-colors"><Navigation size={18} /></button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#1a1c19]/80 font-medium"><Clock size={18} className="text-[#C9A84C]" /> <span>Sipariş: {order.date}</span></div>
                  </div>
                  <button onClick={() => handleAcceptOrder(order)} className="w-full py-5 bg-[#134B36] text-[#f8f6f0] rounded-[1.2rem] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#0B2E21] hover:shadow-xl transition-all active:scale-95">
                    Görevi Üstlen <ArrowUpRight size={18} />
                  </button>
                </div>
            ))}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activeOrders.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white border border-dashed border-[#134B36]/20 rounded-[2rem]">
                <Briefcase size={48} className="mx-auto text-[#134B36]/20 mb-4" />
                <p className="text-lg text-[#134B36]/60 font-medium">Şu an üstlendiğiniz aktif bir görev yok.</p>
              </div>
            ) : activeOrders.map((order) => {
                const canComplete = order.beforeUploaded && order.afterUploaded;
                return (
                  <div key={order.id} className="bg-white rounded-[2rem] p-8 border-2 border-[#C9A84C]/30 shadow-[0_15px_40px_rgba(201,168,76,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#C9A84C] text-[#0d1a10] text-[9px] font-black tracking-widest uppercase px-4 py-1.5 rounded-bl-xl">Devam Ediyor</div>
                    <div className="mb-8">
                      <h3 className="text-2xl font-serif text-[#134B36] mb-2">{order.package}</h3>
                      <p className="text-sm font-bold text-[#1a1c19] mb-1">{order.deceasedName}</p>
                      <p className="text-xs text-[#134B36]/70 leading-relaxed mb-4">{order.graveDetails}</p>
                      <button onClick={() => openGoogleMaps(order.cemetery)} className="inline-flex items-center gap-2 text-xs font-bold bg-[#134B36]/5 text-[#134B36] px-4 py-2.5 rounded-xl hover:bg-[#134B36]/10 transition-colors">
                        <Navigation size={14} className="text-[#C9A84C]" /> {order.cemetery}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <button onClick={() => triggerFileInput(order.id, 'before')} disabled={isUploading.orderId === order.id && isUploading.type === 'before'} className={`relative flex flex-col items-center justify-center gap-3 p-4 border-2 border-dashed rounded-[1.5rem] transition-all overflow-hidden h-40 ${order.beforeUploaded ? 'border-green-500 shadow-md' : 'border-[#134B36]/20 bg-[#F8F6F0] hover:bg-white hover:border-[#C9A84C] text-[#134B36]/60'}`}>
                        {isUploading.orderId === order.id && isUploading.type === 'before' ? (
                          <><Loader2 size={32} className="animate-spin text-[#C9A84C]" /><span className="text-xs font-bold text-center text-[#134B36]">Yükleniyor...</span></>
                        ) : order.beforeImgLocal ? (
                          <><img src={order.beforeImgLocal} alt="Öncesi" className="absolute inset-0 w-full h-full object-cover opacity-90" /><div className="relative z-10 bg-green-500 text-white rounded-full p-1.5 shadow-lg"><CheckCircle size={24} /></div><span className="relative z-10 text-[10px] font-bold text-white drop-shadow-md bg-black/60 px-3 py-1 rounded-full mt-2 backdrop-blur-sm">Değiştir</span></>
                        ) : (
                          <><div className="bg-[#134B36]/10 p-3 rounded-full"><Camera size={24} className="text-[#134B36]" /></div><span className="text-xs font-bold text-center text-[#134B36]">1. Öncesi<br/>Fotoğrafı</span></>
                        )}
                      </button>

                      <button onClick={() => triggerFileInput(order.id, 'after')} disabled={!order.beforeUploaded || (isUploading.orderId === order.id && isUploading.type === 'after')} className={`relative flex flex-col items-center justify-center gap-3 p-4 border-2 border-dashed rounded-[1.5rem] transition-all overflow-hidden h-40 ${order.afterUploaded ? 'border-green-500 shadow-md' : !order.beforeUploaded ? 'opacity-40 cursor-not-allowed border-[#134B36]/20 bg-gray-50 text-gray-400' : 'border-[#134B36]/20 bg-[#F8F6F0] hover:bg-white hover:border-[#C9A84C] text-[#134B36]/60'}`}>
                        {isUploading.orderId === order.id && isUploading.type === 'after' ? (
                          <><Loader2 size={32} className="animate-spin text-[#C9A84C]" /><span className="text-xs font-bold text-center text-[#134B36]">Yükleniyor...</span></>
                        ) : order.afterImgLocal ? (
                          <><img src={order.afterImgLocal} alt="Sonrası" className="absolute inset-0 w-full h-full object-cover opacity-90" /><div className="relative z-10 bg-green-500 text-white rounded-full p-1.5 shadow-lg"><CheckCircle size={24} /></div><span className="relative z-10 text-[10px] font-bold text-white drop-shadow-md bg-black/60 px-3 py-1 rounded-full mt-2 backdrop-blur-sm">Değiştir</span></>
                        ) : (
                          <><div className="bg-[#134B36]/10 p-3 rounded-full"><UploadCloud size={24} className="text-[#134B36]" /></div><span className="text-xs font-bold text-center text-[#134B36]">2. Sonrası<br/>Fotoğrafı</span></>
                        )}
                      </button>
                    </div>
                    
                    <button onClick={() => handleCompleteOrder(order)} disabled={!canComplete} className={`w-full py-5 rounded-[1.2rem] font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${canComplete ? 'bg-[#134B36] text-[#f8f6f0] hover:bg-[#0B2E21] hover:shadow-xl active:scale-95' : 'bg-[#f8f6f0] text-[#134B36]/40 cursor-not-allowed border border-[#134B36]/10'}`}>
                      {canComplete ? 'İşi Tamamla ve Hakedişi Kazan' : 'Önce Fotoğrafları Yükleyin'}
                    </button>
                  </div>
                );
              })
            }
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div className="bg-[#134B36] p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <p className="text-sm text-[#f8f6f0]/70 font-medium tracking-widest uppercase mb-2">Net Çekilebilir Bakiye</p>
                <p className="text-5xl md:text-7xl font-black text-[#C9A84C] tracking-tight">₺{partnerBalance.toLocaleString('tr-TR')}</p>
              </div>
              <button className="relative z-10 w-full md:w-auto px-10 py-5 bg-[#f8f6f0] text-[#134B36] font-black uppercase tracking-widest text-sm rounded-[1.5rem] shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:bg-white hover:-translate-y-1 transition-all active:scale-95">
                IBAN'a Çekim Talebi
              </button>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#134B36]/10 shadow-[0_10px_40px_rgba(19,75,54,0.03)]">
              <h3 className="text-2xl font-serif text-[#134B36] mb-8 flex items-center gap-3">
                <CheckSquare size={24} className="text-[#C9A84C]" /> Cüzdan Geçmişi
              </h3>
              
              {completedOrders.length === 0 ? (
                <div className="text-center py-12 bg-[#F8F6F0] rounded-[1.5rem] border border-dashed border-[#134B36]/20">
                  <Wallet size={40} className="mx-auto text-[#134B36]/20 mb-3" />
                  <p className="text-[#134B36]/60 font-medium">Henüz tamamlanmış ve cüzdana yansımış bir hakedişiniz bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedOrders.map((order, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#F8F6F0] rounded-[1.5rem] border border-transparent hover:border-[#C9A84C]/30 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                          <ArrowUpRight size={24} strokeWidth={3} />
                        </div>
                        <div>
                          <p className="font-bold text-[#1a1c19] text-lg">{order.package}</p>
                          <p className="text-xs font-medium text-[#134B36]/60 mt-0.5">{order.date} • {order.cemetery}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right border-t sm:border-t-0 border-[#134B36]/10 pt-3 sm:pt-0">
                        <span className="inline-block px-2 py-0.5 bg-[#134B36]/10 text-[#134B36] text-[10px] font-black rounded-full mb-1 tracking-widest uppercase">Hakediş</span>
                        <p className="font-black text-2xl text-[#134B36]">+₺{(order.price * 0.8).toLocaleString('tr-TR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-4 max-w-4xl">
            {completedOrders.length === 0 ? (
              <p className="text-[#134B36]/50">Henüz tamamlanan bir işiniz yok.</p>
            ) : completedOrders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-green-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="bg-green-100 p-4 rounded-full text-green-600 shrink-0"><CheckCircle size={28} /></div>
                    <div>
                      <p className="font-bold text-[#134B36] text-lg">{order.package}</p>
                      <p className="text-sm font-medium text-[#1a1c19]/60 mt-0.5">Merhum: {order.deceasedName}</p>
                      <p className="text-xs text-[#134B36]/40 mt-1">{order.date} • {order.cemetery}</p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* YENİ IBAN KONTROL ALANI */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#134B36]/10 shadow-sm">
              <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#134B36]/5">
                <div className="w-20 h-20 bg-[#C9A84C]/10 rounded-full flex items-center justify-center text-[#C9A84C]"><User size={40} /></div>
                <div>
                  <h3 className="text-3xl font-serif text-[#134B36]">Saha Sorumlusu</h3>
                  <p className="text-sm font-bold text-green-600 flex items-center gap-1.5 mt-2"><CheckCircle size={16} /> Onaylı Vefa İş Ortağı</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div><label className="text-[10px] font-black text-[#134B36]/50 uppercase tracking-[0.2em] block mb-2 pl-1">Hizmet Bölgeleri</label><p className="px-5 py-4 bg-[#f8f6f0] rounded-2xl text-[#1a1c19] font-medium flex items-center gap-3"><MapPin size={18} className="text-[#C9A84C]"/> İstanbul (Tüm İlçeler)</p></div>
                 <div><label className="text-[10px] font-black text-[#134B36]/50 uppercase tracking-[0.2em] block mb-2 pl-1">Sistem Kayıt Tarihi</label><p className="px-5 py-4 bg-[#f8f6f0] rounded-2xl text-[#1a1c19] font-medium">Mart 2026</p></div>
              </div>
            </div>
            
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#134B36]/10 shadow-sm">
              <div className="flex items-center gap-4 mb-8"><Building className="text-[#C9A84C]" size={28} /><h3 className="text-2xl font-serif text-[#134B36]">Banka & IBAN Bilgileri</h3></div>
              <div className="space-y-5">
                 <div>
                   <label className="text-[10px] font-black text-[#134B36]/50 uppercase tracking-[0.2em] block mb-2 pl-1">Alıcı Adı Soyadı</label>
                   <input type="text" placeholder="Örn: Görkem Berke Tutkun" className="w-full px-5 py-4 bg-[#f8f6f0] rounded-2xl outline-none focus:border-[#C9A84C] border border-transparent transition-all font-medium text-gray-800" />
                 </div>
                 
                 {/* YENİ IBAN INPUTU */}
                 <div>
                   <label className="text-[10px] font-black text-[#134B36]/50 uppercase tracking-[0.2em] block mb-2 pl-1 flex items-center justify-between">
                     <span>IBAN Numarası</span>
                     <span className={iban.replace(/\s/g, '').length === 26 ? "text-green-500" : "text-red-400"}>
                       {iban.replace(/\s/g, '').length}/26 Karakter
                     </span>
                   </label>
                   <input 
                     type="text" 
                     value={iban}
                     onChange={handleIbanChange}
                     placeholder="TR00 0000 0000 0000 0000 0000 00" 
                     className={`w-full px-5 py-4 bg-[#f8f6f0] rounded-2xl outline-none border transition-all font-mono font-medium tracking-wider ${iban.replace(/\s/g, '').length === 26 ? 'border-green-400 text-[#134B36]' : 'border-transparent focus:border-[#C9A84C] text-gray-800'}`} 
                   />
                 </div>

                 <button 
                   disabled={iban.replace(/\s/g, '').length !== 26}
                   className={`px-8 py-4 rounded-[1.5rem] font-bold uppercase tracking-widest text-sm transition-all mt-4 w-full md:w-auto shadow-md ${iban.replace(/\s/g, '').length === 26 ? 'bg-[#134B36] text-[#f8f6f0] hover:bg-[#0B2E21] cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                 >
                   Bilgileri Güncelle
                 </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default PartnerDashboard;