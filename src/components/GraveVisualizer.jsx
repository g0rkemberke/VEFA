import React, { useEffect, useState } from 'react';
import { Flower, Flower2, Clover } from 'lucide-react'; // YENİ: İkonlar eklendi

/* ─── Görsel yolları (çiçek + zemin) ─── */
const assets = {
  background: '/images/zemin.jpg',
  flowers: {
    papatya: '/images/papatya-png.png',
    gul:     '/images/gul-png.png',
    lavanta: '/images/lavanta-png.png',
    karanfil:'/images/karanfil-png.png', 
    kasimpati:'/images/kasimpati-png.png', 
  },
};

const SIZE_MAP = {
  small:  { width: '44%', topOff: '8%',  flowerS: 13 },
  medium: { width: '58%', topOff: '5%',  flowerS: 16 },
  large:  { width: '72%', topOff: '2%',  flowerS: 19 },
};

const MARBLE = {
  white: {
    base: '#fdfbf7',
    svgVeins: `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.018 0.022' numOctaves='6' seed='3'/><feColorMatrix type='saturate' values='0'/></filter><rect width='400' height='400' fill='%23fdfbf7'/><rect width='400' height='400' filter='url(%23n)' opacity='0.18'/><path d='M20,60 Q80,10 160,80 T300,40' stroke='%23c8c0b0' strokeWidth='1.5' fill='none' opacity='0.6'/></svg>`,
    gradient: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(240,235,225,0.2) 40%, rgba(200,192,178,0.25) 100%)',
    text: '#1a1c19', sub: '#4a4236', gold: '#8B6A10',
    hl: 'rgba(255,255,255,0.65)', dim: 'rgba(0,0,0,0.12)',
    shadowInner: 'inset 0 0 40px rgba(0,0,0,0.12)',
  },
  grey: {
    base: '#9ca3af',
    svgVeins: `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.02 0.025' numOctaves='5' seed='7'/><feColorMatrix type='saturate' values='0'/></filter><rect width='400' height='400' fill='%239ca3af'/><rect width='400' height='400' filter='url(%23n)' opacity='0.22'/><path d='M0,80 Q120,40 200,120 T400,90' stroke='%23555' strokeWidth='1.8' fill='none' opacity='0.55'/></svg>`,
    gradient: 'linear-gradient(145deg, rgba(180,180,180,0.35) 0%, rgba(100,100,100,0.1) 50%, rgba(40,40,40,0.3) 100%)',
    text: '#f8f6f0', sub: '#cdc5b5', gold: '#C9A84C',
    hl: 'rgba(200,200,200,0.18)', dim: 'rgba(0,0,0,0.35)',
    shadowInner: 'inset 0 0 40px rgba(0,0,0,0.35)',
  },
  black: {
    base: '#1f2937',
    svgVeins: `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.015 0.02' numOctaves='5' seed='12'/><feColorMatrix type='saturate' values='0'/></filter><rect width='400' height='400' fill='%231e1e1e'/><rect width='400' height='400' filter='url(%23n)' opacity='0.15'/><path d='M0,70 Q100,30 180,100 T380,70' stroke='%23888' strokeWidth='0.8' fill='none' opacity='0.4'/></svg>`,
    gradient: 'linear-gradient(150deg, rgba(80,80,80,0.2) 0%, rgba(20,20,20,0.1) 50%, rgba(0,0,0,0.45) 100%)',
    text: '#fdfbf7', sub: '#c0b89e', gold: '#D4AF5A',
    hl: 'rgba(255,255,255,0.06)', dim: 'rgba(0,0,0,0.65)',
    shadowInner: 'inset 0 0 40px rgba(0,0,0,0.6)',
  },
};

const toDataUrl = (svgStr) => `url("data:image/svg+xml,${svgStr.replace(/\s+/g, ' ').trim()}")`;

const MarbleLayer = ({ type, brightness = 1 }) => {
  const m = MARBLE[type] || MARBLE.grey;
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: m.base, backgroundImage: toDataUrl(m.svgVeins), backgroundSize: '100% 100%', filter: brightness !== 1 ? `brightness(${brightness})` : undefined }}>
      <div style={{ position: 'absolute', inset: 0, background: m.gradient, pointerEvents: 'none' }} />
    </div>
  );
};

const Divider = ({ gold }) => (
  <svg viewBox="0 0 160 12" style={{ width: '80%', display: 'block', margin: '0 auto' }}>
    <line x1="0" y1="6" x2="56" y2="6" stroke={gold} strokeWidth="0.7" strokeOpacity="0.6"/>
    <circle cx="63" cy="6" r="1.4" fill={gold} fillOpacity="0.8"/>
    <polygon points="75,2 78,6 75,10 78,6" fill="none" stroke={gold} strokeWidth="0.9"/>
    <circle cx="80" cy="6" r="2.2" fill={gold} fillOpacity="0.35" stroke={gold} strokeWidth="0.7"/>
    <polygon points="85,2 82,6 85,10 82,6" fill="none" stroke={gold} strokeWidth="0.9"/>
    <circle cx="97" cy="6" r="1.4" fill={gold} fillOpacity="0.8"/>
    <line x1="104" y1="6" x2="160" y2="6" stroke={gold} strokeWidth="0.7" strokeOpacity="0.6"/>
  </svg>
);

const Corner = ({ gold, flip }) => (
  <svg viewBox="0 0 28 28" style={{ width: 26, height: 26, transform: flip ? 'scaleX(-1)' : 'none', display: 'block' }}>
    <path d="M2,2 Q14,2 26,26" fill="none" stroke={gold} strokeWidth="0.8" strokeOpacity="0.55"/>
    <path d="M2,2 Q2,14 26,26" fill="none" stroke={gold} strokeWidth="0.8" strokeOpacity="0.55"/>
    <circle cx="2" cy="2" r="1.8" fill={gold} fillOpacity="0.75"/>
  </svg>
);

const RoseMark = ({ gold }) => (
  <svg viewBox="0 0 20 20" style={{ width: 13, height: 13 }}>
    <circle cx="10" cy="10" r="3" fill={gold} fillOpacity="0.55"/>
    {[0,45,90,135,180,225,270,315].map((a, i) => <ellipse key={i} cx="10" cy="4.5" rx="1.4" ry="2.4" fill={gold} fillOpacity="0.4" transform={`rotate(${a} 10 10)`}/>)}
  </svg>
);

// YENİ: Toprak havuzunun İÇİNE göre ayarlanan çiçek koordinatları
const SOIL_FLOWER_POS = [
  { t: 20, l: 20, s: 1.0, r: -15, z: 10 },
  { t: 15, l: 50, s: 1.1, r: 0,   z: 10 },
  { t: 20, l: 80, s: 1.0, r: 15,  z: 10 },
  { t: 50, l: 15, s: 1.1, r: -20, z: 20 },
  { t: 45, l: 38, s: 1.2, r: -5,  z: 20 },
  { t: 45, l: 62, s: 1.2, r: 10,  z: 20 },
  { t: 50, l: 85, s: 1.1, r: 25,  z: 20 },
  { t: 85, l: 25, s: 1.2, r: -10, z: 30 },
  { t: 80, l: 50, s: 1.3, r: 0,   z: 30 },
  { t: 85, l: 75, s: 1.2, r: 10,  z: 30 },
];

export default function GraveVisualizer({ design }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const mbl       = design?.marble || 'grey';
  const p         = MARBLE[mbl] || MARBLE.grey;
  const isClassic = (design?.headstone || 'classic') === 'classic';
  const headBR    = isClassic ? '58% 58% 6px 6px / 52% 52% 6px 6px' : '10px 10px 6px 6px';
  const sizeKey   = design?.size || 'medium';
  const sz        = SIZE_MAP[sizeKey] || SIZE_MAP.medium;

  const selectedFlowers = Array.isArray(design?.flowers)
    ? design.flowers.filter(f => f !== 'none')
    : (design?.flowers && design.flowers !== 'none' ? [design.flowers] : []);

  // YENİ: Çiçek Render Motoru (Fotoğraf yoksa İkon kullanır)
  const renderFlowerItem = (type) => {
    if (assets.flowers[type]) {
      return <img src={assets.flowers[type]} alt={type} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
    }
    // PNG Fotoğrafı olmayan çiçekler için harika ikonlar
    switch (type) {
      case 'zambak':  return <Flower2 color="#f8fafc" fill="#facc15" strokeWidth={1} style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />;
      case 'sumbul':  return <Clover color="#e879f9" fill="#c084fc" strokeWidth={1.5} style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />;
      case 'begonya': return <Flower color="#fda4af" fill="#fb7185" strokeWidth={1.5} style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />;
      default:        return <Flower color="#34d399" fill="#10b981" style={{ width: '100%', height: '100%' }} />;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '3/5', fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,serif", userSelect: 'none', overflow: 'hidden', borderRadius: 24 }}>

      {/* ══ ARKA PLAN ══ */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 80% at 50% 30%, #1b2d1f 0%, #0e1a11 55%, #060d08 100%)' }}/>
      <img src={assets.background} alt="" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: '40%', objectFit: 'cover', opacity: 0.45, filter: 'saturate(0.6) brightness(0.38)' }}/>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(to top, rgba(6,13,8,0.82) 0%, transparent 100%)' }}/>

      {/* ══ MEZAR TAŞI KAPSAYICI ══ */}
      <div style={{
        position: 'absolute', left: '50%', top: sz.topOff, transform: 'translateX(-50%)',
        width: sz.width, display: 'flex', flexDirection: 'column', alignItems: 'center',
        zIndex: 6, opacity: ready ? 1 : 0, transition: 'opacity 0.7s ease 0.15s, width 0.5s ease, top 0.5s ease',
      }}>

        {/* ── A. BAŞ TAŞI ── */}
        <div style={{
          position: 'relative', width: '100%', paddingBottom: '68%', borderRadius: headBR, overflow: 'hidden',
          boxShadow: `0 18px 50px rgba(0,0,0,0.85), ${p.shadowInner}, inset 0 -6px 20px ${p.dim}`,
          border: `1px solid ${p.gold}38`,
        }}>
          <MarbleLayer type={mbl} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12% 10% 14%', gap: 5 }}>
            <RoseMark gold={p.gold}/>
            <div style={{ color: p.text, fontSize: 'clamp(11px, 2.8vw, 19px)', fontWeight: 700, letterSpacing: '0.1em', textAlign: 'center', lineHeight: 1.25, textShadow: mbl === 'white' ? '0 1px 4px rgba(255,255,255,0.7)' : '0 2px 8px rgba(0,0,0,0.9)' }}>
              {design?.name || 'İSİM SOYİSİM'}
            </div>
            <Divider gold={p.gold}/>
            <div style={{ color: p.sub, fontSize: 'clamp(6px, 1.5vw, 10px)', letterSpacing: '0.28em', fontWeight: 500, textAlign: 'center' }}>
              {design?.date || '1900 — 20XX'}
            </div>
          </div>
        </div>

        {/* birleşim gölgesi */}
        <div style={{ width: '88%', height: 7, background: 'rgba(0,0,0,0.52)', filter: 'blur(5px)', borderRadius: '50%', marginTop: -2, zIndex: 1 }}/>

        {/* ── B. GÖVDE VE TOPRAK HAVUZU ── */}
        <div style={{
          position: 'relative', width: '96%', paddingBottom: '100%', marginTop: -5,
          borderRadius: '3px 3px 10px 10px', overflow: 'hidden',
          boxShadow: `0 25px 55px rgba(0,0,0,0.92), ${p.shadowInner}`,
          border: `1px solid ${p.gold}28`, borderTop: 'none',
        }}>
          <MarbleLayer type={mbl} brightness={0.85}/>
          
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.06) 35%, rgba(0,0,0,0.12) 100%)`, pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', inset: 10, borderRadius: '2px 2px 7px 7px', border: `1px solid ${p.gold}50`, pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', top: 12, left: 12 }}><Corner gold={p.gold}/></div>
          <div style={{ position: 'absolute', top: 12, right: 12 }}><Corner gold={p.gold} flip/></div>
          
          <div style={{ position: 'absolute', top: '8%', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
             <div style={{ color: p.sub, fontSize: 'clamp(5px, 1.2vw, 8px)', letterSpacing: '0.3em', fontWeight: 'bold', opacity: 0.8 }}>HER ZAMAN KALPTE</div>
             <Divider gold={p.gold}/>
          </div>

          {/* ── İÇ TOPRAK HAVUZU VE ÇİÇEKLER ── */}
          <div style={{
             position: 'absolute', top: '22%', left: '16%', right: '16%', bottom: '12%',
             borderRadius: '6px', backgroundColor: '#26170d',
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.45'/%3E%3C/svg%3E")`,
             boxShadow: 'inset 0 15px 30px rgba(0,0,0,0.95), inset 0 2px 5px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.1)',
             borderTop: '2px solid rgba(0,0,0,0.9)', borderLeft: '1px solid rgba(0,0,0,0.6)',
             overflow: 'hidden' // Çiçekler mermere taşmasın
          }}>
             {selectedFlowers.length === 0 ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.2em', textShadow: 'inset 0 1px 1px rgba(0,0,0,0.5)' }}>TEMİZ EKENEK TOPRAĞI</span>
                </div>
             ) : (
                SOIL_FLOWER_POS.map((f, i) => {
                  const flowerType = selectedFlowers[i % selectedFlowers.length];
                  return (
                    <div key={i} style={{
                      position: 'absolute',
                      top: `${f.t}%`, left: `${f.l}%`,
                      width: `${f.s * 35}%`, height: `${f.s * 35}%`,
                      transform: `translate(-50%, -50%) rotate(${f.r}deg)`,
                      zIndex: f.z,
                      opacity: ready ? 1 : 0, transition: `opacity 0.6s ease ${i * 40}ms`,
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.8))'
                    }}>
                      {renderFlowerItem(flowerType)}
                    </div>
                  )
                })
             )}
          </div>
        </div>

        {/* ── C. KAİDE ── */}
        <div style={{ position: 'relative', width: '112%', height: 20, borderRadius: '3px 3px 8px 8px', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0,0,0,0.88)' }}>
          <MarbleLayer type={mbl} brightness={0.72}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.38), rgba(0,0,0,0.1))' }}/>
          <div style={{ position: 'absolute', top: 0, left: '12%', right: '12%', height: 1, background: `linear-gradient(to right, transparent, ${p.gold}85, transparent)` }}/>
        </div>

        <div style={{ width: '78%', height: 9, background: 'rgba(0,0,0,0.58)', filter: 'blur(8px)', borderRadius: '50%' }}/>
      </div>
    </div>
  ); 
}