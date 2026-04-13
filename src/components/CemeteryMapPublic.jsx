import React, { useState } from 'react';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { ISTANBUL_MAP_DATA } from './utils/cemeteryData';
import { useNavigate } from 'react-router-dom';

// Harita Kütüphaneleri
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet İkon Düzeltmesi
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Arama yapıldığında haritayı o noktaya uçuran akıllı bileşen
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.flyTo(center, zoom, { duration: 1.5 });
    return null;
}

const CemeteryMapPublic = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeLocation, setActiveLocation] = useState(null);

    // Haritanın varsayılan merkezi (İstanbul'un tam ortası)
    const defaultCenter = [41.0082, 28.9784];
    const defaultZoom = 10;

    // Arama filtresi
    const filteredData = ISTANBUL_MAP_DATA.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLocationSelect = (loc) => {
        setActiveLocation([loc.lat, loc.lng]);
        // Mobilde tıklanınca haritanın olduğu yere yumuşak kaydırma
        window.scrollTo({ top: 250, behavior: 'smooth' });
    };

    const handleOrderRedirect = () => {
        navigate('/');
        setTimeout(() => {
            const atolye = document.getElementById('atolye-section');
            if (atolye) atolye.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    };

    return (
        <div className="min-h-screen bg-[#F8F6F0] pt-24 md:pt-32 pb-24 font-sans relative z-10">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">

                {/* ÜST BAŞLIK VE ARAMA */}
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-3 md:mb-4 block">İnteraktif Operasyon Ağı</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-[#134B36] tracking-tight mb-4 md:mb-6">Canlı Hizmet Haritası</h1>
                    <p className="text-[#134B36]/70 text-sm md:text-lg mb-8 md:mb-10 px-2">Harita üzerinde gezinin, size en yakın mezarlığı seçin ve anında bakım talep edin.</p>

                    <div className="relative max-w-xl mx-auto shadow-xl md:shadow-2xl rounded-full overflow-hidden border-2 border-white bg-white">
                        <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
                            <Search className="text-[#134B36]/40" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Mezarlık veya İlçe Ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-4 md:py-5 bg-transparent outline-none text-sm md:text-base text-[#134B36] font-medium placeholder:text-[#134B36]/30"
                        />
                    </div>
                </div>

                {/* HARİTA VE LİSTE BÖLÜMÜ - MOBİL İÇİN YENİDEN TASARLANDI */}
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:h-[600px]">

                    {/* SAĞ TARAFTAKİ GERÇEK İNTERAKTİF HARİTA (Mobilde ÜSTTE görünmesi için order-1 verildi) */}
                    <div className="w-full lg:w-2/3 h-[400px] lg:h-full bg-white rounded-[2rem] md:rounded-[2.5rem] border border-[#134B36]/10 shadow-[0_10px_40px_rgba(19,75,54,0.05)] overflow-hidden relative z-0 order-1 lg:order-2">
                        <MapContainer
                            center={defaultCenter}
                            zoom={defaultZoom}
                            style={{ width: '100%', height: '100%', zIndex: 1 }}
                            scrollWheelZoom={true}
                            attributionControl={false} /* 🪄 İŞTE SİHİRLİ KOD BU: Linkleri tamamen yok eder */
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            /* attribution satırını da tamamen siliyoruz */
                            />

                            <ChangeView center={activeLocation || defaultCenter} zoom={activeLocation ? 14 : defaultZoom} />

                            {filteredData.map(loc => (
                                <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                                    <Popup className="vefa-popup">
                                        <div className="text-center p-1 min-w-[120px]">
                                            <span className="text-[9px] uppercase font-black tracking-widest text-[#C9A84C]">{loc.district}</span>
                                            <h4 className="font-bold text-[#134B36] text-[13px] my-1.5 leading-tight">{loc.name}</h4>
                                            <button onClick={handleOrderRedirect} className="mt-2 text-[11px] font-bold bg-[#134B36] text-white px-3 py-2 rounded-lg w-full hover:bg-[#0B2E21] transition-colors shadow-md active:scale-95">
                                                Sipariş Ver
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>

                    {/* SOL TARAFTAKİ LİSTE (Mobilde ALTTA görünmesi için order-2 verildi) */}
                    <div className="w-full lg:w-1/3 h-[400px] lg:h-full bg-white rounded-[2rem] md:rounded-[2.5rem] border border-[#134B36]/10 shadow-[0_10px_40px_rgba(19,75,54,0.05)] overflow-hidden flex flex-col order-2 lg:order-1">
                        <div className="p-5 md:p-6 border-b border-[#134B36]/5 bg-[#F8F6F0]">
                            <h3 className="font-serif text-[#134B36] text-lg md:text-xl font-bold flex items-center gap-2">
                                <MapPin size={20} className="text-[#C9A84C]" /> Kayıtlı Lokasyonlar
                            </h3>
                            <p className="text-[11px] md:text-xs text-[#134B36]/60 mt-1.5">İstanbul genelinde <strong>{filteredData.length}</strong> aktif mezarlık bulundu</p>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                            {filteredData.length === 0 ? (
                                <div className="text-center text-[#134B36]/50 py-10 text-sm">Aradığınız kriterde mezarlık bulunamadı.</div>
                            ) : (
                                filteredData.map(loc => (
                                    <div
                                        key={loc.id}
                                        onClick={() => handleLocationSelect(loc)}
                                        className="p-4 md:p-5 rounded-2xl border border-[#134B36]/5 hover:border-[#C9A84C]/50 hover:bg-[#F8F6F0] cursor-pointer transition-all group shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[9px] font-black text-[#134B36]/40 uppercase tracking-widest mb-1">{loc.district}</p>
                                                <h4 className="font-bold text-[#134B36] text-sm group-hover:text-[#C9A84C] transition-colors pr-2">{loc.name}</h4>
                                            </div>
                                            <ChevronRight size={16} className="text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                        </div>
                                        <p className="text-[10px] md:text-xs text-[#134B36]/60 mt-2 font-medium bg-white inline-block px-2 py-1 rounded-md border border-[#134B36]/5">
                                            Desteklenen: {loc.package}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CemeteryMapPublic;