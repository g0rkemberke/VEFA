import React, { useState } from 'react';
import { Search, MapPin, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const CEMETERIES_DATA = [{ id: 101, district: "Beşiktaş", city: 'İstanbul', name: "Aşiyan Mezarlığı", lat: 41.0825, lng: 29.0560, package: "Tüm Paketler", inService: true },
{ id: 102, district: "Beşiktaş", name: "Ortaköy Mezarlığı", city: 'İstanbul', lat: 41.0530, lng: 29.0190, package: "Standart / Premium", inService: true },
{ id: 103, district: "Beşiktaş", name: "Ulus Mezarlığı", city: 'İstanbul', lat: 41.0620, lng: 29.0310, package: "Tüm Paketler", inService: true },
{ id: 104, district: "Beşiktaş", name: "Bebek Mezarlığı", city: 'İstanbul', lat: 41.0770, lng: 29.0410, package: "Premium / VIP", inService: true },

// ÜSKÜDAR
{ id: 201, district: "Üsküdar", name: "Karacaahmet Mezarlığı", city: 'İstanbul', lat: 41.0115, lng: 29.0234, package: "Tüm Paketler", inService: true },
{ id: 202, district: "Üsküdar", name: "Nakkaştepe Mezarlığı", city: 'İstanbul', lat: 41.0360, lng: 29.0410, package: "Tüm Paketler", inService: true },
{ id: 203, district: "Üsküdar", name: "Çengelköy Mezarlığı", city: 'İstanbul', lat: 41.0470, lng: 29.0620, package: "Standart / Premium", inService: true },
{ id: 204, district: "Üsküdar", name: "Bülbülderesi Mezarlığı", city: 'İstanbul', lat: 41.0210, lng: 29.0180, package: "Standart", inService: true },
{ id: 205, district: "Üsküdar", name: "Kandilli Mezarlığı", city: 'İstanbul', lat: 41.0720, lng: 29.0580, package: "Premium", inService: true },

// ŞİŞLİ
{ id: 301, district: "Şişli", name: "Zincirlikuyu Mezarlığı", city: 'İstanbul', lat: 41.0740, lng: 29.0080, package: "Tüm Paketler", inService: true },
{ id: 302, district: "Şişli", name: "Feriköy Mezarlığı", city: 'İstanbul', lat: 41.0550, lng: 28.9860, package: "Standart / Premium", inService: true },
{ id: 303, district: "Şişli", name: "Ayazağa Asri Mezarlığı", city: 'İstanbul', lat: 41.1140, lng: 28.9950, package: "Tüm Paketler", inService: true },

// EYÜPSULTAN
{ id: 401, district: "Eyüpsultan", name: "Edirnekapı Şehitliği", city: 'İstanbul', lat: 41.0333, lng: 28.9333, package: "Tüm Paketler", inService: true },
{ id: 402, district: "Eyüpsultan", name: "Pierre Loti Mezarlığı", city: 'İstanbul', lat: 41.0535, lng: 28.9341, package: "Tüm Paketler", inService: true },
{ id: 403, district: "Eyüpsultan", name: "Alibeyköy Mezarlığı", city: 'İstanbul', lat: 41.0720, lng: 28.9410, package: "Standart", inService: true },
{ id: 404, district: "Eyüpsultan", name: "Hasdal Mezarlığı", city: 'İstanbul', lat: 41.0960, lng: 28.9550, package: "Premium", inService: true },

// FATİH
{ id: 501, district: "Fatih", name: "Kozlu Mezarlığı", city: 'İstanbul', lat: 41.0150, lng: 28.9180, package: "Tüm Paketler", inService: true },
{ id: 502, district: "Fatih", name: "Topkapı Mezarlığı", city: 'İstanbul', lat: 41.0190, lng: 28.9240, package: "Standart / Premium", inService: true },
{ id: 503, district: "Fatih", name: "Silivrikapı Mezarlığı", city: 'İstanbul', lat: 41.0080, lng: 28.9150, package: "Standart", inService: true },

// KADIKÖY
{ id: 601, district: "Kadıköy", name: "Sahrayıcedit Mezarlığı", city: 'İstanbul', lat: 40.9830, lng: 29.0750, package: "Tüm Paketler", inService: true },
{ id: 602, district: "Kadıköy", name: "Merdivenköy Mezarlığı", city: 'İstanbul', lat: 40.9930, lng: 29.0780, package: "Standart / Premium", inService: true },
{ id: 603, district: "Kadıköy", name: "Erenköy Mezarlığı", city: 'İstanbul', lat: 40.9760, lng: 29.0850, package: "Premium", inService: true },

// BEYKOZ
{ id: 701, district: "Beykoz", name: "Kanlıca Mezarlığı", city: 'İstanbul', lat: 41.0950, lng: 29.0620, package: "Premium / VIP", inService: true },
{ id: 702, district: "Beykoz", name: "Çubuklu Mezarlığı", city: 'İstanbul', lat: 41.1070, lng: 29.0760, package: "Standart", inService: true },
{ id: 703, district: "Beykoz", name: "Anadolu Kavağı Mezarlığı", city: 'İstanbul', lat: 41.1730, lng: 29.0880, package: "Özel Hizmet", inService: true },

// SARIYER
{ id: 801, district: "Sarıyer", name: "Kilyos Mezarlığı", city: 'İstanbul', lat: 41.2420, lng: 29.0300, package: "Tüm Paketler", inService: true },
{ id: 802, district: "Sarıyer", name: "Yeniköy Mezarlığı", city: 'İstanbul', lat: 41.1210, lng: 29.0680, package: "Tüm Paketler", inService: true },
{ id: 803, district: "Sarıyer", name: "Emirgan Mezarlığı", city: 'İstanbul', lat: 41.1075, lng: 29.0490, package: "Premium", inService: true },

// BAKIRKÖY
{ id: 901, district: "Bakırköy", name: "Bakırköy Mezarlığı", city: 'İstanbul', lat: 40.9850, lng: 28.8750, package: "Tüm Paketler", inService: true },
{ id: 902, district: "Bakırköy", name: "Zuhuratbaba Mezarlığı", city: 'İstanbul', lat: 40.9880, lng: 28.8680, package: "Premium / VIP", inService: true },
{ id: 903, district: "Bakırköy", name: "Florya Mezarlığı", city: 'İstanbul', lat: 40.9750, lng: 28.7990, package: "VIP", inService: true },

// MALTEPE
{ id: 1001, district: "Maltepe", name: "Gülsuyu Mezarlığı", city: 'İstanbul', lat: 40.9250, lng: 29.1550, package: "Standart / Premium", inService: true },
{ id: 1002, district: "Maltepe", name: "Başıbüyük Mezarlığı", city: 'İstanbul', lat: 40.9480, lng: 29.1420, package: "Standart", inService: true },

// PENDİK
{ id: 1101, district: "Pendik", name: "Pendik Merkez Mezarlığı", city: 'İstanbul', lat: 40.8850, lng: 29.2320, package: "Tüm Paketler", inService: true },
{ id: 1102, district: "Pendik", name: "Dolayoba Mezarlığı", city: 'İstanbul', lat: 40.8900, lng: 29.2500, package: "Standart", inService: true },
{ id: 1103, district: "Pendik", name: "Şeyhli Mezarlığı", city: 'İstanbul', lat: 40.9080, lng: 29.2830, package: "Standart", inService: true },

// ÜMRANİYE
{ id: 1201, district: "Ümraniye", name: "Ihlamurkuyu Mezarlığı", city: 'İstanbul', lat: 41.0250, lng: 29.1450, package: "Tüm Paketler", inService: true },
{ id: 1202, district: "Ümraniye", name: "Hekimbaşı Mezarlığı", city: 'İstanbul', lat: 41.0450, lng: 29.0980, package: "Standart", inService: true },
{ id: 1203, district: "Ümraniye", name: "Kocatepe Mezarlığı", city: 'İstanbul', lat: 41.0180, lng: 29.1220, package: "Premium", inService: true },

// ESENYURT
{ id: 1301, district: "Esenyurt", name: "Esenyurt Mezarlığı", city: 'İstanbul', lat: 41.0340, lng: 28.6780, package: "Standart", inService: true },
{ id: 1302, district: "Esenyurt", name: "Kıraç Mezarlığı", city: 'İstanbul', lat: 41.0580, lng: 28.6320, package: "Standart / Premium", inService: true },

// GAZİOSMANPAŞA
{ id: 1401, district: "Gaziosmanpaşa", name: "Küçükköy Mezarlığı", city: 'İstanbul', lat: 41.0850, lng: 28.9100, package: "Tüm Paketler", inService: true },
{ id: 1402, district: "Gaziosmanpaşa", name: "Karlıtepe Mezarlığı", city: 'İstanbul', lat: 41.0690, lng: 28.9280, package: "Standart", inService: true },
{ id: 1403, district: "Gaziosmanpaşa", name: "Beşyüzevler Mezarlığı", city: 'İstanbul', lat: 41.0810, lng: 28.8950, package: "Standart", inService: true },

// ADALAR
{ id: 1501, district: "Adalar", name: "Büyükada Mezarlığı", city: 'İstanbul', lat: 40.8650, lng: 29.1240, package: "Özel Paketler", inService: true },
{ id: 1502, district: "Adalar", name: "Heybeliada Mezarlığı", city: 'İstanbul', lat: 40.8760, lng: 29.0880, package: "Standart / Premium", inService: true },
{ id: 1503, district: "Adalar", name: "Burgazada Mezarlığı", city: 'İstanbul', lat: 40.8820, lng: 29.0660, package: "Özel Paketler", inService: true },

// ARNAVUTKÖY
{ id: 1601, district: "Arnavutköy", name: "Arnavutköy Asri Mezarlığı", city: 'İstanbul', lat: 41.1850, lng: 28.7420, package: "Standart", inService: true },
{ id: 1602, district: "Arnavutköy", name: "Hadımköy Mezarlığı", city: 'İstanbul', lat: 41.1550, lng: 28.6250, package: "Standart", inService: true },

// BÜYÜKÇEKMECE
{ id: 1701, district: "Büyükçekmece", name: "Büyükçekmece Yeni Mezarlık", city: 'İstanbul', lat: 41.0250, lng: 28.5850, package: "Standart", inService: true },
{ id: 1702, district: "Büyükçekmece", name: "Mimarsinan Mezarlığı", city: 'İstanbul', lat: 41.0020, lng: 28.5620, package: "Standart / Premium", inService: true },

// SİLİVRİ
{ id: 1801, district: "Silivri", name: "Silivri Yeni Mezarlığı", city: 'İstanbul', lat: 41.0780, lng: 28.2520, package: "Standart", inService: true },
{ id: 1802, district: "Silivri", name: "Selimpaşa Mezarlığı", city: 'İstanbul', lat: 41.0550, lng: 28.3650, package: "Standart", inService: true },

// KÜÇÜKÇEKMECE
{ id: 1901, district: "Küçükçekmece", name: "Kanarya Mezarlığı", city: 'İstanbul', lat: 41.0060, lng: 28.7750, package: "Standart", inService: true },
{ id: 1902, district: "Küçükçekmece", name: "Sefaköy Mezarlığı", city: 'İstanbul', lat: 41.0180, lng: 28.7960, package: "Standart / Premium", inService: true },

// BAĞCILAR
{ id: 2001, district: "Bağcılar", name: "Bağcılar Merkez Mezarlığı", city: 'İstanbul', lat: 41.0350, lng: 28.8550, package: "Tüm Paketler", inService: true },
{ id: 2002, district: "Bağcılar", name: "Kirazlı Mezarlığı", city: 'İstanbul', lat: 41.0280, lng: 28.8410, package: "Standart", inService: true },

// BEYLİKDÜZÜ
{ id: 2101, district: "Beylikdüzü", name: "Kavaklı Mezarlığı", city: 'İstanbul', lat: 40.9850, lng: 28.6450, package: "Standart", inService: true },
{ id: 2102, district: "Beylikdüzü", name: "Gürpınar Mezarlığı", city: 'İstanbul', lat: 40.9880, lng: 28.6120, package: "Standart / Premium", inService: true },

{ id: 10, name: 'Asri Mezarlık', city: 'İzmir', district: 'Konak', inService: false }
];

// YENİ: onOpenDemand prop'u eklendi
const CemeterySearch = ({ onOpenDemand }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCemeteries = CEMETERIES_DATA.filter(cemetery =>
    cemetery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cemetery.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cemetery.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
      <div className="mb-12 md:mb-16 md:text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-[#134B36] tracking-tight">Hizmet Bölgelerimiz</h2>
        <p className="text-sm md:text-base text-[#134B36]/60 mt-4 max-w-2xl md:mx-auto">
          Şu anda ağırlıklı olarak İstanbul bölgesinde hizmet vermekteyiz. Sevdiklerinizin istirahatgahının hizmet ağımızda olup olmadığını kontrol edin.
        </p>
        <div className="h-1 w-20 bg-[#C9A84C]/50 mt-6 md:mx-auto rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="relative group mb-10 shadow-2xl rounded-full">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-[#C9A84C] text-[#134B36]/40">
            <Search size={24} />
          </div>
          <input
            type="text"
            placeholder="Mezarlık adı, şehir veya ilçe arayın... (Örn: Zincirlikuyu, Ankara)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-6 bg-white border border-[#134B36]/10 rounded-full outline-none focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 transition-all text-[#1a1c19] text-lg placeholder:text-[#134B36]/30 shadow-sm"
          />
          <button className="absolute right-3 top-3 bottom-3 bg-[#134B36] text-[#F8F6F0] px-8 rounded-full font-bold hover:bg-[#0B2E21] transition-colors hidden sm:block">
            Sorgula
          </button>
        </div>

        <div className="bg-white rounded-[2rem] border border-[#134B36]/10 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 md:p-6 bg-[#F8F6F0] border-b border-[#134B36]/5 flex justify-between items-center">
            <span className="text-xs font-bold text-[#134B36]/60 uppercase tracking-widest">Arama Sonuçları</span>
            <span className="text-xs font-bold bg-[#134B36]/10 text-[#134B36] px-3 py-1 rounded-full">{filteredCemeteries.length} Mezarlık Bulundu</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto no-scrollbar p-2">
            {filteredCemeteries.length === 0 ? (
              <div className="p-10 text-center text-[#134B36]/50">
                <p className="text-lg mb-2 font-medium">Aradığınız kriterlere uygun mezarlık bulunamadı.</p>
                <p className="text-sm">Lütfen farklı bir kelime ile tekrar deneyin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 divide-y divide-[#134B36]/5">
                {filteredCemeteries.map((cemetery) => (
                  <div key={cemetery.id} className="p-4 md:p-6 hover:bg-[#F8F6F0]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-default">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full mt-1 shrink-0 transition-colors ${cemetery.inService ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-serif text-[#134B36]">{cemetery.name}</h4>
                        <p className="text-sm text-[#134B36]/60 mt-1">{cemetery.district}, {cemetery.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center sm:justify-end gap-3 sm:w-1/3">
                      {cemetery.inService ? (
                        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200 w-full sm:w-auto justify-center">
                          <CheckCircle size={16} />
                          <span className="text-xs font-bold tracking-wider">Hizmet Veriliyor</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-orange-700 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 w-full sm:w-auto justify-center">
                          <Clock size={16} />
                          <span className="text-xs font-bold tracking-wider">Çok Yakında</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* YENİ: Doğrudan Talep formunu açan buton */}
          <div className="p-4 bg-[#134B36]/5 border-t border-[#134B36]/10 text-center">
            <button onClick={onOpenDemand} className="text-sm font-bold text-[#134B36] hover:text-[#C9A84C] transition-colors flex items-center justify-center gap-2 w-full">
              Aradığınız mezarlığı bulamadınız mı? Şehir talebi oluşturun <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CemeterySearch;