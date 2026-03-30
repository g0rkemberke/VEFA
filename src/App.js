import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { collection, onSnapshot, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore'; 
import { Star, Quote, ChevronDown } from 'lucide-react'; 

import Navbar from './components/Navbar';
import Packages from './components/Packages';
import CemeterySearch from './components/CemeterySearch';
import OrderDrawer from './components/OrderDrawer';
import HowItWorks from './components/HowItWorks';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import UserDashboard from './components/UserDashboard';
import VefaAtolyesi from './components/VefaAtolyesi'; 
import PartnerDashboard from './components/PartnerDashboard';
import AdminDashboard from './components/AdminDashboard'; 
import Toast from './components/Toast'; 

import ServicesPage from './components/ServicesPage';
import ProcessPage from './components/ProcessPage';
import CorporatePage from './components/CorporatePage';
import PartnerApplication from './components/PartnerApplication'; 

const Testimonials = ({ globalOrders }) => {
  const realReviews = globalOrders.filter(o => o.status === 'completed' && o.rating >= 4 && o.reviewComment);

  const demoReviews = [
    {
      id: 'demo1',
      customer: 'Zeynep Özdemir',
      cemetery: 'Zincirlikuyu Mezarlığı',
      rating: 5,
      reviewComment: "Şehir dışında olduğum için gidemiyordum, sayenizde gözüm arkada kalmadı. Çiçekler harika görünüyor.",
      beforeImgLocal: "https://images.unsplash.com/photo-1595062584113-52445695034c?q=80&w=400&auto=format&fit=crop", 
      afterImgLocal: "https://images.unsplash.com/photo-1528818868012-70b1275d8d01?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 'demo2',
      customer: 'Mehmet Yılmaz',
      cemetery: 'Karacaahmet Mezarlığı',
      rating: 5,
      reviewComment: "Mermerlerin parlatılması ve temizlik tek kelimeyle kusursuz. Esnaf arkadaşın emeğine sağlık.",
      beforeImgLocal: "https://images.unsplash.com/photo-1595062584113-52445695034c?q=80&w=400&auto=format&fit=crop",
      afterImgLocal: "https://images.unsplash.com/photo-1528818868012-70b1275d8d01?q=80&w=400&auto=format&fit=crop"
    }
  ];

  const displayReviews = [...realReviews, ...demoReviews].slice(0, 6);

  return (
    <section className="py-32 bg-[#F8F6F0] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent"></div>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-4 block">Gerçek Dönüşümler</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#134B36] tracking-tight">Hizmet Alan Ailelerimiz</h2>
          <div className="h-1 w-20 bg-[#134B36]/20 mt-6 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-[2.5rem] border border-[#134B36]/10 shadow-lg overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-500">
              
              <div className="grid grid-cols-2 gap-0.5 bg-gray-100 h-48 relative">
                <div className="relative group/img overflow-hidden">
                  <img 
                    src={review.beforeImgLocal || review.beforeImg || "https://via.placeholder.com/200x200?text=Hazirlaniyor"} 
                    alt="Öncesi" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-all" />
                  <span className="absolute top-3 left-3 bg-black/60 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Öncesi</span>
                </div>
                <div className="relative group/img overflow-hidden">
                  <img 
                    src={review.afterImgLocal || review.afterImg || "https://via.placeholder.com/200x200?text=Hazirlaniyor"} 
                    alt="Sonrası" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#134B36] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Sonrası</span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col relative">
                <Quote size={30} className="text-[#C9A84C]/10 absolute top-4 right-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} className="text-[#C9A84C] fill-[#C9A84C]" />
                  ))}
                </div>
                <p className="text-[#1a1c19] text-sm leading-relaxed mb-6 italic">
                  "{review.reviewComment}"
                </p>
                
                <div className="mt-auto flex items-center gap-3 border-t border-[#134B36]/5 pt-6">
                  <div className="w-9 h-9 bg-[#134B36] rounded-full flex items-center justify-center text-[#C9A84C] font-serif font-bold text-xs">
                    {review.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#134B36] text-xs">{review.customer}</p>
                    <p className="text-[9px] text-[#134B36]/50 uppercase tracking-widest">{review.cemetery}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // PWA Kurulum State'leri
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // PWA Mantığı - Giriş
  useEffect(() => {
    const isIphone = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIphone);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    });

    if (isIphone && !window.navigator.standalone) {
      setShowInstallBanner(true);
    }

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      showToast('VefaApp ana ekranınıza başarıyla eklendi!', 'success');
    });
  }, []);

  const handleInstallApp = async () => {
    if (isIOS) {
      showToast('Yüklemek için Paylaş simgesine basıp "Ana Ekrana Ekle"yi seçin.', 'info');
      return;
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      }
    }
  };

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  const [isDemandOpen, setDemandOpen] = useState(false);
  const [demandInput, setDemandInput] = useState({ city: '', email: '' });
  
  const [globalOrders, setGlobalOrders] = useState([]);

  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      ordersData.sort((a, b) => b.createdAt - a.createdAt);
      setGlobalOrders(ordersData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let userRole = 'customer'; 
          if (userDocSnap.exists()) {
            userRole = userDocSnap.data().role || 'customer';
          }
          
          setCurrentUser({ ...user, role: userRole });
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Kullanıcı rolü alınamadı:", error);
          setCurrentUser(user);
          setIsLoggedIn(true);
        }
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [cityDemands, setCityDemands] = useState(() => {
    const saved = localStorage.getItem('vefa_cityDemands');
    return saved ? JSON.parse(saved) : []; 
  });
  useEffect(() => { localStorage.setItem('vefa_cityDemands', JSON.stringify(cityDemands)); }, [cityDemands]);

  const handleDemandSubmit = () => {
    if (!demandInput.city || !demandInput.email) {
      showToast('Lütfen şehir ve e-posta alanlarını doldurun.', 'error');
      return;
    }
    setCityDemands(prev => [{
      id: prev.length > 0 ? prev[0].id + 1 : 101,
      city: demandInput.city,
      email: demandInput.email,
      date: new Date().toLocaleDateString('tr-TR')
    }, ...prev]);
    setDemandOpen(false);
    setDemandInput({ city: '', email: '' });
    showToast('Şehir talebiniz başarıyla alındı. Teşekkür ederiz!', 'success');
  };

  const [graveDesign, setGraveDesign] = useState({
    name: '', date: '', marble: 'white', headstone: 'classic', flowers: 'none', cemetery: ''
  });

  const calculateDynamicPrice = () => {
    if (!selectedPkg) return { total: 0, items: [] };
    
    const basePriceRaw = selectedPkg.price || 1200;
    const basePrice = typeof basePriceRaw === 'string' 
      ? parseInt(basePriceRaw.replace(/[^0-9]/g, ''), 10) 
      : Number(basePriceRaw);

    let total = basePrice;
    const items = [{ name: `${selectedPkg.title} (Taban Paket)`, price: basePrice }];

    if (graveDesign.marble === 'black') { items.push({ name: 'Siyah Granit / Mermer Farkı', price: 600 }); total += 600; } 
    else if (graveDesign.marble === 'grey') { items.push({ name: 'Gri Mermer Farkı', price: 300 }); total += 300; }

    if (graveDesign.flowers === 'gul') { items.push({ name: 'Kırmızı Gül Ekimi & Bakımı', price: 400 }); total += 400; } 
    else if (graveDesign.flowers === 'lavanta') { items.push({ name: 'Lavanta Ekimi & Bakımı', price: 250 }); total += 250; } 
    else if (graveDesign.flowers === 'papatya') { items.push({ name: 'Beyaz Papatya Ekimi', price: 150 }); total += 150; }

    items.push({ name: 'Lojistik & Ekipman Payı', price: 200 }); total += 200;

    selectedExtras.forEach(extraId => {
       if (extraId === 'polish') { items.push({ name: 'Özel Mermer Cilası', price: 300 }); total += 300; }
       if (extraId === 'birdbath') { items.push({ name: 'Mermer Kuşluk (Sulama)', price: 250 }); total += 250; }
       if (extraId === 'pebbles') { items.push({ name: 'Kar Beyazı Çakıl Taşı', price: 150 }); total += 150; }
    });

    return { total: Number(total), items };
  };

  const currentPriceDetails = calculateDynamicPrice();

  const [partnerBalance, setPartnerBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('vefa_partnerBalance');
      return saved ? Number(JSON.parse(saved)) || 0 : 0; 
    } catch { return 0; }
  });
  useEffect(() => { localStorage.setItem('vefa_partnerBalance', JSON.stringify(Number(partnerBalance))); }, [partnerBalance]);

  const [adminFinance, setAdminFinance] = useState(() => {
    try {
      const saved = localStorage.getItem('vefa_adminFinance');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { revenue: Number(parsed.revenue) || 0, cut: Number(parsed.cut) || 0 };
      }
    } catch {}
    return { revenue: 0, cut: 0 }; 
  });
  useEffect(() => { localStorage.setItem('vefa_adminFinance', JSON.stringify({ revenue: Number(adminFinance.revenue), cut: Number(adminFinance.cut) })); }, [adminFinance]);

  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
    const title = (pkg?.title || '').toLowerCase();
    let newFlowers = graveDesign.flowers;
    
    if (title.includes('papatya')) newFlowers = 'papatya';
    else if (title.includes('gül') || title.includes('gul')) newFlowers = 'gul';
    else if (title.includes('lavanta')) newFlowers = 'lavanta';
    else if (title.includes('standart') || title.includes('temizlik')) newFlowers = 'none';

    setGraveDesign(prev => ({ ...prev, flowers: newFlowers }));
    setSelectedExtras([]); 
    setDrawerOpen(true);
  };

  const handleProceedToCheckout = () => {
    if (!graveDesign.cemetery || graveDesign.cemetery.trim() === '') {
      showToast('Lütfen işleme devam etmeden önce bir mezarlık seçin veya yazın.', 'error');
      return; 
    }
    setDrawerOpen(false);
    setTimeout(() => { setCheckoutOpen(true); }, 300);
  };

  const handlePaymentSuccess = async (pkgInfo) => {
    if (!db) {
      showToast('Sistem bağlantısı şu an kurulamıyor, lütfen sayfayı yenileyin.', 'error');
      return;
    }

    const finalPrice = Number(currentPriceDetails.total); 
    let extraNotes = selectedExtras.length > 0 ? " | Seçilen Ekstralar: " : "";
    if(selectedExtras.includes('polish')) extraNotes += "Mermer Cilası, ";
    if(selectedExtras.includes('birdbath')) extraNotes += "Kuşluk, ";
    if(selectedExtras.includes('pebbles')) extraNotes += "Beyaz Çakıl, ";

    const orderId = `VF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      customer: currentUser?.displayName || 'Değerli Üyemiz',
      customerEmail: currentUser?.email || 'Bilinmiyor', 
      package: pkgInfo?.title || 'Özel Sipariş',
      cemetery: graveDesign.cemetery || 'Mezarlık Belirtilmedi',
      deceasedName: graveDesign.name || 'İsimsiz Mezar',
      graveDetails: `${graveDesign.marble === 'white' ? 'Beyaz' : graveDesign.marble === 'black' ? 'Siyah' : 'Gri'} Mermer, ${graveDesign.flowers !== 'none' ? graveDesign.flowers + ' dikimi' : 'çiçeksiz'}${extraNotes}`,
      price: finalPrice, 
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'pending',
      notes: '',
      beforeImg: null, 
      afterImg: null,
      createdAt: Date.now()
    };

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
      setAdminFinance(prev => ({ revenue: Number(prev.revenue) + finalPrice, cut: Number(prev.cut) + (finalPrice * 0.2) }));
      setCheckoutOpen(false);
      setIsLoggedIn(true); 
      navigate('/hesabim'); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Siparişiniz başarıyla oluşturuldu ve veritabanına kaydedildi.', 'success');
    } catch (error) {
      console.error("Sipariş kaydedilemedi:", error);
      showToast('Sipariş oluşturulurken bir hata oluştu.', 'error');
    }
  };

  const updateOrderStatus = async (orderId, newStatus, updates = {}) => {
    if (!db) return;
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus, ...updates });
      
      if (newStatus === 'cancelled') showToast('Sipariş sistemden iptal edildi.', 'error');
      if (newStatus === 'completed') {
        setPartnerBalance(b => Number(b) + (updates.price ? Number(updates.price) * 0.8 : 0)); 
        showToast('İş tamamlandı! Hakediş cüzdanınıza eklendi.', 'success');
      }
      if (newStatus === 'in-progress' && !updates.beforeUploaded && !updates.afterUploaded) {
        showToast('Görevi üstlendiniz. Lütfen fotoğrafları yükleyin.', 'info');
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      showToast('Durum güncellenirken hata oluştu.', 'error');
    }
  };

  const handleOpenAuth = (view) => { setAuthView(view); setAuthOpen(true); };
  
  const handleLoginSuccess = (userObj) => { 
    setAuthOpen(false); 
    if (userObj?.role === 'admin') {
      navigate('/admin');
    } else if (userObj?.role === 'partner') {
      navigate('/esnaf');
    } else {
      navigate('/hesabim'); 
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    showToast('Vefa sistemine başarıyla giriş yapıldı.', 'success'); 
  };
  
  const handleLogout = async () => { 
    try {
      await signOut(auth);
      navigate('/'); 
      showToast('Hesabınızdan güvenli bir şekilde çıkış yapıldı.', 'info'); 
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6F0]">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#134B36]/20 border-t-[#C9A84C] rounded-full animate-spin"></div>
            <p className="text-[#134B36] font-serif animate-pulse">Vefa'ya bağlanılıyor...</p>
         </div>
      </div>
    );
  }

  const Footer = () => (
    <footer id="footer" className="py-20 text-center border-t border-[#134B36]/10 opacity-70 hover:opacity-100 transition-opacity duration-500 flex flex-col items-center gap-6 bg-[#F8F6F0] relative z-10">
      <p className="text-[10px] tracking-[0.8em] font-black uppercase text-[#134B36]">VEFA • 2026</p>
      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={() => navigate('/esnaf-basvuru')} className="text-[11px] font-bold text-[#134B36]/60 hover:text-[#134B36] border border-[#134B36]/20 px-6 py-2.5 rounded-full hover:bg-[#134B36]/5 transition-all shadow-sm">Esnaf Başvurusu</button>
        <button onClick={() => {
          if (!isLoggedIn) {
            setAuthView('login');
            setAuthOpen(true);
          } else if (currentUser?.role === 'partner' || currentUser?.role === 'admin') {
            navigate('/esnaf');
          } else {
            showToast('Saha ekibi yetkiniz bulunmuyor. Lütfen başvuru yapın.', 'error');
          }
        }} className="text-[11px] font-bold text-[#134B36]/60 hover:text-[#134B36] border border-[#134B36]/20 px-6 py-2.5 rounded-full hover:bg-[#134B36]/5 transition-all shadow-sm">Saha Ekibi Girişi</button>
        <button onClick={() => {
          if (!isLoggedIn) {
            setAuthView('login');
            setAuthOpen(true);
          } else if (currentUser?.role === 'admin') {
            navigate('/admin');
          } else {
            showToast('Yönetici yetkiniz bulunmuyor.', 'error');
          }
        }} className="text-[11px] font-bold text-[#C9A84C] hover:text-[#8B6914] border border-[#C9A84C]/30 px-6 py-2.5 rounded-full hover:bg-[#C9A84C]/10 transition-all shadow-sm">Yönetici Paneli</button>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen relative selection:bg-[#134B36] selection:text-white overflow-hidden">
      <div className="premium-bg" />
      <div className="aura" />
      
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      
      {location.pathname !== '/admin' && location.pathname !== '/esnaf' && (
        <Navbar onOpenAuth={handleOpenAuth} isLoggedIn={isLoggedIn} user={currentUser} onLogout={handleLogout} />
      )}

      <Routes>
        <Route path="/hesabim" element={isLoggedIn ? <div className="pt-28 md:pt-32"><UserDashboard globalOrders={globalOrders} user={currentUser} onLogout={handleLogout} /></div> : <Navigate to="/" />} />
        <Route path="/esnaf" element={(isLoggedIn && (currentUser?.role === 'partner' || currentUser?.role === 'admin')) ? <div className="pt-28 md:pt-32"><PartnerDashboard onLogout={() => navigate('/')} globalOrders={globalOrders} updateOrderStatus={updateOrderStatus} partnerBalance={partnerBalance} /></div> : <Navigate to="/" />} />
        <Route path="/admin" element={(isLoggedIn && currentUser?.role === 'admin') ? <AdminDashboard onLogout={() => navigate('/')} globalOrders={globalOrders} adminFinance={adminFinance} updateOrderStatus={updateOrderStatus} cityDemands={cityDemands} /> : <Navigate to="/" />} />
        
        <Route path="/hizmetler" element={<div className="pt-32"><ServicesPage onSelectPackage={handleSelectPackage} /><Footer /></div>} />
        <Route path="/surec" element={<div className="pt-32"><ProcessPage graveDesign={graveDesign} setGraveDesign={setGraveDesign} /><Footer /></div>} />
        <Route path="/kurumsal" element={<div className="pt-32"><CorporatePage /><Footer /></div>} />
        <Route path="/esnaf-basvuru" element={<div className="pt-32"><PartnerApplication /><Footer /></div>} />
        
        <Route path="/" element={
          <>
            <main className="relative z-10">
              
              <header className="relative max-w-[1440px] mx-auto px-6 md:px-12 pt-40 pb-20 min-h-[90vh] flex flex-col justify-center">
                <div className="relative border border-[#134B36]/20 rounded-[3rem] p-10 md:p-20 text-center bg-[#F8F6F0]/95 backdrop-blur-xl shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="absolute top-0 left-0 w-24 md:w-32 h-24 md:h-32 border-t border-l border-[#134B36]/30 rounded-tl-[3rem] opacity-50"></div>
                  <div className="absolute bottom-0 right-0 w-24 md:w-32 h-24 md:h-32 border-b border-r border-[#134B36]/30 rounded-br-[3rem] opacity-50"></div>
                  <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#134B36]/20 bg-white shadow-sm hover:scale-105 transition-transform duration-500 cursor-default">
                      <div className="h-2 w-2 rounded-full bg-[#1E6B4E] animate-pulse"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#134B36]">Profesyonel Mezar Bakım Hizmeti</span>
                    </div>
                    <h1 className="text-5xl md:text-[6rem] font-serif font-medium text-[#134B36] leading-[1.1] tracking-tight">
                      Sevdiklerinizin emaneti, <br /><span className="italic text-[#1E6B4E] font-normal opacity-90">bize emanet.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#134B36]/70 font-light max-w-2xl mx-auto leading-relaxed">Şehirler arası mesafeleri ortadan kaldırıyor, bakım hizmetlerinde en yüksek şeffaflık ve kalite standartlarını uyguluyoruz.</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                      <button 
                        onClick={() => {
                          const atolye = document.getElementById('atolye-section');
                          if(atolye) atolye.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }} 
                        className="bg-[#134B36] text-[#F8F6F0] px-10 py-5 rounded-full text-sm font-bold hover:bg-[#0B2E21] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3 group"
                      >
                        Emanetinizi Tasarlayın 
                        <ChevronDown size={18} className="animate-bounce text-[#C9A84C]" />
                      </button>

                      <button onClick={() => navigate('/hizmetler')} className="bg-white border border-[#134B36]/20 text-[#134B36] px-10 py-5 rounded-full text-sm font-bold hover:bg-[#F8F6F0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">Hizmetleri İncele</button>
                    </div>
                  </div>
                </div>
              </header>

              <section className="py-32 bg-[#134B36]/3 border-y border-[#134B36]/5 transition-colors duration-700 hover:bg-[#134B36]/5">
                <HowItWorks />
              </section>

              <Testimonials globalOrders={globalOrders} />

              <section className="py-32 scroll-mt-24">
                <CemeterySearch onOpenDemand={() => setDemandOpen(true)} />
              </section>

              <section id="atolye-section" className="py-32 scroll-mt-24">
                <VefaAtolyesi graveDesign={graveDesign} setGraveDesign={setGraveDesign} />
              </section>

              <section id="packages-section" className="max-w-[1440px] mx-auto px-10 md:px-24 pb-48 scroll-mt-24">
                <div className="mb-20 text-left md:text-center"><h2 className="text-5xl font-serif text-[#134B36] tracking-tight">Hizmet Paketlerimiz</h2><div className="h-1 w-20 bg-[#134B36]/20 mt-6 md:mx-auto rounded-full" /></div>
                <Packages onSelect={handleSelectPackage} />
              </section>
              
            </main>
            
            <Footer />
          </>
        } />
      </Routes>

      {/* PWA Yükleme Butonu (Yüzen - Floating) */}
      {showInstallBanner && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in slide-in-from-bottom-10 duration-700">
          <div className="bg-[#134B36] text-[#F8F6F0] p-4 rounded-[2rem] shadow-2xl border border-[#C9A84C]/30 flex items-center justify-between backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                <span className="font-serif font-bold text-[#C9A84C]">V</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">VefaApp Mobil</p>
                <p className="text-[10px] opacity-80">Ana ekranınıza ekleyin</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleInstallApp}
                className="bg-[#C9A84C] text-[#134B36] px-5 py-2.5 rounded-xl text-[11px] font-black uppercase hover:bg-white transition-all active:scale-95 shadow-lg"
              >
                {isIOS ? 'Nasıl Yüklenir?' : 'Hemen Yükle'}
              </button>
              <button 
                onClick={() => setShowInstallBanner(false)}
                className="p-2 opacity-50 hover:opacity-100 text-white"
              >
                <span className="text-xl">&times;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <OrderDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        selectedPackage={selectedPkg} 
        onProceed={handleProceedToCheckout}
        priceDetails={currentPriceDetails}
        selectedExtras={selectedExtras}
        setSelectedExtras={setSelectedExtras}
        graveDesign={graveDesign}       
        setGraveDesign={setGraveDesign} 
      />
      
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setCheckoutOpen(false)} selectedPackage={selectedPkg} onPaymentSuccess={handlePaymentSuccess} priceDetails={currentPriceDetails} />
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} initialView={authView} onLoginSuccess={handleLoginSuccess} />
      
      {isDemandOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#0d1a10]/60 backdrop-blur-md transition-all duration-500">
           <div className="bg-[#f8f6f0] rounded-[3rem] p-12 md:p-16 max-w-xl w-full shadow-2xl space-y-8 border border-[#C9A84C]/20 relative animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-start">
               <h2 className="text-4xl font-serif text-[#134B36]">Şehir Talebi</h2>
               <button onClick={() => setDemandOpen(false)} className="text-[#134B36]/40 hover:text-[#134B36] transition-colors"><span className="text-4xl leading-none">&times;</span></button>
             </div>
             <div className="space-y-4">
               <input type="text" placeholder="Hangi Şehir?" value={demandInput.city} onChange={(e) => setDemandInput({...demandInput, city: e.target.value})} className="w-full p-6 bg-white border border-[#134B36]/10 text-[#1a1c19] rounded-2xl outline-none focus:border-[#C9A84C] transition-all" />
               <input type="email" placeholder="E-posta Adresiniz" value={demandInput.email} onChange={(e) => setDemandInput({...demandInput, email: e.target.value})} className="w-full p-6 bg-white border border-[#134B36]/10 text-[#1a1c19] rounded-2xl outline-none focus:border-[#C9A84C] transition-all" />
             </div>
             <button onClick={handleDemandSubmit} className="w-full py-6 bg-[#134B36] text-[#F8F6F0] rounded-[1.5rem] font-bold hover:bg-[#0B2E21] hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">Talebi Gönder</button>
           </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}