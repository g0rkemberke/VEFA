// src/utils/cemeteryData.js

// 🌍 HARİTA ÜZERİNDEKİ PİNLER İÇİN GERÇEK GPS VERİSİ (DEV LİSTE)
export const ISTANBUL_MAP_DATA = [
    // BEŞİKTAŞ
    { id: 101, district: "Beşiktaş", name: "Aşiyan Mezarlığı", lat: 41.0825, lng: 29.0560, package: "Tüm Paketler" },
    { id: 102, district: "Beşiktaş", name: "Ortaköy Mezarlığı", lat: 41.0530, lng: 29.0190, package: "Standart / Premium" },
    { id: 103, district: "Beşiktaş", name: "Ulus Mezarlığı", lat: 41.0620, lng: 29.0310, package: "Tüm Paketler" },
    { id: 104, district: "Beşiktaş", name: "Bebek Mezarlığı", lat: 41.0770, lng: 29.0410, package: "Premium / VIP" },

    // ÜSKÜDAR
    { id: 201, district: "Üsküdar", name: "Karacaahmet Mezarlığı", lat: 41.0115, lng: 29.0234, package: "Tüm Paketler" },
    { id: 202, district: "Üsküdar", name: "Nakkaştepe Mezarlığı", lat: 41.0360, lng: 29.0410, package: "Tüm Paketler" },
    { id: 203, district: "Üsküdar", name: "Çengelköy Mezarlığı", lat: 41.0470, lng: 29.0620, package: "Standart / Premium" },
    { id: 204, district: "Üsküdar", name: "Bülbülderesi Mezarlığı", lat: 41.0210, lng: 29.0180, package: "Standart" },
    { id: 205, district: "Üsküdar", name: "Kandilli Mezarlığı", lat: 41.0720, lng: 29.0580, package: "Premium" },

    // ŞİŞLİ
    { id: 301, district: "Şişli", name: "Zincirlikuyu Mezarlığı", lat: 41.0740, lng: 29.0080, package: "Tüm Paketler" },
    { id: 302, district: "Şişli", name: "Feriköy Mezarlığı", lat: 41.0550, lng: 28.9860, package: "Standart / Premium" },
    { id: 303, district: "Şişli", name: "Ayazağa Asri Mezarlığı", lat: 41.1140, lng: 28.9950, package: "Tüm Paketler" },

    // EYÜPSULTAN
    { id: 401, district: "Eyüpsultan", name: "Edirnekapı Şehitliği", lat: 41.0333, lng: 28.9333, package: "Tüm Paketler" },
    { id: 402, district: "Eyüpsultan", name: "Pierre Loti Mezarlığı", lat: 41.0535, lng: 28.9341, package: "Tüm Paketler" },
    { id: 403, district: "Eyüpsultan", name: "Alibeyköy Mezarlığı", lat: 41.0720, lng: 28.9410, package: "Standart" },
    { id: 404, district: "Eyüpsultan", name: "Hasdal Mezarlığı", lat: 41.0960, lng: 28.9550, package: "Premium" },

    // FATİH
    { id: 501, district: "Fatih", name: "Kozlu Mezarlığı", lat: 41.0150, lng: 28.9180, package: "Tüm Paketler" },
    { id: 502, district: "Fatih", name: "Topkapı Mezarlığı", lat: 41.0190, lng: 28.9240, package: "Standart / Premium" },
    { id: 503, district: "Fatih", name: "Silivrikapı Mezarlığı", lat: 41.0080, lng: 28.9150, package: "Standart" },

    // KADIKÖY
    { id: 601, district: "Kadıköy", name: "Sahrayıcedit Mezarlığı", lat: 40.9830, lng: 29.0750, package: "Tüm Paketler" },
    { id: 602, district: "Kadıköy", name: "Merdivenköy Mezarlığı", lat: 40.9930, lng: 29.0780, package: "Standart / Premium" },
    { id: 603, district: "Kadıköy", name: "Erenköy Mezarlığı", lat: 40.9760, lng: 29.0850, package: "Premium" },

    // BEYKOZ
    { id: 701, district: "Beykoz", name: "Kanlıca Mezarlığı", lat: 41.0950, lng: 29.0620, package: "Premium / VIP" },
    { id: 702, district: "Beykoz", name: "Çubuklu Mezarlığı", lat: 41.1070, lng: 29.0760, package: "Standart" },
    { id: 703, district: "Beykoz", name: "Anadolu Kavağı Mezarlığı", lat: 41.1730, lng: 29.0880, package: "Özel Hizmet" },

    // SARIYER
    { id: 801, district: "Sarıyer", name: "Kilyos Mezarlığı", lat: 41.2420, lng: 29.0300, package: "Tüm Paketler" },
    { id: 802, district: "Sarıyer", name: "Yeniköy Mezarlığı", lat: 41.1210, lng: 29.0680, package: "Tüm Paketler" },
    { id: 803, district: "Sarıyer", name: "Emirgan Mezarlığı", lat: 41.1075, lng: 29.0490, package: "Premium" },

    // BAKIRKÖY
    { id: 901, district: "Bakırköy", name: "Bakırköy Mezarlığı", lat: 40.9850, lng: 28.8750, package: "Tüm Paketler" },
    { id: 902, district: "Bakırköy", name: "Zuhuratbaba Mezarlığı", lat: 40.9880, lng: 28.8680, package: "Premium / VIP" },
    { id: 903, district: "Bakırköy", name: "Florya Mezarlığı", lat: 40.9750, lng: 28.7990, package: "VIP" },

    // MALTEPE
    { id: 1001, district: "Maltepe", name: "Gülsuyu Mezarlığı", lat: 40.9250, lng: 29.1550, package: "Standart / Premium" },
    { id: 1002, district: "Maltepe", name: "Başıbüyük Mezarlığı", lat: 40.9480, lng: 29.1420, package: "Standart" },

    // PENDİK
    { id: 1101, district: "Pendik", name: "Pendik Merkez Mezarlığı", lat: 40.8850, lng: 29.2320, package: "Tüm Paketler" },
    { id: 1102, district: "Pendik", name: "Dolayoba Mezarlığı", lat: 40.8900, lng: 29.2500, package: "Standart" },
    { id: 1103, district: "Pendik", name: "Şeyhli Mezarlığı", lat: 40.9080, lng: 29.2830, package: "Standart" },

    // ÜMRANİYE
    { id: 1201, district: "Ümraniye", name: "Ihlamurkuyu Mezarlığı", lat: 41.0250, lng: 29.1450, package: "Tüm Paketler" },
    { id: 1202, district: "Ümraniye", name: "Hekimbaşı Mezarlığı", lat: 41.0450, lng: 29.0980, package: "Standart" },
    { id: 1203, district: "Ümraniye", name: "Kocatepe Mezarlığı", lat: 41.0180, lng: 29.1220, package: "Premium" },

    // ESENYURT
    { id: 1301, district: "Esenyurt", name: "Esenyurt Mezarlığı", lat: 41.0340, lng: 28.6780, package: "Standart" },
    { id: 1302, district: "Esenyurt", name: "Kıraç Mezarlığı", lat: 41.0580, lng: 28.6320, package: "Standart / Premium" },

    // GAZİOSMANPAŞA
    { id: 1401, district: "Gaziosmanpaşa", name: "Küçükköy Mezarlığı", lat: 41.0850, lng: 28.9100, package: "Tüm Paketler" },
    { id: 1402, district: "Gaziosmanpaşa", name: "Karlıtepe Mezarlığı", lat: 41.0690, lng: 28.9280, package: "Standart" },
    { id: 1403, district: "Gaziosmanpaşa", name: "Beşyüzevler Mezarlığı", lat: 41.0810, lng: 28.8950, package: "Standart" },

    // ADALAR
    { id: 1501, district: "Adalar", name: "Büyükada Mezarlığı", lat: 40.8650, lng: 29.1240, package: "Özel Paketler" },
    { id: 1502, district: "Adalar", name: "Heybeliada Mezarlığı", lat: 40.8760, lng: 29.0880, package: "Standart / Premium" },
    { id: 1503, district: "Adalar", name: "Burgazada Mezarlığı", lat: 40.8820, lng: 29.0660, package: "Özel Paketler" },

    // ARNAVUTKÖY
    { id: 1601, district: "Arnavutköy", name: "Arnavutköy Asri Mezarlığı", lat: 41.1850, lng: 28.7420, package: "Standart" },
    { id: 1602, district: "Arnavutköy", name: "Hadımköy Mezarlığı", lat: 41.1550, lng: 28.6250, package: "Standart" },

    // BÜYÜKÇEKMECE
    { id: 1701, district: "Büyükçekmece", name: "Büyükçekmece Yeni Mezarlık", lat: 41.0250, lng: 28.5850, package: "Standart" },
    { id: 1702, district: "Büyükçekmece", name: "Mimarsinan Mezarlığı", lat: 41.0020, lng: 28.5620, package: "Standart / Premium" },

    // SİLİVRİ
    { id: 1801, district: "Silivri", name: "Silivri Yeni Mezarlığı", lat: 41.0780, lng: 28.2520, package: "Standart" },
    { id: 1802, district: "Silivri", name: "Selimpaşa Mezarlığı", lat: 41.0550, lng: 28.3650, package: "Standart" },

    // KÜÇÜKÇEKMECE
    { id: 1901, district: "Küçükçekmece", name: "Kanarya Mezarlığı", lat: 41.0060, lng: 28.7750, package: "Standart" },
    { id: 1902, district: "Küçükçekmece", name: "Sefaköy Mezarlığı", lat: 41.0180, lng: 28.7960, package: "Standart / Premium" },

    // BAĞCILAR
    { id: 2001, district: "Bağcılar", name: "Bağcılar Merkez Mezarlığı", lat: 41.0350, lng: 28.8550, package: "Tüm Paketler" },
    { id: 2002, district: "Bağcılar", name: "Kirazlı Mezarlığı", lat: 41.0280, lng: 28.8410, package: "Standart" },

    // BEYLİKDÜZÜ
    { id: 2101, district: "Beylikdüzü", name: "Kavaklı Mezarlığı", lat: 40.9850, lng: 28.6450, package: "Standart" },
    { id: 2102, district: "Beylikdüzü", name: "Gürpınar Mezarlığı", lat: 40.9880, lng: 28.6120, package: "Standart / Premium" }
];

// 📋 DROPDOWN VE LİSTELER İÇİN GRUPLANMIŞ VERİ
export const ISTANBUL_MEZARLIKLARI = {
    "Adalar": ["Büyükada Mezarlığı", "Heybeliada Mezarlığı", "Burgazada Mezarlığı", "Kınalıada Mezarlığı"],
    "Arnavutköy": ["Arnavutköy Asri Mezarlığı", "Hadımköy Mezarlığı", "Taşoluk Mezarlığı"],
    "Ataşehir": ["İçerenköy Mezarlığı", "Ferhatpaşa Mezarlığı"],
    "Avcılar": ["Avcılar Merkez Mezarlığı", "Firuzköy Mezarlığı"],
    "Bağcılar": ["Bağcılar Merkez Mezarlığı", "Kirazlı Mezarlığı"],
    "Bahçelievler": ["Kocasinan Mezarlığı", "Yenibosna Mezarlığı"],
    "Bakırköy": ["Bakırköy Mezarlığı", "Zuhuratbaba Mezarlığı", "Florya Mezarlığı"],
    "Başakşehir": ["Kayabaşı Mezarlığı", "Altınşehir Mezarlığı"],
    "Bayrampaşa": ["Bayrampaşa Merkez Mezarlığı"],
    "Beşiktaş": ["Aşiyan Mezarlığı", "Ortaköy Mezarlığı", "Ulus Mezarlığı", "Bebek Mezarlığı"],
    "Beykoz": ["Anadolu Kavağı Mezarlığı", "Kanlıca Mezarlığı", "Çubuklu Mezarlığı", "Şahinkaya Mezarlığı"],
    "Beylikdüzü": ["Kavaklı Mezarlığı", "Gürpınar Mezarlığı"],
    "Beyoğlu": ["Kulaksız Mezarlığı", "Hasköy Mezarlığı", "Sütlüce Mezarlığı"],
    "Büyükçekmece": ["Büyükçekmece Yeni Mezarlık", "Mimarsinan Mezarlığı"],
    "Çatalca": ["Çatalca Merkez Mezarlığı"],
    "Çekmeköy": ["Taşdelen Mezarlığı", "Ekşioğlu Mezarlığı"],
    "Esenler": ["Esenler Atışalanı Mezarlığı"],
    "Esenyurt": ["Esenyurt Mezarlığı", "Kıraç Mezarlığı"],
    "Eyüpsultan": ["Edirnekapı Şehitliği", "Pierre Loti Mezarlığı", "Alibeyköy Mezarlığı", "Hasdal Mezarlığı"],
    "Fatih": ["Topkapı Mezarlığı", "Silivrikapı Mezarlığı", "Kozlu Mezarlığı"],
    "Gaziosmanpaşa": ["Karlıtepe Mezarlığı", "Küçükköy Mezarlığı", "Beşyüzevler Mezarlığı"],
    "Güngören": ["Güngören Merkez Mezarlığı"],
    "Kadıköy": ["Merdivenköy Mezarlığı", "Sahrayıcedit Mezarlığı", "Erenköy Mezarlığı"],
    "Kağıthane": ["Sanayi Mahallesi Mezarlığı", "Nurtepe Mezarlığı"],
    "Kartal": ["Kartal Merkez Mezarlığı", "Yakacık Mezarlığı", "Soğanlık Mezarlığı"],
    "Küçükçekmece": ["Kanarya Mezarlığı", "Sefaköy Mezarlığı", "Halkalı Mezarlığı"],
    "Maltepe": ["Maltepe Başıbüyük Mezarlığı", "Gülsuyu Mezarlığı", "Küçükyalı Mezarlığı"],
    "Pendik": ["Pendik Merkez Mezarlığı", "Dolayoba Mezarlığı", "Şeyhli Mezarlığı"],
    "Sancaktepe": ["Yenidoğan Mezarlığı", "Samandıra Mezarlığı"],
    "Sarıyer": ["Kilyos Mezarlığı", "Yeniköy Mezarlığı", "Ayazağa Mezarlığı", "Emirgan Mezarlığı"],
    "Silivri": ["Silivri Yeni Mezarlığı", "Selimpaşa Mezarlığı"],
    "Sultanbeyli": ["Sultanbeyli Merkez Mezarlığı"],
    "Sultangazi": ["Habipler Mezarlığı", "Cebeci Mezarlığı"],
    "Şile": ["Şile Merkez Mezarlığı"],
    "Şişli": ["Zincirlikuyu Mezarlığı", "Feriköy Mezarlığı", "Ayazağa Asri Mezarlığı"],
    "Tuzla": ["Tuzla Merkez Mezarlığı", "Aydınlı Mezarlığı"],
    "Ümraniye": ["Ihlamurkuyu Mezarlığı", "Hekimbaşı Mezarlığı", "Kocatepe Mezarlığı"],
    "Üsküdar": ["Karacaahmet Mezarlığı", "Nakkaştepe Mezarlığı", "Çengelköy Mezarlığı", "Bülbülderesi Mezarlığı", "Kandilli Mezarlığı"],
    "Zeytinburnu": ["Merkezefendi Mezarlığı", "Kazlıçeşme Mezarlığı"]
};