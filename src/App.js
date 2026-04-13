import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Star, Quote, ChevronDown, CheckCircle, MapPin } from 'lucide-react';

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
import BeforeAfterSlider from './components/BeforeAfterSlider';
import MobileBottomNav from './components/MobileBottomNav';

import CemeteryMapPublic from './components/CemeteryMapPublic';
import CemeteryMapDashboard from './components/CemeteryMapDashboard';
import BackendTest from './components/BackendTest';

const Testimonials = ({ globalOrders }) => {
  const realReviews = globalOrders.filter(o => o.isFeatured === true);

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
    <section className="py-20 md:py-32 bg-[#F8F6F0] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent"></div>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-4 block">Gerçek Dönüşümler</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#134B36] tracking-tight">Hizmet Alan Ailelerimiz</h2>
          <div className="h-1 w-20 bg-[#134B36]/20 mt-6 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-[#134B36]/10 shadow-lg overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-500">

              <BeforeAfterSlider
                beforeImg={review.beforeImgLocal || review.beforeImg || "https://via.placeholder.com/400x300?text=Hazirlaniyor"}
                afterImg={review.afterImgLocal || review.afterImg || "https://via.placeholder.com/400x300?text=Hazirlaniyor"}
              />

              <div className="p-6 md:p-8 flex-1 flex flex-col relative bg-white">
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

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

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
    name: '', date: '', marble: 'white', headstone: 'classic', flowers: 'none', cemetery: '', ada: '', parsel: '', ilce: ''
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
    } catch { }
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
    if (!graveDesign.name || !graveDesign.ilce || !graveDesign.cemetery || graveDesign.cemetery.trim() === '') {
      showToast('Lütfen işleme devam etmeden önce İlçe dahil tüm bilgileri doldurun.', 'error');
      return;
    }
    setDrawerOpen(false);
    setTimeout(() => { setCheckoutOpen(true); }, 300);
  };

  const handlePaymentSuccess = async (pkgInfo) => {
    const siparisVerisi = {
      musteriAdi: currentUser?.displayName || 'Değerli Üyemiz',
      musteriTelefon: currentUser?.phone || 'Müşteri Profilden Alınacak',
      musteriEmail: currentUser?.email || 'Bilinmiyor',
      ilce: graveDesign.ilce,
      mezarlikAdi: graveDesign.cemetery,
      ada: graveDesign.ada,
      parsel: graveDesign.parsel,
      mezarBaslikIsmi: graveDesign.name,
      hizmetTipi: pkgInfo?.title || 'Özel Sipariş',
      toplamFiyat: Number(currentPriceDetails.total)
    };

    try {
      const response = await fetch('http://localhost:5001/api/siparis-olustur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siparisVerisi)
      });

      const data = await response.json();

      if (data.basarili) {
        setAdminFinance(prev => ({
          revenue: Number(prev.revenue) + Number(currentPriceDetails.total),
          cut: Number(prev.cut) + (Number(currentPriceDetails.total) * 0.2)
        }));

        setCheckoutOpen(false);
        navigate('/hesabim');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        showToast(
          data.esnaf !== "Atama Bekleniyor"
            ? `Siparişiniz başarıyla alındı ve ${data.esnaf} adlı ustaya atandı!`
            : 'Siparişiniz alındı, sistem uygun usta ataması yapıyor.',
          'success'
        );
      } else {
        showToast(`Sipariş Hatası: ${data.hata || data.mesaj}`, 'error');
      }
    } catch (error) {
      console.error("Sipariş kaydedilemedi:", error);
      showToast('Sunucuya ulaşılamadı. Lütfen arka planda Backend motorunun (Port 5001) açık olduğundan emin olun.', 'error');
    }
  };

  const updateOrderStatus = async (orderId, newStatus, updates = {}) => { };

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
      <div className="min-h-screen bg-[#F8F6F0] p-6 md:p-12 flex flex-col pt-32">
        <div className="max-w-4xl mx-auto w-full space-y-8 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-10 w-48 bg-[#134B36]/10 rounded-xl"></div>
            <div className="h-10 w-10 bg-[#134B36]/10 rounded-full"></div>
          </div>
          <div className="h-64 w-full bg-[#134B36]/5 border border-[#134B36]/10 rounded-[2.5rem]"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-[#134B36]/5 border border-[#134B36]/10 rounded-[2rem]"></div>
            <div className="h-40 bg-[#134B36]/5 border border-[#134B36]/10 rounded-[2rem]"></div>
            <div className="h-40 bg-[#134B36]/5 border border-[#134B36]/10 rounded-[2rem]"></div>
          </div>
        </div>
      </div>
    );
  }

  const Footer = () => (
    <footer id="footer" className="py-20 text-center border-t border-[#134B36]/10 opacity-70 hover:opacity-100 transition-opacity duration-500 flex flex-col items-center gap-6 bg-[#F8F6F0] relative z-10">
      <p className="text-[10px] tracking-[0.8em] font-black uppercase text-[#134B36]">VEFA • 2026</p>
      <div className="flex flex-wrap justify-center gap-4">

        {/* Footer'dan Harita Butonunu Kaldırdık (Navbar'a taşıdık) */}

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
    <div className="min-h-screen relative selection:bg-[#134B36] selection:text-white overflow-hidden pb-20 md:pb-0">
      <div className="premium-bg" />
      <div className="aura" />

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      {location.pathname !== '/admin' && location.pathname !== '/esnaf' && location.pathname !== '/operasyon-haritasi' && (
        <Navbar onOpenAuth={handleOpenAuth} isLoggedIn={isLoggedIn} user={currentUser} onLogout={handleLogout} />
      )}

      <Routes>
        <Route path="/hesabim" element={isLoggedIn ? <div className="pt-28 md:pt-32"><UserDashboard globalOrders={globalOrders} user={currentUser} onLogout={handleLogout} /></div> : <Navigate to="/" />} />
        <Route path="/esnaf" element={(isLoggedIn && (currentUser?.role === 'partner' || currentUser?.role === 'admin')) ? <div className="pt-28 md:pt-32"><PartnerDashboard onLogout={() => navigate('/')} globalOrders={globalOrders} updateOrderStatus={updateOrderStatus} partnerBalance={partnerBalance} user={currentUser} /></div> : <Navigate to="/" />} />
        <Route path="/admin" element={(isLoggedIn && currentUser?.role === 'admin') ? <AdminDashboard onLogout={() => navigate('/')} globalOrders={globalOrders} adminFinance={adminFinance} updateOrderStatus={updateOrderStatus} cityDemands={cityDemands} /> : <Navigate to="/" />} />

        <Route path="/hizmetler" element={<div className="pt-32"><ServicesPage onSelectPackage={handleSelectPackage} /><Footer /></div>} />
        <Route path="/surec" element={<div className="pt-32"><ProcessPage graveDesign={graveDesign} setGraveDesign={setGraveDesign} /><Footer /></div>} />
        <Route path="/kurumsal" element={<div className="pt-32"><CorporatePage /><Footer /></div>} />
        <Route path="/esnaf-basvuru" element={<div className="pt-32"><PartnerApplication /><Footer /></div>} />

        <Route path="/bolgelerimiz" element={<><CemeteryMapPublic /><Footer /></>} />
        <Route path="/operasyon-haritasi" element={(isLoggedIn && currentUser?.role === 'admin') ? <CemeteryMapDashboard /> : <Navigate to="/" />} />

        <Route path="/" element={
          <>
            <main className="relative z-10">

              <header className="relative max-w-[1440px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-16 min-h-[85vh] flex flex-col justify-center">
                <div className="relative border border-[#134B36]/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 text-center bg-white/80 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="absolute top-0 left-0 w-24 md:w-32 h-24 md:h-32 border-t border-l border-[#134B36]/20 rounded-tl-[2.5rem] md:rounded-tl-[3rem]"></div>
                  <div className="absolute bottom-0 right-0 w-24 md:w-32 h-24 md:h-32 border-b border-r border-[#134B36]/20 rounded-br-[2.5rem] md:rounded-br-[3rem]"></div>

                  <div className="relative z-10 max-w-4xl mx-auto space-y-8 md:space-y-10">
                    <div className="inline-flex items-center gap-3 px-4 md:px-5 py-2 rounded-full border border-[#134B36]/10 bg-white shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-[#134B36]">Online Mezar Bakım Sistemi</span>
                    </div>

                    <h1 className="text-4xl md:text-[5.5rem] font-serif font-medium text-[#134B36] leading-[1.15] tracking-tight">
                      Sevdiklerinizin emaneti, <br /><span className="italic text-[#C9A84C] font-normal">bize emanet.</span>
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pt-2 pb-4">
                      <span className="flex items-center gap-2 text-xs md:text-sm font-medium text-[#134B36]/80"><CheckCircle size={16} className="text-[#C9A84C]" /> Güvenilir Saha Ekibi</span>
                      <span className="flex items-center gap-2 text-xs md:text-sm font-medium text-[#134B36]/80"><CheckCircle size={16} className="text-[#C9A84C]" /> Öncesi/Sonrası Fotoğraf</span>
                      <span className="flex items-center gap-2 text-xs md:text-sm font-medium text-[#134B36]/80"><CheckCircle size={16} className="text-[#C9A84C]" /> Tam Zamanında Teslim</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4">
                      <button
                        onClick={() => {
                          const atolye = document.getElementById('atolye-section');
                          if (atolye) atolye.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="bg-[#134B36] text-[#F8F6F0] px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-full text-sm font-bold shadow-xl hover:bg-[#0B2E21] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3"
                      >
                        Hemen Sipariş Oluştur
                        <ChevronDown size={18} className="animate-bounce text-[#C9A84C]" />
                      </button>

                      <button onClick={() => navigate('/hizmetler')} className="bg-white border border-[#134B36]/20 text-[#134B36] px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-full text-sm font-bold hover:bg-[#F8F6F0] hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
                        Paketleri İncele
                      </button>
                    </div>
                  </div>
                </div>
              </header>

              <section className="py-20 md:py-32 bg-[#F8F6F0] relative z-20">
                <HowItWorks />
              </section>

              <section id="atolye-section" className="py-20 md:py-32 scroll-mt-24">
                <VefaAtolyesi graveDesign={graveDesign} setGraveDesign={setGraveDesign} />
              </section>

              <Testimonials globalOrders={globalOrders} />

              <section className="py-20 md:py-32 scroll-mt-24 relative">
                <CemeterySearch onOpenDemand={() => setDemandOpen(true)} />

                {/* YENİ: ANA SAYFADAN HARİTAYA GEÇİŞ BUTONU */}
                <div className="mt-12 flex justify-center px-6">
                  <button
                    onClick={() => {
                      navigate('/bolgelerimiz');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full md:w-auto bg-white border-2 border-[#C9A84C] text-[#134B36] px-10 py-5 rounded-full font-bold text-lg hover:bg-[#C9A84C] hover:text-[#0d1a10] transition-all flex items-center justify-center gap-3 shadow-lg"
                  >
                    <MapPin size={24} /> İstanbul Hizmet Haritasını Keşfet
                  </button>
                </div>
              </section>

              <section id="packages-section" className="max-w-[1440px] mx-auto px-6 md:px-24 pb-32 md:pb-48 scroll-mt-24">
                <div className="mb-16 md:mb-20 text-center">
                  <h2 className="text-4xl md:text-5xl font-serif text-[#134B36] tracking-tight">Hizmet Paketlerimiz</h2>
                  <div className="h-1 w-16 md:w-20 bg-[#134B36]/20 mt-6 mx-auto rounded-full" />
                </div>
                <Packages onSelect={handleSelectPackage} />
              </section>

            </main>

            <Footer />
          </>
        } />
      </Routes>

      {location.pathname !== '/admin' && location.pathname !== '/esnaf' && location.pathname !== '/operasyon-haritasi' && (
        <MobileBottomNav onOpenAuth={handleOpenAuth} isLoggedIn={isLoggedIn} />
      )}

      {showInstallBanner && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in slide-in-from-bottom-10 duration-700">
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
              <input type="text" placeholder="Hangi Şehir?" value={demandInput.city} onChange={(e) => setDemandInput({ ...demandInput, city: e.target.value })} className="w-full p-6 bg-white border border-[#134B36]/10 text-[#1a1c19] rounded-2xl outline-none focus:border-[#C9A84C] transition-all" />
              <input type="email" placeholder="E-posta Adresiniz" value={demandInput.email} onChange={(e) => setDemandInput({ ...demandInput, email: e.target.value })} className="w-full p-6 bg-white border border-[#134B36]/10 text-[#1a1c19] rounded-2xl outline-none focus:border-[#C9A84C] transition-all" />
            </div>
            <button onClick={handleDemandSubmit} className="w-full py-6 bg-[#134B36] text-[#F8F6F0] rounded-[1.5rem] font-bold hover:bg-[#0B2E21] hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">Talebi Gönder</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function VefaApp() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}