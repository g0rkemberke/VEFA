import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth'; // YENİ: sendEmailVerification ve signOut eklendi
import { doc, setDoc, getDoc } from 'firebase/firestore'; 

const AuthModal = ({ isOpen, onClose, initialView = 'login', onLoginSuccess }) => {
  const [view, setView] = useState(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // YENİ: Başarı mesajı state'i

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setErrorMsg('');
      setSuccessMsg('');
      setEmail('');
      setPassword('');
      setName('');
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (view === 'register') {
        // 1. Firebase Auth'a Kayıt
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // 2. Auth Profilini Güncelle
        await updateProfile(user, { displayName: name });

        // 3. Firestore 'users' koleksiyonuna Rol ile kaydet
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          role: 'customer', 
          createdAt: new Date().toISOString()
        });

        // YENİ: 4. Doğrulama maili gönder ve kullanıcıyı sistemden at
        await sendEmailVerification(user);
        await signOut(auth);

        // 5. Müşteriye bilgi ver ve giriş ekranına yönlendir
        setSuccessMsg('Kayıt başarılı! Lütfen e-posta adresinize (veya spam klasörüne) gelen doğrulama linkine tıklayın.');
        setEmail('');
        setPassword('');
        setName('');
        
        // 3 saniye sonra kullanıcıyı giriş ekranına atalım
        setTimeout(() => {
          setView('login');
          setSuccessMsg('');
        }, 4000);
        
      } else {
        // GİRİŞ (LOGIN) İŞLEMİ
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // YENİ: KRİTİK KONTROL - Mail doğrulanmış mı?
        if (!user.emailVerified) {
          await signOut(auth); // Doğrulamadıysa zorla çıkış yaptır
          setErrorMsg('Giriş yapabilmek için lütfen önce e-posta adresinize gönderdiğimiz doğrulama linkine tıklayın.');
          setIsLoading(false);
          return; // İşlemi burada kes
        }

        // Giriş yapan kullanıcının rolünü Firestore'dan çek
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let userRole = 'customer'; 
        if (userDocSnap.exists()) {
          userRole = userDocSnap.data().role || 'customer';
        } else {
           await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              name: user.displayName || 'Üye',
              email: user.email,
              role: 'customer',
              createdAt: new Date().toISOString()
           });
        }

        // Başarılı dönüş (Kullanıcı objesine rolü ekleyerek)
        onLoginSuccess({ ...user, role: userRole });
      }
    } catch (error) {
      console.error("Firebase Auth Hatası:", error);
      if (error.code === 'auth/email-already-in-use') setErrorMsg('Bu e-posta adresi zaten kullanılıyor.');
      else if (error.code === 'auth/invalid-credential') setErrorMsg('E-posta veya şifre hatalı.');
      else if (error.code === 'auth/weak-password') setErrorMsg('Şifreniz en az 6 karakter olmalıdır.');
      else setErrorMsg('Bir hata oluştu. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0d1a10]/60 backdrop-blur-md transition-all duration-500">
      <div className="bg-[#f8f6f0] rounded-[2.5rem] w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden border border-[#C9A84C]/20">
        
        <button 
          onClick={onClose} 
          disabled={isLoading}
          className="absolute top-6 right-6 text-[#134B36]/40 hover:text-[#134B36] transition-colors z-10 disabled:opacity-0"
        >
          <X size={24} />
        </button>

        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-[#134B36] mb-2">
              {view === 'login' ? 'Hoş Geldiniz' : 'Hesap Oluşturun'}
            </h2>
            <p className="text-sm text-[#134B36]/60">
              {view === 'login' 
                ? 'Sisteme giriş yaparak emanetlerinizi takip edin.' 
                : 'Vefa ailesine katılarak sevdiklerinizin bakımını güvenceye alın.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in fade-in">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
            </div>
          )}

          {/* YENİ: Başarı Mesajı Alanı */}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3 animate-in fade-in">
              <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 font-medium">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {view === 'register' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-[#134B36]/40" />
                </div>
                <input 
                  type="text" 
                  required
                  disabled={isLoading}
                  placeholder="Ad Soyad" 
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrorMsg(''); setSuccessMsg(''); }}
                  className="w-full pl-11 pr-4 py-4 bg-white border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all text-[#1a1c19] placeholder:text-[#134B36]/30 disabled:opacity-60"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-[#134B36]/40" />
              </div>
              <input 
                type="email" 
                required
                disabled={isLoading}
                placeholder="E-posta Adresi" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); setSuccessMsg(''); }}
                className="w-full pl-11 pr-4 py-4 bg-white border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all text-[#1a1c19] placeholder:text-[#134B36]/30 disabled:opacity-60"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-[#134B36]/40" />
              </div>
              <input 
                type="password" 
                required
                minLength="6"
                disabled={isLoading}
                placeholder="Şifre" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); setSuccessMsg(''); }}
                className="w-full pl-11 pr-4 py-4 bg-white border border-[#134B36]/10 rounded-2xl outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all text-[#1a1c19] placeholder:text-[#134B36]/30 disabled:opacity-60"
              />
            </div>

            {view === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs font-bold text-[#C9A84C] hover:text-[#8B6914] transition-colors">
                  Şifremi Unuttum
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 mt-2 bg-[#134B36] text-[#f8f6f0] rounded-2xl font-bold hover:bg-[#0B2E21] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <>İşleniyor <Loader2 size={18} className="animate-spin" /></>
              ) : (
                <>{view === 'login' ? 'Giriş Yap' : 'Kayıt Ol'} <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#134B36]/10 pt-6">
            <p className="text-sm text-[#1a1c19]/60">
              {view === 'login' ? "Henüz hesabınız yok mu?" : "Zaten hesabınız var mı?"}
              <button 
                onClick={() => { setView(view === 'login' ? 'register' : 'login'); setErrorMsg(''); setSuccessMsg(''); }}
                className="ml-2 font-bold text-[#C9A84C] hover:text-[#8B6914] transition-colors"
              >
                {view === 'login' ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;