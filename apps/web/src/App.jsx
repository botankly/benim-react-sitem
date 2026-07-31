import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import heroImage from './assets/hero.png';
import Navbar from './components/Navbar';
import SaaSDashboard from './components/SaaSDashboard';
import LoginRegister from './components/LoginRegister';
import { useAuth } from './context/AuthContext';



// WMO Weather codes
const mapWeatherCode = (code) => {
  const codes = {
    0: { condition: "Açık", icon: "☀️" },
    1: { condition: "Çok Az Bulutlu", icon: "🌤️" },
    2: { condition: "Parçalı Bulutlu", icon: "⛅" },
    3: { condition: "Kapalı", icon: "☁️" },
    45: { condition: "Sisli", icon: "🌫️" },
    48: { condition: "Puslu Sisli", icon: "🌫️" },
    51: { condition: "Hafif Çiseleme", icon: "🌧️" },
    53: { condition: "Çiseleme", icon: "🌧️" },
    55: { condition: "Yoğun Çiseleme", icon: "🌧️" },
    56: { condition: "Dondurucu Çisenti", icon: "🌧️" },
    57: { condition: "Dondurucu Yoğun Çisenti", icon: "🌧️" },
    61: { condition: "Hafif Yağmurlu", icon: "🌧️" },
    63: { condition: "Yağmurlu", icon: "🌧️" },
    65: { condition: "Yoğun Yağmurlu", icon: "🌧️" },
    66: { condition: "Hafif Dondurucu Yağmur", icon: "🌧️" },
    67: { condition: "Dondurucu Yağmur", icon: "🌧️" },
    71: { condition: "Hafif Karlı", icon: "❄️" },
    73: { condition: "Karlı", icon: "❄️" },
    75: { condition: "Yoğun Karlı", icon: "❄️" },
    77: { condition: "Kar Serpintisi", icon: "❄️" },
    80: { condition: "Hafif Sağanak Yağış", icon: "🌦️" },
    81: { condition: "Sağanak Yağış", icon: "🌦️" },
    82: { condition: "Yoğun Sağanak Yağış", icon: "🌦️" },
    85: { condition: "Hafif Kar Sağanağı", icon: "❄️" },
    86: { condition: "Yoğun Kar Sağanağı", icon: "❄️" },
    95: { condition: "Gökgürültülü Fırtına", icon: "⛈️" },
    96: { condition: "Hafif Dolu Fırtınası", icon: "⛈️" },
    99: { condition: "Gökgürültülü Dolu Fırtınası", icon: "⛈️" }
  };
  return codes[code] || { condition: "Güneşli", icon: "☀️" };
};

// Dinamik Hava Durumu Tema Çözümleyici
const getWeatherTheme = (condition = '', isDay = 1) => {
  const cond = (condition || '').toLowerCase();
  
  if (isDay === 0) {
    return {
      bg: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(88, 28, 135, 0.45))',
      border: 'rgba(168, 85, 247, 0.45)',
      accent: '#c084fc',
      badgeBg: 'rgba(168, 85, 247, 0.2)',
      iconAnim: '',
      effect: '✨ Gece Gökyüzü',
      particle: '🌙'
    };
  }

  if (cond.includes('yağmur') || cond.includes('sağanak') || cond.includes('çiseleme') || cond.includes('fırtına')) {
    return {
      bg: 'linear-gradient(135deg, rgba(30, 58, 138, 0.65), rgba(15, 23, 42, 0.95))',
      border: 'rgba(96, 165, 250, 0.45)',
      accent: '#60a5fa',
      badgeBg: 'rgba(96, 165, 250, 0.2)',
      iconAnim: 'weather-rain-particle',
      effect: '🌧️ Yağmurlu Hava',
      particle: '💧'
    };
  }

  if (cond.includes('kar') || cond.includes('dondurucu') || cond.includes('dolu')) {
    return {
      bg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.35), rgba(15, 23, 42, 0.95))',
      border: 'rgba(56, 189, 248, 0.45)',
      accent: '#38bdf8',
      badgeBg: 'rgba(56, 189, 248, 0.2)',
      iconAnim: 'weather-snow-particle',
      effect: '❄️ Karlı & Soğuk',
      particle: '❄️'
    };
  }

  if (cond.includes('bulut') || cond.includes('sis') || cond.includes('kapalı') || cond.includes('puslu')) {
    return {
      bg: 'linear-gradient(135deg, rgba(71, 85, 105, 0.55), rgba(30, 41, 59, 0.95))',
      border: 'rgba(148, 163, 184, 0.45)',
      accent: '#cbd5e1',
      badgeBg: 'rgba(148, 163, 184, 0.2)',
      iconAnim: 'weather-cloud-particle',
      effect: '☁️ Bulutlu Geçiş',
      particle: '☁️'
    };
  }

  // Güneşli / Açık
  return {
    bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(15, 23, 42, 0.95))',
    border: 'rgba(251, 191, 36, 0.45)',
    accent: '#fbbf24',
    badgeBg: 'rgba(251, 191, 36, 0.2)',
    iconAnim: 'weather-sun-effect',
    effect: '☀️ Güneşli & Açık',
    particle: '☀️'
  };
};

// Rüzgar Yönü Çözümleyici
const getWindDirectionLabel = (deg) => {
  if (deg === undefined || deg === null) return 'K (Kuzey) ⬆️';
  const dirs = ['K (Kuzey) ⬆️', 'KD (Kuzeydoğu) ↗️', 'D (Doğu) ➡️', 'GD (Güneydoğu) ↘️', 'G (Güney) ⬇️', 'GB (Güneybatı) ↙️', 'B (Batı) ⬅️', 'KB (Kuzeybatı) ↖️'];
  const index = Math.round((deg % 360) / 45) % 8;
  return dirs[index];
};

// AQI (Hava Kalitesi) Rozet Çözümleyici
const getAQIBadge = (aqi) => {
  const val = Math.round(aqi || 35);
  if (val <= 50) return { label: `🟢 İyi (${val} AQI)`, color: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)', border: 'rgba(74, 222, 128, 0.3)' };
  if (val <= 100) return { label: `🟡 Orta (${val} AQI)`, color: '#facc15', bg: 'rgba(250, 204, 21, 0.15)', border: 'rgba(250, 204, 21, 0.3)' };
  return { label: `🔴 Kötü (${val} AQI)`, color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)', border: 'rgba(248, 113, 113, 0.3)' };
};

// UV İndeksi Rozet Çözümleyici
const getUVBadge = (uv) => {
  const val = Math.round(uv || 4);
  if (val <= 2) return { label: `🟢 Düşük (${val})`, color: '#4ade80' };
  if (val <= 5) return { label: `🟡 Orta (${val})`, color: '#facc15' };
  if (val <= 7) return { label: `🟠 Yüksek (${val})`, color: '#fb923c' };
  return { label: `🔴 Çok Yüksek (${val})`, color: '#f87171' };
};

// Saat Formatlayıcı (HH:mm)
const formatTimeHHMM = (timeStr) => {
  if (!timeStr) return '--:--';
  try {
    const d = new Date(timeStr);
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return timeStr.slice(11, 16) || '--:--';
  }
};

// Tarih formatlama fonksiyonu
const formatDayName = (dateStr) => {
  const date = new Date(dateStr);
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  return days[date.getDay()];
};

// Örnek Blog Gönderileri Verisi
const BLOG_POSTS = [
  {
    id: 1,
    title: "React 19 ile Gelen Yenilikler ve useActionState",
    date: "28 Temmuz 2026",
    readTime: "5 dk okuma",
    summary: "React 19 sürümüyle gelen yeni Async Actions, useActionState, useFormStatus hook'ları ve yerleşik Document Metadata yönetimini inceliyoruz.",
    content: `
      <p>React ekibi, geliştirici deneyimini bir üst seviyeye taşımak amacıyla merakla beklenen <strong>React 19</strong> sürümünü kararlı sürümle birlikte duyurdu. Bu sürümle birlikte gelen en büyük mimari değişikliklerden biri asenkron veri akışlarını yönetmek için sunulan Actions yapısıdır.</p>
      <h5>Actions ve useTransition Entegrasyonu</h5>
      <p>Eski sürümlerde asenkron veri gönderimlerinde (örneğin bir formu kaydederken) yükleniyor (loading) ve hata durumlarını yönetmek için birden çok state tanımlıyorduk. Artık <code>useTransition</code> yardımıyla tetiklenen asenkron fonksiyonlarda yüklenme durumu otomatik olarak yönetiliyor ve arayüz kilitlenmeden asenkron süreç tamamlanabiliyor.</p>
      <h5>Yeni useActionState Hook'u</h5>
      <p>Form durumlarını (state) ve form aksiyonlarının sonuçlarını yönetmeyi son derece basitleştiren <code>useActionState</code> (eski adıyla useFormState), asenkron gönderim sonrasında dönen yanıtları, hata mesajlarını ve güncel state verisini tek bir yerden yönetmenize olanak tanır.</p>
      <h5>Erişilebilirlik ve SEO: Yerleşik Head Elementleri Yönetimi</h5>
      <p>React 19 ile birlikte, sayfa başlığı (title), meta etiketleri ve link tanımları doğrudan React bileşenleri içerisinde yerel olarak destekleniyor. React, bu etiketleri otomatik olarak sayfanın en üstündeki HTML <code>&lt;head&gt;</code> alanına taşır. Böylelikle React Helmet gibi harici kütüphanelere olan bağımlılık tamamen ortadan kalkmaktadır.</p>
    `
  },
  {
    id: 2,
    title: "Modern Web Geliştirmede Performans ve Optimizasyon",
    date: "20 Temmuz 2026",
    readTime: "4 dk okuma",
    summary: "Web uygulamalarında kullanıcı deneyimini doğrudan etkileyen sayfa açılış hızını, görsel optimizasyonunu ve kod bölümleme yöntemlerini ele alıyoruz.",
    content: `
      <p>Günümüzde kullanıcılar web sitelerinin saniyeler içinde yüklenmesini beklemektedir. Yavaş açılan sayfalar doğrudan kullanıcı kaybına ve düşük SEO sıralamalarına yol açmaktadır. Bu sebeple modern web geliştiricilerinin performans optimizasyonunu önceliklendirmesi şarttır.</p>
      <h5>Görsel Kaynaklarının Optimize Edilmesi</h5>
      <p>Web sayfalarındaki toplam veri boyutunun büyük bir kısmını görseller oluşturur. PNG veya JPEG yerine modern <strong>WebP</strong> ve <strong>AVIF</strong> formatlarını kullanmak görsel kalitesini bozmadan dosya boyutunu %30 ila %50 oranında düşürür. Ayrıca ekran dışındaki görseller için <code>loading="lazy"</code> özelliğini kullanmak sayfa açılışını hızlandırır.</p>
      <h5>Dinamik Kod Bölümleme (Code Splitting)</h5>
      <p>Kullanıcının o an ziyaret etmediği sayfaların veya modüllerin kodlarını ilk yüklemede indirmesini engellemek için kod bölümleme uygulamalıyız. React içerisindeki <code>React.lazy</code> ve <code>Suspense</code> yapıları sayesinde, yalnızca ilgili rota veya modal açıldığında JavaScript kodlarının yüklenmesini sağlayabiliriz.</p>
      <h5>HTTP Önbellekleme (Caching) ve CDN Kullanımı</h5>
      <p>Statik dosyaları (CSS, JS, resimler) küresel içerik dağıtım ağları (CDN) üzerinde barındırmak ve tarayıcı önbellekleme başlıklarını doğru yapılandırmak, kullanıcının siteyi sonraki ziyaretlerinde neredeyse anında yüklenmesini sağlar.</p>
    `
  },
  {
    id: 3,
    title: "Büyük Ölçekli Projelerde Tailwind CSS Yönetimi",
    date: "12 Temmuz 2026",
    readTime: "6 dk okuma",
    summary: "Tailwind CSS kullanan büyük projelerde kod karmaşasını önlemek, tasarımsal bütünlüğü korumak ve tekrar kullanılabilirliği artırmak için en iyi pratikler.",
    content: `
      <p>Tailwind CSS, sunduğu yardımcı sınıflarla hızlıca arayüzler tasarlavamızı sağlasa da, projeler büyüdükçe HTML dosyalarındaki sınıf (class) karmaşası kodun sürdürülebilirliğini zorlaştırabilir. Sürdürülebilir bir yapı kurmak için şu prensipleri uygulayabiliriz:</p>
      <h5>Bileşen Tabanlı Yaklaşım (Component Extraction)</h5>
      <p>Aynı sınıfları sürekli kopyalayıp yapıştırmak yerine (örneğin butonlar veya form girdileri), bunları küçük ve bağımsız React bileşenlerine dönüştürün. Bu sayede bir stil değişikliği yapılacağında projedeki yüzlerce yeri değil, yalnızca ilgili tek bir bileşeni değiştirmek yeterli olacaktır.</p>
      <h5>Genişletilebilir Tailwind Yapılandırması</h5>
      <p>Özel renk tonlarını, kurumsal fontları ve animasyonları doğrudan <code>tailwind.config.js</code> dosyasında tanımlayarak projenin tamamında tek bir kaynaktan tutarlı şekilde yönetilmesini sağlayın. Bu, markanızın kurumsal arayüz bütünlüğünü garantiler.</p>
      <h5>Dinamik Sınıfların ve Çakışmaların Yönetimi</h5>
      <p>Bileşenlere dışarıdan prop olarak dinamik stiller geçildiğinde Tailwind sınıfların çakışmasını önlemek için <code>clsx</code> ve <code>tailwind-merge</code> kütüphanelerini kullanmak oldukça yaygın ve faydalı bir yöntemdir. Bu iki kütüphaneyi bir araya getiren ufak bir helper fonksiyonu yazmak dinamik stil yönetimini sorunsuz hale verir.</p>
    `
  }
];

// Kod Parçacıkları (Code Snippets) Verisi
const CODE_SNIPPETS = [
  {
    id: "use-local-storage",
    title: "Custom React Hook: useLocalStorage",
    desc: "React bileşenlerinde state verilerini otomatik olarak localStorage ile senkronize eden özel hook.",
    tag: "React",
    code: `import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}`,
    runSimulation: () => {
      return `[Mock React Core] Hook useLocalStorage("user-theme", "dark") çağrıldı.\n[LocalStorage] Veri okundu: null. Varsayılan değer kullanılıyor: "dark"\n[LocalStorage] Yazıldı -> {"user-theme": "dark"}\n[State] Başarıyla senkronize edildi!`;
    }
  },
  {
    id: "glassmorphism",
    title: "Tailwind CSS Glassmorphism Utility",
    desc: "Buzlu cam efekti sunan modern ve şık bir navbar veya kart arka planı için CSS utility sınıfları.",
    tag: "Tailwind CSS",
    code: `<div className="backdrop-blur-md bg-white/5 
  border border-white/10 shadow-lg">
  {/* Buzlu cam içerik */}
</div>`,
    runSimulation: () => {
      return `[CSS Parser] Sınıflar çözümleniyor:\n- backdrop-blur-md: backdrop-filter: blur(12px)\n- bg-white/5: background-color: rgba(255, 255, 255, 0.05)\n- border-white/10: border: 1px solid rgba(255, 255, 255, 0.1)\n- shadow-lg: box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1)\n[Render Engine] Donanım hızlandırmalı cam efekti başarıyla çizildi!`;
    }
  },
  {
    id: "debounce",
    title: "JavaScript Debounce Function",
    desc: "Arama kutusu girdileri gibi sık tetiklenen fonksiyonların performansını optimize etmek için debounce.",
    tag: "JavaScript",
    code: `export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}`,
    runSimulation: () => {
      return `[JS Engine] Debounce tanımlandı (delay: 200ms).\n[Tetikleme] Tuş vuruşu: "R" (İşlem iptal edildi)\n[Tetikleme] Tuş vuruşu: "Re" (İşlem iptal edildi)\n[Tetikleme] Tuş vuruşu: "React" (200ms beklendi...)\n[Çıktı] API Arama fonksiyonu tetiklendi: "React"\n[Performans] 3 tetiklemeden sadece 1 arama yapıldı. %66 performans tasarrufu!`;
    }
  }
];

// Yetenek Havuzu Verileri
const SKILLS_DATA = {
  frontend: [
    { name: 'React.js', icon: '⚛️', level: 'İleri Seviye' },
    { name: 'TypeScript', icon: '📘', level: 'İleri Seviye' },
    { name: 'Vite', icon: '⚡', level: 'İleri Seviye' },
    { name: 'Tailwind CSS', icon: '🎨', level: 'Uzman Seviye' },
    { name: 'HTML5 & CSS3', icon: '🌐', level: 'Uzman Seviye' },
    { name: 'Next.js', icon: '🚀', level: 'Orta Seviye' }
  ],
  backend: [
    { name: 'Node.js', icon: '🟢', level: 'Orta Seviye' },
    { name: 'Python (Django)', icon: '🐍', level: 'İleri Seviye' },
    { name: 'Express.js', icon: '🚂', level: 'Orta Seviye' },
    { name: 'MySQL / SQLite', icon: '🛢️', level: 'İleri Seviye' },
    { name: 'REST APIs', icon: '🔗', level: 'Uzman Seviye' }
  ],
  mobile: [
    { name: 'React Native', icon: '📱', level: 'İleri Seviye' },
    { name: 'Expo', icon: '🍇', level: 'İleri Seviye' },
    { name: 'Android Studio', icon: '🤖', level: 'Orta Seviye' }
  ],
  devops: [
    { name: 'Git & GitHub', icon: '🐙', level: 'Uzman Seviye' },
    { name: 'Vercel / Netlify', icon: '▲', level: 'Uzman Seviye' },
    { name: 'Docker', icon: '🐳', level: 'Orta Seviye' },
    { name: 'npm / yarn / uv', icon: '📦', level: 'Uzman Seviye' }
  ]
};

// Proje Verileri
const PROJECTS_DATA = [
  {
    id: 1,
    title: "Trendsepetix",
    category: "Fullstack",
    tag: "⭐ Öne Çıkan / Fullstack",
    desc: "AI destekli karar destek mekanizmaları, bölgesel satış ısı haritası ve grafik analizleri içeren e-ticaret veri madenciliği paneli.",
    technologies: ['React', 'Vite', 'TypeScript', 'Tailwind CSS'],
    github: "https://github.com/botankly/Trendsepetix",
    demo: "https://trendsepetix.vercel.app",
    hasDetails: true,
    detailAction: 'trendsepetix',
    featured: true,
    problem: "Geleneksel e-ticaret panelleri ham veriyi yöneticiye sunarken; anlamlı içgörü, satış trendi ve bölgesel performans analizi sunmaz. Trendsepetix bu boşluğu kapatmak için geliştirildi.",
    highlights: [
      "Gerçek zamanlı Socket.io entegrasyonu ile anlık sipariş ve kullanıcı akışı takibi",
      "AI rapor üreticisi ile tek tık'ta Türkçe/İngilizce yönetici özeti çıkarma",
      "JWT tabanlı Rol Yönetimi (Admin/User) ve korumalı route mimarisi",
      "Stripe/Iyzico Sandbox ile abonelik planı simülasyonu (Free/Pro/Enterprise)"
    ],
    arch: "Monorepo (Turborepo) · React 19 + Vite Frontend · Node.js + Express API · Socket.io · Prisma ORM · PostgreSQL"
  },
  {
    id: 2,
    title: "Hava Durumu Uygulaması",
    category: "Frontend",
    tag: "Frontend",
    desc: "Canlı Open-Meteo API, Geolocation, 24 saatlik çizgi grafiği ve AQI/UV indeksleri içeren profesyonel meteoroloji paneli.",
    technologies: ['React 19', 'Vite', 'Open-Meteo API', 'Geolocation API', 'SVG Line Chart'],
    github: "https://github.com/botankly",
    demo: "https://benim-react-sitem.vercel.app",
    hasDetails: true,
    detailAction: 'weather',
    problem: "Kullanıcıların canlı ve doğru hava durumu verilerine (sıcaklık, nem, AQI, UV, saatlik değişim) konum bazlı anında ulaşmasını sağlamak.",
    highlights: [
      "Canlı Open-Meteo REST API & Air Quality API entegrasyonu (Sıfır sahte veri)",
      "Geolocation API ile otomatik konum algılama (📍 GPS)",
      "24 saatlik sıcaklık değişim grafiği (Custom SVG Line Chart)",
      "°C / °F Birim dönüştürücüsü ve LocalStorage destekli arama geçmişi"
    ],
    arch: "React 19 · Open-Meteo REST API · Air Quality API · Geolocation API · Custom SVG Chart"
  },
  {
    id: 3,
    title: "To Do App",
    category: "Frontend",
    tag: "Frontend",
    desc: "Kullanıcı dostu, animasyonlu görev tamamlama süreçleri içeren şık ve hızlı bir yapılacaklar listesi uygulaması.",
    technologies: ['React', 'CSS', 'LocalStorage', 'Framer Motion'],
    github: "https://github.com/botankly",
    demo: "https://benim-react-sitem.vercel.app",
    hasDetails: true,
    detailAction: 'todo',
    problem: "Sade ama estetik bir görev yönetimi aracına duyulan ihtiyaçtan doğdu; backend bağımlılığı olmadan kalıcı veri saklama.",
    highlights: [
      "LocalStorage tabanlı kalıcı görev kaydı (sayfa yenileme sonrası kayıp yok)",
      "Tümü / Aktif / Tamamlanan filtre sekmeleri",
      "Framer Motion ile akıcı ekleme/silme animasyonları",
      "Karanlık/Aydınlık tema uyumlu tam responsive tasarım"
    ],
    arch: "React 19 · CSS3 · LocalStorage API · Framer Motion · Vite"
  }
];

export default function App() {
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [isTrendsepetixOpen, setIsTrendsepetixOpen] = useState(false);
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);

  // Terminal States & Handler
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([]);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let output = '';
    let type = 'info';

    switch (cmd) {
      case 'help':
        output = `Kullanılabilecek komutlar:
  about    - Botan Külay hakkında özet bilgi
  skills   - Yetenek havuzunu listeler
  projects - Geliştirilen projelerin linkleri
  contact  - İletişim & sosyal ağ bilgileri
  clear    - Ekranı temizler`;
        type = 'success';
        break;
      case 'about':
        output = `Botan Külay
Fırat Üniversitesi Yazılım Mühendisliği son sınıf öğrencisiyim. 
Modern web (React, Node.js) ve mobil (React Native) geliştirme teknolojileri ile
kullanıcı dostu, performanslı çözümler üretiyorum.`;
        break;
      case 'skills':
        output = `Frontend:  React, Vite, TypeScript, Tailwind CSS, Next.js, HTML5, CSS3
Backend:   Node.js, Python (Django), MySQL, SQLite, REST APIs
Mobile:    React Native, Expo, Android Studio
DevOps:    Git, GitHub, Docker, Vercel, Netlify, npm/yarn`;
        type = 'success';
        break;
      case 'projects':
        output = `• Trendsepetix (AI & E-Ticaret Veri Paneli) -> https://trendsepetix.vercel.app
• Hava Durumu Uygulaması -> https://benim-react-sitem.vercel.app
• To Do App (Yapılacaklar Paneli) -> https://benim-react-sitem.vercel.app`;
        type = 'success';
        break;
      case 'contact':
        output = `E-posta:   botan.kulay@example.com (İletişim modalı üzerinden yazabilirsiniz)
GitHub:    https://github.com/botankly
LinkedIn:  https://www.linkedin.com/in/botan-k%C3%BClay-6786a4295/`;
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      default:
        output = `Komut bulunamadı: '${cmd}'. Kullanılabilir tüm komutlar için 'help' yazın.`;
        type = 'error';
    }

    setTerminalHistory(prev => [...prev, { command: terminalInput, output, type }]);
    setTerminalInput('');

    // Auto scroll to bottom
    setTimeout(() => {
      const container = document.querySelector('.terminal-body');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  };
  
  // Tema ve Yetenek Sekmesi States
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [activeSkillTab, setActiveSkillTab] = useState('frontend');
  const [currentView, setCurrentView] = useState('portfolio');

  const { user } = useAuth();

  // Redirect to login if dashboard is accessed by unauthenticated users
  useEffect(() => {
    if (currentView === 'dashboard' && !user) {
      setCurrentView('login');
    }
  }, [currentView, user]);

  // Proje Arama ve Kategori Filtreleme States
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectCategory, setSelectedProjectCategory] = useState('Tümü');

  // Yukarı Çık Butonu State
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Botan-AI Chatbot States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Merhaba! Ben Botan\'ın yapay zekâ asistanıyım. Botan hakkında bilgi almak veya aklınıza takılanları sormak için aşağıdaki hazır butonları kullanabilir veya bana yazabilirsiniz!' }
  ]);

  // Code Playground Outputs State
  const [playgroundOutputs, setPlaygroundOutputs] = useState({});

  const handleSendMessage = (textToSend) => {
    const text = textToSend || chatInput.trim();
    if (!text) return;

    // Add user message
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    if (!textToSend) setChatInput('');

    // Botan AI intelligence replies
    setTimeout(() => {
      let reply = '';
      const cleanText = text.toLowerCase();

      if (cleanText.includes('yetenek') || cleanText.includes('skill') || cleanText.includes('neler yapabiliyor')) {
        reply = 'Botan Külay; Frontend\'de React, TypeScript ve Tailwind CSS; Backend\'de Node.js ve Python (Django) ile fullstack web projeleri geliştiriyor. Ayrıca React Native ile mobil uygulama geliştirme tecrübesine sahip.';
      } else if (cleanText.includes('iletişim') || cleanText.includes('contact') || cleanText.includes('mail') || cleanText.includes('ulaş')) {
        reply = 'Botan\'a doğrudan sitemizdeki "İletişime Geç" formunu doldurarak veya botan.kulay@example.com adresi üzerinden e-posta atarak ulaşabilirsiniz. Ayrıca sağ üstteki GitHub linkinden de çalışmalarını inceleyebilirsiniz.';
      } else if (cleanText.includes('üniversite') || cleanText.includes('okul') || cleanText.includes('eğitim') || cleanText.includes('nerede okuyor')) {
        reply = 'Botan Külay, Fırat Üniversitesi Yazılım Mühendisliği bölümünde lisans eğitimine devam ediyor (son sınıf öğrencisi).';
      } else if (cleanText.includes('proje') || cleanText.includes('neler yaptı')) {
        reply = 'En büyük projelerinden biri olan Trendsepetix; e-ticaret veri madenciliği analitiği, AI birliktelik kural analizi (Apriori) ve bölgesel yoğunluk ısı haritaları sunan tam kapsamlı bir full-stack karar destek panelidir.';
      } else if (cleanText.includes('merhaba') || cleanText.includes('selam')) {
        reply = 'Merhaba! Botan\'ın portfolyosuna hoş geldiniz. Size nasıl yardımcı olabilirim? Okulu, yetenekleri veya projeleri hakkında bilgi vermemi ister misiniz?';
      } else {
        reply = 'Bu konuda detaylı bilgiyi Botan\'ın özgeçmişinde (CV) bulabilirsiniz. Ayrıca sitemizdeki İletişim formundan doğrudan kendisine yazarak merak ettiklerinizi birinci ağızdan sorabilirsiniz!';
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      
      // Auto-scroll chat body
      setTimeout(() => {
        const body = document.querySelector('.chat-body');
        if (body) body.scrollTop = body.scrollHeight;
      }, 50);
    }, 600);
  };

  const handleRunCode = (id, simFn) => {
    setPlaygroundOutputs(prev => ({
      ...prev,
      [id]: simFn()
    }));
    showToastNotification("Kod başarıyla çalıştırıldı!");
  };

  // Animasyonlu Sayaç State
  const [stats, setStats] = useState({ projects: 0, performance: 0 });

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll Listener for Back to Top Button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard ESC Listener for Modal Closing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedProjectModal) setSelectedProjectModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProjectModal]);

  // Stats Counter Animation Effect
  useEffect(() => {
    let pTimer = setInterval(() => {
      setStats(prev => {
        if (prev.projects >= 10) {
          clearInterval(pTimer);
          return prev;
        }
        return { ...prev, projects: prev.projects + 1 };
      });
    }, 100);

    let perfTimer = setInterval(() => {
      setStats(prev => {
        if (prev.performance >= 100) {
          clearInterval(perfTimer);
          return prev;
        }
        const next = prev.performance + 5;
        return { ...prev, performance: next > 100 ? 100 : next };
      });
    }, 40);

    return () => {
      clearInterval(pTimer);
      clearInterval(perfTimer);
    };
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Filtrelenmiş Projeler Listesi
  const filteredProjects = PROJECTS_DATA.filter((project) => {
    const matchesCategory = selectedProjectCategory === 'Tümü' || project.category === selectedProjectCategory;
    const matchesSearch = project.title.toLowerCase().includes(projectSearch.toLowerCase()) || 
                          project.desc.toLowerCase().includes(projectSearch.toLowerCase()) ||
                          project.technologies.some(tech => tech.toLowerCase().includes(projectSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  
  // Arama Girişi State
  const [cityInput, setCityInput] = useState('');
  
  // İletişim Formu States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('idle');
  
  // To Do App States
  const [todoInput, setTodoInput] = useState('');
  const [todoFilter, setTodoFilter] = useState('all');
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "React 19 özelliklerini incele", completed: true },
      { id: 2, text: "Portfolyo arayüzünü güncelle", completed: false },
      { id: 3, text: "Yeni blog yazısı yayınla", completed: false }
    ];
  });

  // Blog Okuma States
  const [selectedPost, setSelectedPost] = useState(null);

  // Mobil Vitrin Aktif Sekme State (shop, cart, profile)
  const [mobileTab, setMobileTab] = useState('shop');
  
  // Trendsepetix Mobil Sepet Verileri
  const [mobileCart, setMobileCart] = useState([
    { id: 991, name: 'Slim Fit Gömlek', price: 1174, quantity: 1, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500' },
    { id: 992, name: 'Yün Atkı', price: 518, quantity: 1, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500' }
  ]);
  const cartCount = mobileCart.reduce((sum, item) => sum + item.quantity, 0);

  const addMobileCart = (product) => {
    setMobileCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Kod Parçacığı Kopyalandı Bildirimi State
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToastNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  const [weatherData, setWeatherData] = useState({
    name: "İstanbul",
    temp: 28,
    tempMax: 31,
    tempMin: 22,
    condition: "Parçalı Bulutlu",
    wind: 18,
    windDirection: 220,
    humidity: 65,
    uvIndex: 4,
    sunrise: "2026-07-30T06:12",
    sunset: "2026-07-30T19:48",
    aqi: 35,
    icon: "⛅",
    isDay: 1,
    hourly: [
      { time: "00:00", temp: 21 },
      { time: "03:00", temp: 20 },
      { time: "06:00", temp: 22 },
      { time: "09:00", temp: 25 },
      { time: "12:00", temp: 28 },
      { time: "15:00", temp: 30 },
      { time: "18:00", temp: 27 },
      { time: "21:00", temp: 23 }
    ],
    forecast: [
      { day: "Bugün", tempMax: 31, tempMin: 22, tempAvg: 26, condition: "Parçalı Bulutlu", icon: "⛅" },
      { day: "Yarın", tempMax: 30, tempMin: 21, tempAvg: 25, condition: "Açık", icon: "☀️" },
      { day: "Cumartesi", tempMax: 29, tempMin: 20, tempAvg: 24, condition: "Açık", icon: "☀️" },
      { day: "Pazar", tempMax: 28, tempMin: 19, tempAvg: 23, condition: "Parçalı Bulutlu", icon: "⛅" },
      { day: "Pazartesi", tempMax: 27, tempMin: 18, tempAvg: 22, condition: "Yağmurlu", icon: "🌧️" }
    ]
  });

  // Birim Dönüştürücü (°C / °F) State & Helper
  const [tempUnit, setTempUnit] = useState('C'); // 'C' | 'F'
  const formatTemp = (celsius) => {
    if (celsius === null || celsius === undefined) return '--';
    if (tempUnit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return celsius;
  };

  // Arama Geçmişi & Favoriler (LocalStorage Destekli)
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('weather_search_history');
      return saved ? JSON.parse(saved) : ['İstanbul', 'Ankara', 'İzmir', 'Van', 'Antalya'];
    } catch (e) {
      return ['İstanbul', 'Ankara', 'İzmir', 'Van', 'Antalya'];
    }
  });

  const addToSearchHistory = (city) => {
    if (!city) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      const updated = [city, ...filtered].slice(0, 6);
      try {
        localStorage.setItem('weather_search_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('weather_search_history');
    } catch (e) {}
  };

  // Geolocation (Otomatik Konum Algılama) State & Handler
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  // Tam Detaylı Canlı Hava Verisi Çekici (Open-Meteo REST API & Air Quality API)
  const fetchFullWeatherData = async (latitude, longitude, cityName) => {
    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m&current_weather=true&hourly=temperature_2m,relative_humidity_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`
    );
    if (!wRes.ok) {
      throw new Error(`Open-Meteo Weather API HTTP Error: ${wRes.status}`);
    }
    const wData = await wRes.json();

    let aqiVal = 35;
    try {
      const aqRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`
      );
      if (aqRes.ok) {
        const aqData = await aqRes.json();
        if (aqData && aqData.current && aqData.current.us_aqi !== undefined) {
          aqiVal = Math.round(aqData.current.us_aqi);
        }
      }
    } catch (e) {
      console.warn("AQI API fetch notice:", e);
    }

    const currentTemp = wData.current && wData.current.temperature_2m !== undefined
      ? wData.current.temperature_2m
      : (wData.current_weather && wData.current_weather.temperature !== undefined ? wData.current_weather.temperature : 0);
    const roundedTemp = Math.round(currentTemp);

    const currentWeatherCode = wData.current && wData.current.weather_code !== undefined
      ? wData.current.weather_code
      : (wData.current_weather && wData.current_weather.weathercode !== undefined ? wData.current_weather.weathercode : 0);
    const currentInfo = mapWeatherCode(currentWeatherCode);

    const isDay = wData.current && wData.current.is_day !== undefined
      ? wData.current.is_day
      : (wData.current_weather && wData.current_weather.is_day !== undefined ? wData.current_weather.is_day : 1);

    const feelsLikeVal = wData.current && wData.current.apparent_temperature !== undefined
      ? Math.round(wData.current.apparent_temperature)
      : (wData.hourly && wData.hourly.apparent_temperature && wData.hourly.apparent_temperature[0] !== undefined
        ? Math.round(wData.hourly.apparent_temperature[0])
        : roundedTemp);

    const windSpeedVal = wData.current && wData.current.wind_speed_10m !== undefined
      ? Math.round(wData.current.wind_speed_10m)
      : (wData.current_weather && wData.current_weather.windspeed !== undefined ? Math.round(wData.current_weather.windspeed) : 0);

    const windDirectionVal = wData.current && wData.current.wind_direction_10m !== undefined
      ? wData.current.wind_direction_10m
      : (wData.current_weather && wData.current_weather.winddirection !== undefined ? wData.current_weather.winddirection : 0);

    const humidityVal = wData.current && wData.current.relative_humidity_2m !== undefined
      ? wData.current.relative_humidity_2m
      : (wData.hourly && wData.hourly.relative_humidity_2m ? wData.hourly.relative_humidity_2m[0] : 62);

    // 5 Günlük Tahmin
    const dailyForecast = [];
    if (wData.daily && wData.daily.time) {
      for (let i = 0; i < Math.min(5, wData.daily.time.length); i++) {
        const dayInfo = mapWeatherCode(wData.daily.weathercode[i]);
        let dayLabel = formatDayName(wData.daily.time[i]);
        if (i === 0) dayLabel = "Bugün";
        else if (i === 1) dayLabel = "Yarın";

        const maxT = Math.round(wData.daily.temperature_2m_max[i]);
        const minT = Math.round(wData.daily.temperature_2m_min[i]);

        dailyForecast.push({
          day: dayLabel,
          tempMax: maxT,
          tempMin: minT,
          tempAvg: Math.round((maxT + minT) / 2),
          condition: dayInfo.condition,
          icon: dayInfo.icon
        });
      }
    }

    // 24 Saatsiz Saatlik Tahmin (8 nokta)
    const hourlyList = [];
    if (wData.hourly && wData.hourly.time) {
      const currentHourIndex = new Date().getHours();
      for (let i = 0; i < 24; i += 3) {
        const idx = (currentHourIndex + i) % wData.hourly.time.length;
        const timeStr = wData.hourly.time[idx];
        const hourLabel = timeStr ? timeStr.slice(11, 16) : `${i}:00`;
        const tempVal = Math.round(wData.hourly.temperature_2m && wData.hourly.temperature_2m[idx] !== undefined ? wData.hourly.temperature_2m[idx] : roundedTemp);
        hourlyList.push({ time: hourLabel, temp: tempVal });
      }
    }

    return {
      name: cityName,
      temp: roundedTemp,
      feelsLike: feelsLikeVal,
      tempMax: wData.daily ? Math.round(wData.daily.temperature_2m_max[0]) : roundedTemp + 4,
      tempMin: wData.daily ? Math.round(wData.daily.temperature_2m_min[0]) : roundedTemp - 4,
      condition: currentInfo.condition,
      wind: windSpeedVal,
      windDirection: windDirectionVal,
      humidity: humidityVal,
      uvIndex: wData.daily && wData.daily.uv_index_max ? Math.round(wData.daily.uv_index_max[0] * 10) / 10 : 4.5,
      sunrise: wData.daily && wData.daily.sunrise ? wData.daily.sunrise[0] : null,
      sunset: wData.daily && wData.daily.sunset ? wData.daily.sunset[0] : null,
      aqi: aqiVal,
      icon: currentInfo.icon,
      isDay: isDay,
      hourly: hourlyList,
      forecast: dailyForecast
    };
  };

  const fetchWeatherByCoords = async (latitude, longitude, customName = null) => {
    setGeoLoading(true);
    setGeoError('');
    try {
      let locationName = customName;
      if (!locationName) {
        try {
          const revRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=tr`
          );
          const revData = await revRes.json();
          if (revData && revData.address) {
            locationName = revData.address.city || revData.address.town || revData.address.district || revData.address.province || revData.address.state || "Mevcut Konum";
          }
        } catch (e) {
          locationName = "Mevcut Konum";
        }
      }

      const fullData = await fetchFullWeatherData(latitude, longitude, locationName || "Mevcut Konum");
      setWeatherData({ ...fullData, isGeo: true });
      addToSearchHistory(locationName || "Mevcut Konum");
      showToastNotification(`📍 ${locationName || 'Mevcut Konum'} hava durumu yüklendi!`);
    } catch (err) {
      console.error("Geocoding/Weather fetch error:", err);
      setGeoError("Şehir bulunamadı, lütfen geçerli bir şehir yazın.");
    } finally {
      setGeoLoading(false);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Tarayıcınız konum özelliğini desteklemiyor.");
      return;
    }
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Konum izni reddedildi. Şehir aramayı kullanabilirsiniz.");
        } else {
          setGeoError("Konum bilgisi alınamadı.");
        }
      },
      { timeout: 8000 }
    );
  };

  // Weather modal açıldığında otomatik konum kontrolü
  useEffect(() => {
    if (isWeatherOpen && !weatherData.isGeo) {
      handleGeolocation();
    }
  }, [isWeatherOpen]);

  // Sayfa ilk yüklendiğinde canlı varsayılan hava durumunu çek (İstanbul)
  useEffect(() => {
    fetchFullWeatherData(41.0082, 28.9784, 'İstanbul').then((data) => {
      setWeatherData(prev => ({ ...prev, ...data }));
    }).catch(err => console.error("Initial weather fetch error:", err));
  }, []);

  // To Do LocalStorage Senkronizasyonu
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Canlı Hava Durumu Arama Handler (Geocoding API -> Forecast API)
  const handleSearch = async (targetCity) => {
    const rawInput = (targetCity || cityInput).trim();
    if (!rawInput) return;

    setGeoError('');

    try {
      // 1. Open-Meteo Geocoding API ile arama
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(rawInput)}&count=5&language=tr`
      );
      if (!geoRes.ok) {
        throw new Error("Geocoding API request failed");
      }
      const geoData = await geoRes.json();

      let match = null;
      if (geoData && geoData.results && geoData.results.length > 0) {
        match = geoData.results.find(r => r.country_code === 'TR') || geoData.results[0];
      }

      if (match) {
        const { latitude, longitude, name } = match;
        const fullData = await fetchFullWeatherData(latitude, longitude, name);
        setWeatherData({ ...fullData, isGeo: false });
        addToSearchHistory(name);
        setCityInput('');
        showToastNotification(`🌤️ ${name} canlı hava durumu yüklendi! (${fullData.temp}°C)`);
      } else {
        setGeoError("Şehir bulunamadı, lütfen geçerli bir şehir yazın.");
      }
    } catch (err) {
      console.error("Search weather error:", err);
      setGeoError("Şehir bulunamadı, lütfen geçerli bir şehir yazın.");
    }
  };

  // İletişim Gönderim (EmailJS Entegrasyonu)
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus('sending');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_test';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_test';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_test';

    const templateParams = {
      from_name: formData.name,
      reply_to: formData.email,
      subject: formData.subject || 'Portfolyo İletişim Mesajı',
      message: formData.message
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setFormStatus('idle');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsContactOpen(false);
        showToastNotification("Mesajınız başarıyla iletildi! ✔️");
      }, (err) => {
        console.error('FAILED...', err);
        setFormStatus('idle');
        showToastNotification("Mesaj gönderilemedi, lütfen tekrar deneyin. ❌");
      });
  };

  // To Do Ekleme
  const addTodo = (e) => {
    e.preventDefault();
    if (!todoInput.trim()) return;
    setTodos([...todos, {
      id: Date.now(),
      text: todoInput.trim(),
      completed: false
    }]);
    setTodoInput('');
  };

  // To Do Tamamlama Durumu Değiştirme
  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // To Do Silme
  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  // Filtrelenmiş To Do Listesi
  const filteredTodos = todos.filter(t => {
    if (todoFilter === 'active') return !t.completed;
    if (todoFilter === 'completed') return t.completed;
    return true;
  });

  // Panoya Kopyalama Fonksiyonu
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      showToastNotification("Kod panoya kopyalandı!");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <>
      {/* 1. Navbar & Gezinti */}
      <Navbar theme={theme} toggleTheme={toggleTheme} setIsContactOpen={setIsContactOpen} currentView={currentView} setCurrentView={setCurrentView} />

      {currentView === 'dashboard' && user ? (
        <SaaSDashboard />
      ) : currentView === 'login' ? (
        <LoginRegister onAuthSuccess={() => setCurrentView('dashboard')} onBackToPortfolio={() => setCurrentView('portfolio')} />
      ) : (
        <>
          {/* Ana Kapsayıcı */}
      <main className="main-container">
        
        {/* 2. Hero Bölümü */}
        <section id="hero" className="hero-section">
          {/* Gradyan Kenarlıklı Avatar */}
          <div className="avatar-wrapper">
            <img src={heroImage} className="avatar-img" alt="Botan Külay" decoding="async" />
          </div>
          
          <h1>Botan Külay</h1>
          <p className="subtitle">Frontend & Full Stack Developer</p>
          
          {/* Sosyal Linkler & CV Butonu */}
          <div className="social-links">
            <a 
              href="https://github.com/botankly" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn github"
              aria-label="Botan Külay GitHub Profiline Git"
            >
              <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a 
              href="https://www.linkedin.com/in/botan-k%C3%BClay-6786a4295/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn linkedin"
              aria-label="Botan Külay LinkedIn Profiline Git"
            >
              <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
            <button 
              onClick={() => setIsCvOpen(true)}
              className="social-btn cv"
              style={{
                border: 'none',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.03)'
              }}
              aria-label="Özgeçmiş CV önizleme modalını aç"
            >
              <svg style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              CV Önizle / İndir
            </button>
          </div>
          
          {/* Teknolojiler */}
          <div className="skills-container">
            <span className="skill-badge">React</span>
            <span className="skill-badge">JavaScript</span>
            <span className="skill-badge">Tailwind CSS</span>
            <span className="skill-badge">TypeScript</span>
            <span className="skill-badge">Redux</span>
            <span className="skill-badge">HTML</span>
            <span className="skill-badge">CSS</span>
          </div>
        </section>

        {/* 3. Hakkımda Bölümü */}
        <section id="hakkimda" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
          <h2 className="section-title">Hakkımda</h2>

          {/* Sayac Bileşeni (Animated Stats Counter) */}
          <div className="stats-counter-bar animate-fadeIn" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
            width: '100%'
          }}>
            <div className="card" style={{ minHeight: 'auto', padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-purple)', fontFamily: 'monospace' }}>
                {stats.projects}+
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.4rem' }}>
                Tamamlanan Proje
              </span>
            </div>
            
            <div className="card" style={{ minHeight: 'auto', padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                {stats.performance}%
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.4rem' }}>
                Temiz Kod & Performans
              </span>
            </div>

            <div className="card" style={{ minHeight: 'auto', padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent-blue)', marginTop: '0.6rem', marginBottom: '0.4rem' }}>
                🎓 Yazılım Müh.
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.4rem' }}>
                Fırat Üniversitesi (Son Sınıf)
              </span>
            </div>
          </div>
          
          <div className="about-container">
            <div className="about-text-card">
              <h3>Geliştirici, Problem Çözücü & Teknoloji Tutkunu</h3>
              <p>Fırat Üniversitesi Yazılım Mühendisliği son sınıf öğrencisiyim. Modern web ve mobil geliştirme teknolojilerine duyduğum merakla, kullanıcı dostu, performanslı ve ölçeklenebilir dijital deneyimler inşa etmeye odaklanıyorum.</p>
              <p>Yazılımı sadece kod yazmak olarak değil, sürekli öğrenme ve toplulukla gelişme süreci olarak görüyorum. Arkadaşlarımla yazılım mimarileri ve yeni teknolojiler üzerine fikir alışverişinde bulunmayı, bilgi paylaşarak birlikte büyümeyi çok önemsiyorum.</p>
              <p>Ekran başından kalktığımda ise disiplinimi ve enerjimi korumak için spor yapıyorum; futbol ve voleybol oynamak zihnimi taze tutmamı sağlıyor.</p>
            </div>

            <div className="about-stats-container">
              <div className="stat-card">
                <span className="stat-card-title">🎓 Eğitim</span>
                <span className="stat-card-value">Fırat Üniversitesi - Yazılım Mühendisliği (Son Sınıf)</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-title">💻 Odak Alanı</span>
                <span className="stat-card-value">Web & Mobil Geliştirme (React, React Native, Node.js)</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-title">⚽ İlgi Alanları</span>
                <span className="stat-card-value">Spor, Futbol, Voleybol & Topluluk ve Bilgi Paylaşımı</span>
              </div>
            </div>
          </div>
        </section>

        {/* Kariyer & Eğitim Yolculuğu (Timeline) Bölümü */}
        <section id="journey" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
          <h2 className="section-title">Kariyer & Eğitim Yolculuğu</h2>
          <div className="timeline">
            {/* Item 1 */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2026 - Günümüz</div>
              <div className="timeline-content">
                <h3>Trendsepetix AI & Web Geliştirme</h3>
                <span className="timeline-tag">Proje Lideri & Fullstack Geliştirici</span>
                <p>Yapay zeka ve veri madenciliği tabanlı Trendsepetix projesini tasarladı. Python (Django) ve React mimarisiyle Apriori birliktelik kural analizi sunan karar destek sistemini hayata geçirdi.</p>
              </div>
            </div>
            
            {/* Item 2 */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2025 - 2026</div>
              <div className="timeline-content">
                <h3>Yazılım Geliştirme Stajı</h3>
                <span className="timeline-tag">Stajyer Geliştirici</span>
                <p>Ön uç geliştirme süreçlerinde ve API entegrasyonlarında aktif görev aldı. Git ve takım çalışması pratikleri kazandı, modern JavaScript kütüphanelerini deneyimledi.</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2022 - 2026</div>
              <div className="timeline-content">
                <h3>Fırat Üniversitesi</h3>
                <span className="timeline-tag">Yazılım Mühendisliği (Lisans)</span>
                <p>Algoritmalar, veri yapıları, nesne yönelimli programlama, veritabanı yönetim sistemleri ve yazılım mimarileri üzerine teorik ve pratik eğitim aldı.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Yetenek Havuzu Bölümü */}
        <section id="skills-section" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
          <h2 className="section-title">Yetenek Havuzu</h2>
          
          {/* Tab buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {Object.keys(SKILLS_DATA).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSkillTab(tab)}
                className="btn"
                style={{
                  background: activeSkillTab === tab ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.03)',
                  color: activeSkillTab === tab ? '#fff' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: activeSkillTab === tab ? 'var(--accent-purple)' : 'var(--border-color)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab === 'frontend' && '💻 Frontend'}
                {tab === 'backend' && '⚙️ Backend'}
                {tab === 'mobile' && '📱 Mobile'}
                {tab === 'devops' && '🛠️ Tools & DevOps'}
              </button>
            ))}
          </div>
          
          {/* Skills Grid */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.2rem' }}>
            {SKILLS_DATA[activeSkillTab].map((skill) => (
              <div key={skill.name} className="card" style={{ minHeight: 'auto', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>{skill.icon}</span>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.1rem', color: 'var(--text-main)' }}>{skill.name}</h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-cyan)' }}>{skill.level}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Projelerim Bölümü */}
        <section id="projeler" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
          <h2 className="section-title">Projelerim</h2>
          
          {/* Proje Arama ve Kategori Filtreleme */}
          <div className="project-filter-bar animate-fadeIn" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            marginBottom: '2.5rem',
            alignItems: 'center',
            width: '100%'
          }}>
            {/* Arama Kutusu & Etiket Filtre Temizleme */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <input
                type="text"
                placeholder="Proje adı veya kullanılan teknoloji ara..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1.2rem',
                  paddingRight: projectSearch ? '6rem' : '1.2rem',
                  borderRadius: '14px',
                  border: projectSearch ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                className="search-input"
              />
              {projectSearch && (
                <button
                  onClick={() => setProjectSearch('')}
                  style={{
                    position: 'absolute',
                    right: '0.6rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  title="Filtreyi Temizle"
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }}
                >
                  Temizle ✕
                </button>
              )}
            </div>

            {/* Seçili Etiket Göstergesi */}
            {projectSearch && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Aktif Filtre:</span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  🏷️ {projectSearch}
                  <button 
                    onClick={() => setProjectSearch('')} 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 'bold', padding: 0, fontSize: '0.85rem' }}
                    title="Filtreyi Kaldır"
                  >
                    ✕
                  </button>
                </span>
              </div>
            )}

            {/* Kategori Butonları */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Tümü', 'Frontend', 'Fullstack', 'Mobile'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedProjectCategory(cat)}
                  style={{
                    background: selectedProjectCategory === cat ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.03)',
                    color: selectedProjectCategory === cat ? '#000' : 'var(--text-muted)',
                    border: '1px solid',
                    borderColor: selectedProjectCategory === cat ? 'var(--accent-cyan)' : 'var(--border-color)',
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div key={project.id} className="card" style={project.featured ? { borderColor: 'rgba(99, 102, 241, 0.4)', boxShadow: '0 0 15px rgba(99, 102, 241, 0.05)' } : {}}>
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="card-tag" style={project.featured ? { color: 'var(--accent-purple)', fontWeight: '800' } : {}}>{project.tag}</span>
                    <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.color='#fff'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-muted)'} title="GitHub Deposu">
                      <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', margin: '0.4rem 0' }}>{project.title}</h3>
                    <p>{project.desc}</p>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {project.technologies.map(tech => (
                        <span
                          key={tech}
                          onClick={() => setProjectSearch(tech)}
                          title={`"${tech}" ile filtrele`}
                          style={{
                            fontSize: '9px', padding: '3px 8px', borderRadius: '5px',
                            backgroundColor: projectSearch === tech ? 'rgba(56,189,248,0.18)' : 'var(--bg-dark)',
                            color: projectSearch === tech ? '#fff' : 'var(--accent-cyan)',
                            border: projectSearch === tech ? '1px solid rgba(56,189,248,0.6)' : '1px solid rgba(56, 189, 248, 0.15)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            userSelect: 'none'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.opacity = '0.75'; }}
                          onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
                        >{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {project.hasDetails && (
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        if (project.detailAction === 'weather') {
                          setIsWeatherOpen(true);
                        } else {
                          setSelectedProjectModal(project);
                        }
                      }} className="card-link">Detayları Gör →</a>
                    )}
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="card-link">GitHub →</a>
                    {project.detailAction === 'weather' ? (
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        setIsWeatherOpen(true);
                      }} className="card-link">Canlı Gör →</a>
                    ) : (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="card-link">Canlı Gör →</a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Aranan kriterlere uygun proje bulunamadı.</p>
              </div>
            )}
          </div>
        </section>

        {/* 5. Mobil Uygulama Vitrini */}
        <section id="mobile-showcase" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
          <h2 className="section-title">Mobil Uygulamalarım</h2>
          
          <div className="mobile-showcase-container">
            {/* Sol Taraf: Açıklama ve Detaylar */}
            <div className="mobile-details">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="card-tag" style={{ color: 'var(--accent-purple)', fontWeight: '800' }}>⭐ Öne Çıkan / Mobil</span>
                <span className="card-tag" style={{ color: 'var(--text-muted)' }}>|</span>
                <span className="card-tag" style={{ color: 'var(--accent-cyan)' }}>React Native & Expo</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0.2rem 0 1rem 0' }}>Trendsepetix Mobile</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>
                Trendsepetix platformunun iOS ve Android uyumlu, akıcı animasyonlara ve hızlı sipariş tamamlama adımlarına sahip mobil alışveriş uygulaması. Sepet yönetimi ve kullanıcı arayüzü modern e-ticaret trendlerine göre optimize edilmiştir.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '0.5rem 0' }}>
                <span className="skill-badge" style={{ fontSize: '11px', padding: '4px 10px' }}>React Native</span>
                <span className="skill-badge" style={{ fontSize: '11px', padding: '4px 10px' }}>Expo CLI</span>
                <span className="skill-badge" style={{ fontSize: '11px', padding: '4px 10px' }}>AsyncStorage</span>
                <span className="skill-badge" style={{ fontSize: '11px', padding: '4px 10px' }}>Lottie Animations</span>
              </div>

              {/* QR Kod */}
              <div className="qr-card">
                <div className="qr-code-placeholder">
                  <svg width="73" height="73" viewBox="0 0 29 29" fill="none" stroke="#111" strokeWidth="1">
                    <path d="M1 1h7v7H1V1zm1 1v5h5V2H2zm18-1h7v7h-7V1zm1 1v5h5V2h-5zM1 20h7v7H1v-7zm1 1v5h5v-5H2zm11-17h2v2h-2V4zm0 4h2v2h-2V8zm4-4h2v2h-2V4zm-2 6h2v2h-2v-2zm4 0h2v2h-2v-2zm-6 4h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm4 0h2v2h-2v-2zm0 4h2v2h-2v-2zm-4 2h2v2h-2v-2zm-6 2h2v2h-2v-2zm4 2h2v2h-2v-2z" fill="#0b0f19" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Trendsepetix Mobile Canlı Dene</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                    Expo Go uygulamasını telefonunuza kurun, kameranız ile yandaki QR kodu taratarak projeyi anında telefonunuzda canlı çalıştırın.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <a 
                  href="https://trendsepetix.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary" 
                  style={{ gap: '8px', fontSize: '13px', padding: '10px 22px' }}
                >
                  Canlı Gör
                </a>
                <a 
                  href="https://github.com/botankly/Trendsepetix" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary" 
                  style={{ gap: '8px', fontSize: '13px', padding: '10px 22px' }}
                >
                  GitHub Deposu
                </a>
                <a 
                  href="https://expo.dev" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary" 
                  style={{ gap: '8px', fontSize: '13px', padding: '10px 22px', backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                  Expo Go İndir
                </a>
              </div>
            </div>

            {/* Sağ Taraf: İnteraktif CSS Telefon Çerçevesi */}
            <div className="mobile-mockup-side">
              <div className="phone-mockup">
                <div className="phone-notch">
                  <div className="phone-speaker"></div>
                </div>

                {/* Telefon Ekranı */}
                <div className="phone-screen">
                  <div className="phone-header">
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#94a3b8' }}>09:41</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-cyan)' }}>Trendsepetix</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>🛒 ({cartCount})</span>
                  </div>

                  <div className="phone-body">
                    {mobileTab === 'shop' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'scaleIn 0.25s ease' }}>
                        {[
                          { id: 991, name: 'Slim Fit Gömlek', price: 1174, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', desc: 'Özel tasarım slim-fit kesim, nefes alan pamuklu kumaş.' },
                          { id: 992, name: 'Yün Atkı', price: 518, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500', desc: '%100 yün, soğuk kış günleri için sıcak tutan yumuşak doku.' },
                          { id: 993, name: 'Drone', price: 25807, image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500', desc: '4K ultra HD kamera, 30 dakika uçuş süresi ve engel sensörü.' }
                        ].map(prod => (
                          <div key={prod.id} style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', gap: '10px', textAlign: 'left' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', flexShrink: 0 }}>
                              <img src={prod.image} alt={prod.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} loading="lazy" decoding="async" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                                <strong style={{ fontSize: '11px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{prod.name}</strong>
                                <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '800', flexShrink: 0 }}>{prod.price.toLocaleString('tr-TR')} TL</span>
                              </div>
                              <p style={{ fontSize: '9px', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{prod.desc}</p>
                              <button 
                                onClick={() => addMobileCart(prod)}
                                style={{ width: '100%', padding: '5px', fontSize: '9.5px', backgroundColor: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', marginTop: '4px' }}
                              >
                                ➕ Sepete Ekle
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {mobileTab === 'cart' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'scaleIn 0.25s ease', textAlign: 'left' }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Sepetiniz ({cartCount} Ürün)</span>
                        
                        {mobileCart.length > 0 ? (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                              {mobileCart.map((item) => (
                                <div key={item.id} style={{ backgroundColor: '#1e293b', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', gap: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', flexShrink: 0 }}>
                                      <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} loading="lazy" decoding="async" />
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                      <strong style={{ color: '#fff', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</strong>
                                      <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>Miktar: {item.quantity} adet</span>
                                    </div>
                                  </div>
                                  <span style={{ fontWeight: '700', color: 'var(--accent-cyan)', flexShrink: 0 }}>{(item.price * item.quantity).toLocaleString('tr-TR')} TL</span>
                                </div>
                              ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', fontSize: '12px', fontWeight: '800' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Toplam:</span>
                              <span style={{ color: '#fff' }}>{mobileCart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('tr-TR')} TL</span>
                            </div>

                            <button 
                              onClick={() => { alert('Sipariş Alındı!'); setMobileCart([]); }}
                              style={{ width: '100%', padding: '8px', fontSize: '11px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', marginTop: '4px' }}
                            >
                              💳 Siparişi Tamamla
                            </button>
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '11px' }}>
                            Sepetiniz boş.
                          </div>
                        )}
                      </div>
                    )}

                    {mobileTab === 'profile' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center', animation: 'scaleIn 0.25s ease' }}>
                        <div style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', margin: '0 auto 4px auto', overflow: 'hidden' }}>
                          <img src={heroImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" loading="lazy" decoding="async" />
                        </div>
                        <strong style={{ fontSize: '13px', color: '#fff', display: 'block' }}>Botan Külay</strong>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', marginTop: '-8px' }}>botan.kulay@gmail.com</span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px', fontSize: '11px', textAlign: 'left' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#1e293b', padding: '8px 12px', borderRadius: '8px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Siparişlerim</span>
                            <strong style={{ color: '#fff' }}>3 Aktif</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#1e293b', padding: '8px 12px', borderRadius: '8px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Kayıtlı Adresler</span>
                            <strong style={{ color: '#fff' }}>2 Kayıtlı</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Telefon Alt Sekme Çubuğu */}
                  <div className="phone-tab-bar">
                    <button 
                      onClick={() => setMobileTab('shop')} 
                      className={`phone-tab ${mobileTab === 'shop' ? 'active' : ''}`}
                    >
                      🛍️ Mağaza
                    </button>
                    <button 
                      onClick={() => setMobileTab('cart')} 
                      className={`phone-tab ${mobileTab === 'cart' ? 'active' : ''}`}
                    >
                      🛒 Sepet
                    </button>
                    <button 
                      onClick={() => setMobileTab('profile')} 
                      className={`phone-tab ${mobileTab === 'profile' ? 'active' : ''}`}
                    >
                      👤 Profil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Kod Parçacıkları & İpuçları Bölümü */}
        <section id="snippets" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
          <h2 className="section-title">Kod Parçacıkları & İpuçları</h2>
          
          <div className="code-grid">
            {CODE_SNIPPETS.map((snippet) => (
              <div key={snippet.id} className="ide-window">
                <div className="ide-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="ide-dots">
                    <span className="ide-dot red"></span>
                    <span className="ide-dot yellow"></span>
                    <span className="ide-dot green"></span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleRunCode(snippet.id, snippet.runSimulation)} 
                      className="ide-copy-btn"
                      style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>▶️ Çalıştır</span>
                    </button>
                    <button 
                      onClick={() => handleCopy(snippet.id, snippet.code)} 
                      className="ide-copy-btn"
                    >
                      {copiedId === snippet.id ? (
                        <span>✔️ Kopyalandı!</span>
                      ) : (
                        <>
                          <svg style={{ width: '13px', height: '13px' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          <span>Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <pre className="ide-body">
                  <code>{snippet.code}</code>
                </pre>

                {playgroundOutputs[snippet.id] && (
                  <div style={{
                    background: '#040711',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '1rem',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '0.8rem',
                    color: '#10b981',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', borderBottom: '1px dashed rgba(16, 185, 129, 0.2)', paddingBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#fff' }}>📟 Console Output</span>
                      <button 
                        onClick={() => setPlaygroundOutputs(prev => {
                          const next = { ...prev };
                          delete next[snippet.id];
                          return next;
                        })}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Temizle
                      </button>
                    </div>
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0, color: 'inherit', font: 'inherit' }}>
                      {playgroundOutputs[snippet.id]}
                    </pre>
                  </div>
                )}

                <div className="snippet-details">
                  <h3>{snippet.title}</h3>
                  <p>{snippet.desc}</p>
                  <div style={{ marginTop: '0.4rem' }}>
                    <span className="skill-badge" style={{ fontSize: '10px', padding: '3px 8px' }}>{snippet.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Bağımsız Blog Bölümü */}
        <section id="blog" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
          <h2 className="section-title">Blog / Yazılarım</h2>
          
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            {BLOG_POSTS.map((post) => (
              <div 
                key={post.id} 
                className="card" 
                onClick={() => { setIsBlogOpen(true); setSelectedPost(post); }} 
                style={{ cursor: 'pointer' }}
              >
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span className="card-tag" style={{ color: 'var(--accent-cyan)' }}>📅 {post.date}</span>
                  <span className="card-tag" style={{ color: 'var(--accent-purple)' }}>⏱️ {post.readTime}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>{post.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.2rem' }}>{post.summary}</p>
                </div>
                <span 
                  onClick={(e) => { e.stopPropagation(); setIsBlogOpen(true); setSelectedPost(post); }}
                  className="card-link" 
                  style={{ marginTop: 'auto', cursor: 'pointer' }}
                >
                  Makaleyi Oku →
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Botan-CLI Terminal Bölümü */}
        <section id="terminal-section" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
          <h2 className="section-title">Botan-CLI Terminal</h2>
          
          <div className="card" style={{
            background: '#090d16',
            borderColor: '#0f1f38',
            padding: 0,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            fontFamily: '"Fira Code", "Courier New", Courier, monospace',
            display: 'flex',
            flexDirection: 'column',
            height: '350px',
            textAlign: 'left'
          }}>
            {/* Terminal Header */}
            <div style={{
              background: '#0f172a',
              padding: '0.8rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>botan@kulay-pc: ~</span>
              <span style={{ width: '40px' }}></span>
            </div>
            
            {/* Terminal Body */}
            <div 
              className="terminal-body"
              style={{
                flex: 1,
                padding: '1.2rem',
                overflowY: 'auto',
                color: '#22c55e',
                fontSize: '0.85rem',
                lineHeight: '1.5',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
              onClick={() => document.getElementById('terminal-input')?.focus()}
            >
              <div>Botan-CLI [Version 1.0.0]</div>
              <div>Yardım ve tüm komutlar için <strong style={{ color: '#fff' }}>'help'</strong> yazıp Enter'a basın.</div>
              <div style={{ borderBottom: '1px dashed rgba(34, 197, 94, 0.2)', margin: '4px 0 10px 0' }}></div>
              
              {terminalHistory.map((item, idx) => (
                <div key={idx}>
                  <div style={{ color: '#38bdf8', fontWeight: 'bold' }}>
                    <span>$ </span>
                    <span style={{ color: '#fff' }}>{item.command}</span>
                  </div>
                  <div style={{ 
                    whiteSpace: 'pre-wrap', 
                    color: item.type === 'error' ? '#f87171' : item.type === 'success' ? '#22c55e' : '#a7f3d0',
                    marginTop: '2px',
                    marginBottom: '8px'
                  }}>
                    {item.output}
                  </div>
                </div>
              ))}

              <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>$</span>
                <input
                  id="terminal-input"
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  autoComplete="off"
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    padding: 0
                  }}
                  placeholder="Komut yazın..."
                />
              </form>
            </div>
          </div>
        </section>

        {/* 8. GitHub Aktivite Bölümü */}
        <section id="github-activity" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
          <h2 className="section-title">GitHub Aktivitem</h2>
          
          <div className="github-grid">
            <div className="github-card-wrapper">
              <img 
                src="https://github-readme-stats.vercel.app/api?username=botankly&show_icons=true&theme=tokyonight&hide_border=true" 
                className="github-card-img" 
                alt="GitHub İstatistikleri" 
                loading="lazy"
                decoding="async"
              />
            </div>
            
            <div className="github-card-wrapper">
              <img 
                src="https://github-readme-stats.vercel.app/api/top-langs/?username=botankly&layout=compact&theme=tokyonight&hide_border=true" 
                className="github-card-img" 
                alt="En Çok Kullanılan Diller" 
                loading="lazy"
                decoding="async"
              />
            </div>
            
            <div className="github-card-wrapper">
              <img 
                src="https://github-readme-streak-stats.herokuapp.com/?user=botankly&theme=tokyonight&hide_border=true" 
                className="github-card-img" 
                alt="GitHub Streak İstatistikleri" 
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* Teknik Sistem Durumu (System Status Footer) */}
        <div className="system-status-ribbon" style={{
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(255, 255, 255, 0.01)',
          padding: '1.2rem 1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2.5rem',
          flexWrap: 'wrap',
          fontSize: '0.8rem',
          fontWeight: '700',
          color: 'var(--text-muted)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
            All Systems Operational
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⚡ Vercel Edge Deployed
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            🚀 React 18 Powered
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            💯 Lighthouse Score: 98+
          </span>
        </div>

        {/* Footer & İletişim Butonu */}
        <footer style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={() => setIsContactOpen(true)} className="btn btn-primary">İletişime Geç</button>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2rem' }}>
            &copy; 2026 Botan Külay. Tüm Hakları Saklıdır.
          </p>
        </footer>

      </main>

      {/* HAVA DURUMU UYGULAMASI MODAL POPUP */}
      {isWeatherOpen && (() => {
        const activeTheme = getWeatherTheme(weatherData.condition, weatherData.isDay);
        const aqiBadge = getAQIBadge(weatherData.aqi);
        const uvBadge = getUVBadge(weatherData.uvIndex);
        const windDir = getWindDirectionLabel(weatherData.windDirection);

        // 24 Saatsiz Saatlik Sıcaklık Grafiği Çizici (SVG Line Chart)
        const render24hChart = (hourlyData) => {
          if (!hourlyData || hourlyData.length === 0) return null;
          const temps = hourlyData.map(h => formatTemp(h.temp));
          const minTemp = Math.min(...temps);
          const maxTemp = Math.max(...temps);
          const range = (maxTemp - minTemp) || 1;

          const width = 420;
          const height = 85;
          const paddingX = 25;
          const paddingY = 22;

          const points = hourlyData.map((h, i) => {
            const x = paddingX + (i * (width - 2 * paddingX)) / (hourlyData.length - 1);
            const val = formatTemp(h.temp);
            const y = height - paddingY - ((val - minTemp) / range) * (height - 2 * paddingY);
            return { x, y, temp: val, time: h.time };
          });

          const pathD = points.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
          const areaD = `${pathD} L ${points[points.length - 1].x} ${height - 6} L ${points[0].x} ${height - 6} Z`;

          return (
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '90px', overflow: 'visible' }}>
              <defs>
                <linearGradient id="weatherChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={activeTheme.accent} stopOpacity="0.45" />
                  <stop offset="100%" stopColor={activeTheme.accent} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#weatherChartGrad)" />
              <path d={pathD} stroke={activeTheme.accent} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#0f172a" stroke={activeTheme.accent} strokeWidth="2" />
                  <text x={p.x} y={p.y - 7} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800">
                    {p.temp}°
                  </text>
                  <text x={p.x} y={height - 2} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600">
                    {p.time}
                  </text>
                </g>
              ))}
            </svg>
          );
        };

        return (
          <div className="modal-overlay" onClick={() => setIsWeatherOpen(false)}>
            <div 
              className="modal-content animate-modalEnter" 
              onClick={(e) => e.stopPropagation()} 
              style={{ maxWidth: '520px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* Üst Bar: Başlık, Sıcaklık Birim Toggle & Kapat */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>
                  Hava Durumu Uygulaması
                </h3>

                {/* Birim Dönüştürücü (°C / °F) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => setTempUnit('C')}
                    style={{
                      padding: '3px 10px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      borderRadius: '7px',
                      border: 'none',
                      background: tempUnit === 'C' ? 'var(--accent-cyan)' : 'transparent',
                      color: tempUnit === 'C' ? '#000' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    °C
                  </button>
                  <button
                    onClick={() => setTempUnit('F')}
                    style={{
                      padding: '3px 10px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      borderRadius: '7px',
                      border: 'none',
                      background: tempUnit === 'F' ? 'var(--accent-cyan)' : 'transparent',
                      color: tempUnit === 'F' ? '#000' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    °F
                  </button>
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: '1.5', textAlign: 'left' }}>
                Saatlik sıcaklık grafiği, Hava Kalitesi (AQI), UV İndeksi, 5 günlük tahmin ve otomatik konum tespiti sunan profesyonel meteoroloji paneli.
              </p>

              {/* Arama Barı ve Mevcut Konum Butonu */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Şehir yazın (örn: Van, İzmir)..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
                <button 
                  onClick={() => handleSearch()} 
                  style={{ padding: '10px 16px', borderRadius: '10px', backgroundColor: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                  title="Şehir Ara"
                >
                  Ara
                </button>
                <button 
                  onClick={handleGeolocation} 
                  disabled={geoLoading}
                  style={{ 
                    padding: '10px 14px', borderRadius: '10px', 
                    backgroundColor: geoLoading ? 'rgba(56,189,248,0.2)' : 'rgba(56, 189, 248, 0.12)', 
                    color: 'var(--accent-cyan)', 
                    border: '1px solid rgba(56, 189, 248, 0.35)', 
                    cursor: geoLoading ? 'wait' : 'pointer', 
                    fontWeight: '700', 
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => { if (!geoLoading) e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.25)'; }}
                  onMouseOut={(e) => { if (!geoLoading) e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.12)'; }}
                  title="Mevcut Konumumu Kullan"
                >
                  {geoLoading ? '⏳ Konum...' : '📍 Konumum'}
                </button>
              </div>

              {/* Hata Bildirimi */}
              {geoError && (
                <div style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.75rem', marginBottom: '10px', textAlign: 'left', fontWeight: '600' }}>
                  ⚠️ {geoError}
                </div>
              )}

              {/* Arama Geçmişi & Favoriler (LocalStorage) */}
              {searchHistory.length > 0 && (
                <div style={{ marginBottom: '14px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      🕒 Arama Geçmişi & Favoriler
                    </span>
                    <button onClick={clearSearchHistory} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '10px', cursor: 'pointer', fontWeight: '700' }}>
                      Temizle ✕
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {searchHistory.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleSearch(c)}
                        style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '600' }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DİNAMİK HAVA DURUMU KARTI (Dynamic Weather Theme Card) */}
              <div style={{ 
                background: activeTheme.bg,
                border: `1px solid ${activeTheme.border}`,
                boxShadow: `0 12px 32px -4px ${activeTheme.border}`,
                padding: '18px 20px', 
                borderRadius: '20px', 
                marginBottom: '16px', 
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s ease'
              }}>
                {/* Animasyonlu Tema Etiketi & Şehir İsmi */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ fontSize: '22px', color: '#fff', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {weatherData.name}
                      {weatherData.isGeo && <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56,189,248,0.2)', color: 'var(--accent-cyan)', border: '1px solid rgba(56,189,248,0.4)', fontWeight: '700' }}>📍 GPS</span>}
                    </h4>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: 0, marginTop: '2px', fontWeight: '600' }}>{weatherData.condition}</p>
                  </div>

                  {/* Dinamik Animasyonlu Hava İkonu */}
                  <div className={activeTheme.iconAnim} style={{ fontSize: '46px', filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.3))' }}>
                    {weatherData.icon}
                  </div>
                </div>

                {/* Sıcaklık Gösterimi (Seçili Birim ile & Hissedilen Sıcaklık) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '40px', fontWeight: '900', color: activeTheme.accent, letterSpacing: '-1px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                      {formatTemp(weatherData.temp)}°{tempUnit}
                    </span>
                    {weatherData.feelsLike !== undefined && (
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginLeft: '10px', fontWeight: '600' }}>
                        (Hissedilen: {formatTemp(weatherData.feelsLike)}°)
                      </span>
                    )}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: '600' }}>
                    Yüksek: <strong style={{ color: '#f43f5e' }}>{formatTemp(weatherData.tempMax)}°</strong> / Düşük: <strong style={{ color: '#60a5fa' }}>{formatTemp(weatherData.tempMin)}°</strong>
                  </span>
                </div>

                {/* EKSTREM METRİKLER GRID (AQI, UV, Nem, Rüzgar, Gün Doğumu/Batımı) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', textAlign: 'left' }}>
                  
                  {/* Hava Kalitesi (AQI) */}
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '8px 10px', borderRadius: '10px', border: `1px solid ${aqiBadge.border}` }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700' }}>HAVA KALİTESİ</div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: aqiBadge.color, marginTop: '2px' }}>{aqiBadge.label}</div>
                  </div>

                  {/* UV İndeksi */}
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '8px 10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700' }}>UV İNDEKSİ</div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: uvBadge.color, marginTop: '2px' }}>{uvBadge.label}</div>
                  </div>

                  {/* Nem Oranı */}
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '8px 10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700' }}>NEM ORANI</div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>💧 %{weatherData.humidity || 65}</div>
                  </div>

                  {/* Rüzgar & Yönü */}
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '8px 10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700' }}>RÜZGAR & YÖNÜ</div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#e2e8f0', marginTop: '2px' }}>💨 {weatherData.wind} km/s ({windDir})</div>
                  </div>

                  {/* Gün Doğumu */}
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '8px 10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700' }}>GÜN DOĞUMU</div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#fbbf24', marginTop: '2px' }}>🌅 {formatTimeHHMM(weatherData.sunrise)}</div>
                  </div>

                  {/* Gün Batımı */}
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '8px 10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700' }}>GÜN BATIMI</div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#f43f5e', marginTop: '2px' }}>🌇 {formatTimeHHMM(weatherData.sunset)}</div>
                  </div>
                </div>
              </div>

              {/* 24-SAATLİK SICAKLIK GRAFİĞİ (SVG Line Chart) */}
              <div style={{ backgroundColor: 'var(--bg-dark)', padding: '14px 16px', borderRadius: '16px', marginBottom: '16px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
                <h5 style={{ color: 'var(--accent-cyan)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📈 24 Saatlİk Sıcaklık Değİşİm Grafİğİ ({tempUnit})
                </h5>
                {render24hChart(weatherData.hourly)}
              </div>

              {/* 5 GÜNLÜK HAVA TAHMİNİ LİSTESİ (5 Days) */}
              <div style={{ marginBottom: '18px', textAlign: 'left' }}>
                <h5 style={{ color: 'var(--accent-cyan)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontWeight: '800' }}>
                  📅 5 Günlük Hava Tahmİnİ
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {weatherData.forecast.map((f, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-dark)', padding: '9px 12px', borderRadius: '12px', fontSize: '13px', border: '1px solid var(--border-color)' }}>
                      <span style={{ color: '#f8fafc', fontWeight: '700', width: '90px' }}>{f.day}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', flex: 1 }}>
                        <span style={{ fontSize: '18px' }}>{f.icon}</span>
                        <span style={{ fontSize: '12px' }}>{f.condition}</span>
                      </span>
                      <span style={{ color: '#f8fafc', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '4px' }}>Ort: {formatTemp(f.tempAvg)}°</span>
                        <span style={{ color: '#f43f5e' }}>{formatTemp(f.tempMax)}°</span>
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                        <span style={{ color: '#60a5fa' }}>{formatTemp(f.tempMin)}°</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teknolojiler */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-cyan)', border: '1px solid rgba(56, 189, 248, 0.15)', fontWeight: '700' }}>React 19</span>
                <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-cyan)', border: '1px solid rgba(56, 189, 248, 0.15)', fontWeight: '700' }}>SVG Line Chart</span>
                <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-cyan)', border: '1px solid rgba(56, 189, 248, 0.15)', fontWeight: '700' }}>AQI & UV Metrics</span>
                <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-cyan)', border: '1px solid rgba(56, 189, 248, 0.15)', fontWeight: '700' }}>Geolocation API</span>
              </div>

              {/* Aksiyon Butonları */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <a href="https://benim-react-sitem.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1, padding: '10px 0', fontSize: '13.5px' }}>Canlı Gör</a>
                <a href="https://github.com/botankly" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, padding: '10px 0', fontSize: '13.5px' }}>GitHub</a>
              </div>

              <button onClick={() => setIsWeatherOpen(false)} className="btn btn-secondary close-btn">Kapat</button>
            </div>
          </div>
        );
      })()}

      {/* İLETİŞİM FORMU MODAL POPUP */}
      {isContactOpen && (
        <div className="modal-overlay" onClick={() => setIsContactOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '800' }}>İletişime Geç</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
              Aşağıdaki formu doldurarak bana e-posta gönderebilirsiniz. En kısa sürede geri dönüş yapacağım.
            </p>
            
            {formStatus === 'success' ? (
              <div className="success-message">
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Mesajınız iletildi!</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Ad Soyad</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Adınız ve Soyadınız"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={formStatus === 'sending'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-posta Adresi</label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="ornek@eposta.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={formStatus === 'sending'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Konu</label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="Mesajınızın konusu nedir?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    disabled={formStatus === 'sending'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mesaj</label>
                  <textarea
                    id="message"
                    required
                    rows="4"
                    placeholder="Bana iletmek istediğiniz detaylı mesaj..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={formStatus === 'sending'}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  disabled={formStatus === 'sending'}
                >
                  {formStatus === 'sending' ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                </button>
              </form>
            )}

            <button 
              onClick={() => setIsContactOpen(false)} 
              className="btn btn-secondary close-btn"
              disabled={formStatus === 'sending'}
              style={{ marginTop: '1rem' }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* TO DO APP MODAL POPUP */}
      {isTodoOpen && (
        <div className="modal-overlay" onClick={() => setIsTodoOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.8rem', fontSize: '1.5rem', fontWeight: '800' }}>To Do App</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem', lineHeight: '1.5' }}>
              Görev ekleyin, tamamlayın, filtreleyin ve silin. Görevleriniz tarayıcı hafızasında (localStorage) saklanır.
            </p>

            <div className="todo-filters">
              {['all', 'active', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setTodoFilter(f)}
                  className={`todo-filter-btn ${todoFilter === f ? 'active' : ''}`}
                >
                  {f === 'all' ? 'Tümü' : f === 'active' ? 'Aktif' : 'Tamamlananlar'}
                </button>
              ))}
            </div>

            <form onSubmit={addTodo} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Yeni bir görev yazın..."
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
              <button
                type="submit"
                style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'background-color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                Ekle
              </button>
            </form>

            <div className="todo-list">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <div className="todo-checkbox-wrapper" onClick={() => toggleTodo(todo.id)}>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => {}}
                        className="todo-checkbox"
                      />
                      <span className="todo-text">{todo.text}</span>
                    </div>
                    <button onClick={() => deleteTodo(todo.id)} className="todo-delete-btn" title="Sil">
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '2rem 0' }}>Gösterilecek görev bulunamadı.</p>
              )}
            </div>

            <button onClick={() => setIsTodoOpen(false)} className="btn btn-secondary close-btn" style={{ marginTop: '1.5rem' }}>Kapat</button>
          </div>
        </div>
      )}

      {/* KİŞİSEL BLOG MODAL POPUP */}
      {isBlogOpen && (
        <div className="modal-overlay" onClick={() => { setIsBlogOpen(false); setSelectedPost(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: selectedPost ? '600px' : '480px', transition: 'max-width 0.3s' }}>
            
            {selectedPost ? (
              <div className="blog-read-view">
                <button onClick={() => setSelectedPost(null)} className="blog-back-btn">
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Geri Dön
                </button>
                
                <div className="blog-card-meta">
                  <span>📅 {selectedPost.date}</span>
                  <span>⏱️ {selectedPost.readTime}</span>
                  <span>✍️ Botan Külay</span>
                </div>
                <h3 style={{ fontSize: '1.6rem', color: '#f8fafc', fontWeight: '800', lineHeight: '1.3', textAlign: 'left', marginBottom: '1rem' }}>{selectedPost.title}</h3>
                
                <div 
                  className="blog-post-content"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
              </div>
            ) : (
              <>
                <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.8rem', fontSize: '1.5rem', fontWeight: '800' }}>Kişisel Blog</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  Web geliştirme, React ve modern ön uç teknolojileri hakkındaki makalelerimi buradan okuyabilirsiniz.
                </p>

                <div className="blog-list">
                  {BLOG_POSTS.map((post) => (
                    <div key={post.id} className="blog-card" onClick={() => setSelectedPost(post)}>
                      <div className="blog-card-meta">
                        <span>📅 {post.date}</span>
                        <span>⏱️ {post.readTime}</span>
                      </div>
                      <h4>{post.title}</h4>
                      <p>{post.summary}</p>
                      <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: '700', display: 'inline-block', marginTop: '0.8rem' }}>Devamını Oku →</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button onClick={() => { setIsBlogOpen(false); setSelectedPost(null); }} className="btn btn-secondary close-btn" style={{ marginTop: '1.5rem' }}>Kapat</button>
          </div>
        </div>
      )}
      {/* TRENDSEPETIX WEB MODAL POPUP */}
      {isTrendsepetixOpen && (
        <div className="modal-overlay" onClick={() => setIsTrendsepetixOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.8rem', fontSize: '1.5rem', fontWeight: '800' }}>Trendsepetix</h3>
            <span className="card-tag" style={{ color: 'var(--accent-purple)' }}>Veri Madenciliği & AI Karar Destek Paneli</span>
            
            <div style={{ textAlign: 'left', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <p>
                <strong>Trendsepetix</strong>, e-ticaret siteleri için müşteri satın alma eğilimlerini (birliktelik analizi), bölgesel satış yoğunluk haritalarını ve mağaza performans grafiklerini analiz eden yapay zeka destekli bir karar destek panelidir.
              </p>
              
              <div>
                <strong style={{ color: 'var(--accent-cyan)' }}>🔑 Önemli Özellikler:</strong>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li>🧠 <strong>AI Birliktelik Analizi (Apriori):</strong> Hangi ürünlerin birlikte satın alındığını tespit eden ve çapraz satış önerileri sunan AI mekanizması.</li>
                  <li>🗺️ <strong>Bölgesel Satış Isı Haritası:</strong> Semt bazında sipariş yoğunluğunu gerçek zamanlı görselleştiren etkileşimli harita.</li>
                  <li>📈 <strong>Grafik Analizleri:</strong> Mağazalar arası satış, ciro ve kategori dağılımlarını görsel panellerle sunar.</li>
                  <li>🏷️ <strong>Dinamik İndirim Stratejisi:</strong> Satış sıklığına göre semt bazlı indirim oranları hesaplar ve simüle eder.</li>
                  <li>🛒 <strong>İnteraktif Sepet & Simülasyon:</strong> Sepete ürün ekleme, sepet detay modalları ve sipariş simülasyonu özellikleri sunar.</li>
                </ul>
              </div>

              <div>
                <strong style={{ color: 'var(--accent-cyan)' }}>💻 Mimari & Teknolojiler:</strong>
                <p style={{ marginTop: '0.2rem', fontSize: '0.9rem' }}>
                  Frontend tarafında <strong>React</strong>, <strong>Vite</strong>, <strong>TypeScript</strong> ve <strong>Tailwind CSS</strong> kullanılırken; backend tarafı <strong>Python (Django)</strong> ve <strong>Node.js (Express RESTful API)</strong> mimarileriyle çift çekirdekli geliştirilmiş, <strong>Swagger UI API Dokümantasyonu</strong> ile belgelendirilmiştir.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1.8rem', marginBottom: '1rem' }}>
              <a href="https://trendsepetix.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1, padding: '10px 0', fontSize: '12px', textAlign: 'center', minWidth: '110px' }}>Canlı Demo</a>
              <a href="https://github.com/botankly/Trendsepetix" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, padding: '10px 0', fontSize: '12px', textAlign: 'center', minWidth: '110px' }}>GitHub Web</a>
              <a href="https://github.com/botankly/benim-react-sitem/tree/main/backend" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, padding: '10px 0', fontSize: '12px', textAlign: 'center', minWidth: '140px', color: 'var(--accent-cyan)', borderColor: 'var(--accent-cyan)' }}>📄 Backend API Docs</a>
            </div>

            <button onClick={() => setIsTrendsepetixOpen(false)} className="btn btn-secondary close-btn">Kapat</button>
          </div>
        </div>
      )}

      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="back-to-top-btn"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'var(--accent-purple)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            zIndex: 999,
            transition: 'all 0.3s ease',
            animation: 'modalEnter 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
          }}
          title="Yukarı Çık"
        >
          ▲
        </button>
      )}

      {isCvOpen && (
        <div className="modal-overlay" onClick={() => setIsCvOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%', height: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>Özgeçmiş Önizleme</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href="/cv.pdf" download="Botan_Kulay_CV.pdf" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                  📥 İndir (PDF)
                </a>
                <button onClick={() => setIsCvOpen(false)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Kapat</button>
              </div>
            </div>
            <div style={{ flex: 1, width: '100%', background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <iframe
                src="/cv.pdf"
                title="Botan Külay CV"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Proje Detay Modalı (Interactive Project Modal) */}
      {selectedProjectModal && (
        <div className="modal-overlay" onClick={() => setSelectedProjectModal(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '620px', 
              width: '92%', 
              textAlign: 'left', 
              padding: '2.2rem',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-modal)',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* Kapat X Butonu */}
            <button
              onClick={() => setSelectedProjectModal(null)}
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1.2rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
              title="Kapat (ESC)"
            >
              ✕
            </button>

            {/* Üst Bilgi / Etiket & Kategori */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
              <span className="card-tag" style={{ color: selectedProjectModal.featured ? 'var(--accent-purple)' : 'var(--accent-cyan)', fontWeight: '800', fontSize: '0.85rem' }}>
                {selectedProjectModal.tag}
              </span>
              <span style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                {selectedProjectModal.category}
              </span>
            </div>

            {/* Proje Başlığı */}
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.8rem', lineHeight: '1.2' }}>
              {selectedProjectModal.title}
            </h3>

            {/* Kullanılan Teknolojiler (Detaylı Rozetler) */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
              {selectedProjectModal.technologies.map(tech => (
                <span
                  key={tech}
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    fontWeight: '700'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Mimari / Teknik Şema Placeholder Görsel Alanı */}
            <div style={{
              width: '100%',
              padding: '1.4rem 1.6rem',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8))',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              marginBottom: '1.4rem',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚡ MİMARİ & TEKNİK YAPI</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#e2e8f0', margin: 0, fontFamily: 'monospace', lineHeight: '1.5' }}>
                {selectedProjectModal.arch || "React 19 · Vite · Tailwind CSS · REST API"}
              </p>
            </div>

            {/* Projenin Amacı ve Çözdüğü Problem */}
            {selectedProjectModal.problem && (
              <div style={{ marginBottom: '1.2rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🎯 Projenin Amacı ve Çözümü
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                  {selectedProjectModal.problem}
                </p>
              </div>
            )}

            {/* Öne Çıkan Teknik Özellikler (3-4 Maddelik Liste) */}
            {selectedProjectModal.highlights && selectedProjectModal.highlights.length > 0 && (
              <div style={{ marginBottom: '1.8rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ✨ Öne Çıkan Teknik Özellikler
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedProjectModal.highlights.map((item, idx) => (
                    <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bağlantı Butonları: Canlı Gör & GitHub */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '1.2rem', borderTop: '1px solid var(--border-color)' }}>
              {selectedProjectModal.detailAction === 'weather' ? (
                <button
                  onClick={() => {
                    setSelectedProjectModal(null);
                    setIsWeatherOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, textAlign: 'center', padding: '0.75rem 1.2rem', fontSize: '0.88rem', fontWeight: '700', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', border: 'none' }}
                >
                  🌤️ Canlı Hava Durumu Panelini Aç →
                </button>
              ) : selectedProjectModal.demo && (
                <a
                  href={selectedProjectModal.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ flex: 1, textAlign: 'center', padding: '0.75rem 1.2rem', fontSize: '0.88rem', fontWeight: '700', borderRadius: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  🚀 Canlı Gör (Demo) →
                </a>
              )}
              {selectedProjectModal.github && (
                <a
                  href={selectedProjectModal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ flex: 1, textAlign: 'center', padding: '0.75rem 1.2rem', fontSize: '0.88rem', fontWeight: '700', borderRadius: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub Deposu
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Floating Window */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '6.2rem',
          right: '2rem',
          width: '350px',
          height: '450px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'modalEnter 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
          textAlign: 'left'
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--accent-purple)',
            color: '#fff',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🤖</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800' }}>Botan-AI Asistan</h4>
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Çevrimiçi | Akıllı Asistan</span>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          </div>

          {/* Messages body */}
          <div className="chat-body" style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: msg.sender === 'user' ? '#000' : '#fff',
                padding: '0.6rem 0.9rem',
                borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                maxWidth: '80%',
                fontSize: '0.8rem',
                lineHeight: '1.4',
                fontWeight: msg.sender === 'user' ? '700' : '500'
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Suggested prompts */}
          <div style={{
            padding: '0.5rem 1rem',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            borderTop: '1px solid rgba(255, 255, 255, 0.03)'
          }}>
            <button 
              onClick={() => handleSendMessage("Botan'ın yetenekleri neler?")} 
              style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', color: 'var(--accent-cyan)', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}
            >
              💻 Yetenekler
            </button>
            <button 
              onClick={() => handleSendMessage("Hangi üniversitede okuyor?")} 
              style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', color: 'var(--accent-cyan)', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}
            >
              🎓 Okul Bilgisi
            </button>
            <button 
              onClick={() => handleSendMessage("İletişim bilgileri?")} 
              style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', color: 'var(--accent-cyan)', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}
            >
              ✉️ İletişim
            </button>
          </div>

          {/* Input footer */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{
            padding: '0.8rem 1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            gap: '8px'
          }}>
            <input 
              type="text" 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)} 
              placeholder="Sorunuzu buraya yazın..."
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.4rem 0.8rem',
                color: '#fff',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 0.8rem', fontSize: '0.75rem', borderRadius: '10px' }}>Gönder</button>
          </form>
        </div>
      )}

        </>
      )}

      {/* Chatbot Floating Balloon */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '5.8rem',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'var(--accent-cyan)',
          border: 'none',
          color: '#000',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(56, 189, 248, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          zIndex: 999,
          transition: 'all 0.3s ease'
        }}
        title="Botan-AI Chatbot"
      >
        {isChatOpen ? '✕' : '🤖'}
      </button>

      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '6.2rem',
          right: '2rem',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          color: '#fff',
          padding: '1rem 1.8rem',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.2)',
          fontSize: '0.85rem',
          fontWeight: '700',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'modalEnter 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}>
          <span style={{ color: '#38bdf8' }}>✔️</span> {toastMessage}
        </div>
      )}
    </>
  );
}