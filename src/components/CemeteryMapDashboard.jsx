import React from 'react';
import { ISTANBUL_MEZARLIKLARI } from './utils/cemeteryData';
import { Map, Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CemeteryMapDashboard = () => {
    const navigate = useNavigate();
    const ilceler = Object.keys(ISTANBUL_MEZARLIKLARI).sort();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#F8F6F0] font-sans pb-20">
            <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-map-area, #print-map-area * { visibility: visible; }
          #print-map-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          .print-hide { display: none !important; }
          .ilce-card { page-break-inside: avoid; border: 1px solid #ddd !important; box-shadow: none !important; }
        }
      `}</style>

            <div className="bg-[#134B36] text-white px-8 py-6 sticky top-0 z-50 shadow-md print-hide flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-serif tracking-widest text-[#C9A84C]">VEFA OPERASYON HARİTASI</h1>
                        <p className="text-[10px] uppercase tracking-widest opacity-70 mt-1">İlçe ve Mezarlık Kapsama Matrisi</p>
                    </div>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-[#C9A84C] text-[#0d1a10] px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
                >
                    <Printer size={18} /> Büyük Çıktı Al
                </button>
            </div>

            <div id="print-map-area" className="max-w-[1600px] mx-auto p-8 pt-12">
                <div className="hidden print:block text-center mb-10 border-b-4 border-[#134B36] pb-6">
                    <h1 className="text-4xl font-serif text-[#134B36] tracking-widest">VEFA LOKASYON VE OPERASYON HARİTASI</h1>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">Güncel Kapsama Alanı: İstanbul ({ilceler.length} İlçe)</p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {ilceler.map((ilce) => (
                        <div key={ilce} className="ilce-card break-inside-avoid bg-white rounded-3xl p-6 shadow-sm border border-[#134B36]/10 hover:border-[#C9A84C]/50 transition-colors">
                            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                                <div className="bg-[#134B36]/10 p-2.5 rounded-full text-[#134B36] print-hide">
                                    <Map size={20} />
                                </div>
                                <h2 className="text-xl font-serif text-[#134B36] font-bold">{ilce}</h2>
                                <span className="ml-auto bg-[#F8F6F0] text-[#134B36]/60 text-[10px] font-black uppercase px-2 py-1 rounded-full border border-gray-200">
                                    {ISTANBUL_MEZARLIKLARI[ilce].length} Mezar
                                </span>
                            </div>
                            <ul className="space-y-2.5">
                                {ISTANBUL_MEZARLIKLARI[ilce].map((mezarlik, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm font-medium text-[#1a1c19]/80">
                                        <span className="text-[#C9A84C] mt-0.5">•</span>
                                        {mezarlik}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center text-xs text-gray-400 uppercase tracking-widest font-bold border-t border-gray-200 pt-6">
                    VefaApp Operasyon Yönetim Sistemi - {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
};

export default CemeteryMapDashboard;