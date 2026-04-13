import React, { useState } from 'react';

const BackendTest = () => {
    const [sonuc, setSonuc] = useState("");

    const sahteSiparisGonder = async () => {
        setSonuc("Sipariş gönderiliyor, algoritma çalışıyor...");

        // Sahte Müşteri Verisi
        const siparisVerisi = {
            musteriAdi: "Görkem Berke",
            ilce: "Şişli", // Şişli seçtik ki Ahmet veya Cemal ustaya gitsin
            mezarlikAdi: "Zincirlikuyu Mezarlığı",
            ada: "4",
            parsel: "12B",
            mezarBaslikIsmi: "Merhum Mehmet Yılmaz",
            hizmetTipi: "Aylık Standart Bakım"
        };

        try {
            const response = await fetch('http://127.0.0.1:5001/api/siparis-olustur', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(siparisVerisi)
            });

            const data = await response.json();

            if (data.basarili) {
                setSonuc(`✅ BAŞARILI! Sipariş ID: ${data.siparisId} | Atanan Usta: ${data.esnaf}`);
            } else {
                setSonuc(`❌ HATA: ${data.mesaj}`);
            }
        } catch (error) {
            setSonuc("❌ Sunucuya bağlanılamadı. Backend (5000 portu) açık mı?");
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto mt-10 bg-gray-100 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🧪 Backend Test Paneli</h2>
            <p className="text-sm text-gray-600 mb-6">Bu buton, "Şişli" ilçesi için bir sahte sipariş fırlatır ve algoritmanın hangi esnafı seçeceğini test eder.</p>

            <button
                onClick={sahteSiparisGonder}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition"
            >
                🚀 Sahte Sipariş Fırlat
            </button>

            {sonuc && (
                <div className="mt-6 p-4 bg-white border border-gray-300 rounded font-mono text-sm text-gray-700">
                    {sonuc}
                </div>
            )}
        </div>
    );
};

export default BackendTest;