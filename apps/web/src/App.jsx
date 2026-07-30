import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import heroImage from './assets/hero.png';
import Navbar from './components/Navbar';

// Türkiye 81 il ve popüler ilçeler/isimler için haritalama
const TURKISH_CITIES_MAP = {
  "adana": "Adana",
  "adiyaman": "Adıyaman",
  "afyonkarahisar": "Afyonkarahisar",
  "afyon": "Afyonkarahisar",
  "agri": "Ağrı",
  "aksaray": "Aksaray",
  "amasya": "Amasya",
  "ankara": "Ankara",
  "antalya": "Antalya",
  "ardahan": "Ardahan",
  "artvin": "Artvin",
  "aydin": "Aydın",
  "balikesir": "Balıkesir",
  "bartin": "Bartın",
  "batman": "Batman",
  "bayburt": "Bayburt",
  "bilecik": "Bilecik",
  "bingol": "Bingöl",
  "bitlis": "Bitlis",
  "bolu": "Bolu",
  "burdur": "Burdur",
  "bursa": "Bursa",
  "canakkale": "Çankırı",
  "corum": "Çorum",
  "denizli": "Denizli",
  "diyarbakir": "Diyarbakır",
  "duzce": "Düzce",
  "edirne": "Edirne",
  "elazig": "Elazığ",
  "elazigh": "Elazığ",
  "elazıg": "Elazığ",
  "erzincan": "Erzincan",
  "erzurum": "Erzurum",
  "eskisehir": "Eskişehir",
  "gaziantep": "Gaziantep",
  "giresun": "Giresun",
  "gumushane": "Gümüşhane",
  "hakkari": "Hakkâri",
  "hatay": "Hatay",
  "igdir": "Iğdır",
  "isparta": "Isparta",
  "istanbul": "İstanbul",
  "izmir": "İzmir",
  "kahramanmaras": "Kahramanmaraş",
  "maras": "Kahramanmaraş",
  "karabuk": "Karabük",
  "karaman": "Karaman",
  "kars": "Kars",
  "kastamonu": "Kastamonu",
  "kayseri": "Kayseri",
  "kilis": "Kilis",
  "kirikkale": "Kırıkkale",
  "kirklareli": "Kırklareli",
  "kirsehir": "Kırşehir",
  "kocaeli": "Kocaeli",
  "izmit": "Kocaeli",
  "konya": "Konya",
  "kutahya": "Kütahya",
  "malatya": "Malatya",
  "manisa": "Manisa",
  "mardin": "Mardin",
  "mersin": "Mersin",
  "icel": "Mersin",
  "mugla": "Muğla",
  "mus": "Muş",
  "nevsehir": "Nevşehir",
  "nigde": "Niğde",
  "ordu": "Ordu",
  "osmaniye": "Osmaniye",
  "rize": "Rize",
  "sakarya": "Sakarya",
  "adapazari": "Sakarya",
  "samsun": "Samsun",
  "sanliurfa": "Şanlıurfa",
  "urfa": "Şanlıurfa",
  "siirt": "Siirt",
  "sinop": "Sinop",
  "sivas": "Sivas",
  "sirnak": "Şırnak",
  "tekirdag": "Tekirdağ",
  "tokat": "Tokat",
  "trabzon": "Trabzon",
  "tunceli": "Tunceli",
  "usak": "Uşak",
  "van": "Van",
  "yalova": "Yalova",
  "yozgat": "Yozgat",
  "zonguldak": "Zonguldak"
};

// Türkçe karakter duyarlı normalleştirme
const normalizeText = (str) => {
  if (!str) return "";
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/I/g, 'ı')
    .replace(/İ/g, 'i')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u')
    .trim();
};

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
    featured: true
  },
  {
    id: 2,
    title: "Hava Durumu Uygulaması",
    category: "Frontend",
    tag: "Frontend",
    desc: "Şehir bazlı detaylı sorgulama yapan, rüzgar hızı ve 3 günlük hava durumu tahmini sunan modern widget uygulaması.",
    technologies: ['React', 'Vite', 'CSS Modules', 'OpenWeather API'],
    github: "https://github.com/botankly",
    demo: "https://benim-react-sitem.vercel.app",
    hasDetails: true,
    detailAction: 'weather'
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
    detailAction: 'todo'
  }
];

export default function App() {
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [isTrendsepetixOpen, setIsTrendsepetixOpen] = useState(false);
  const [isCvOpen, setIsCvOpen] = useState(false);

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
    icon: "⛅",
    forecast: [
      { day: "Bugün", tempMax: 31, tempMin: 22, condition: "Parçalı Bulutlu", icon: "⛅" },
      { day: "Yarın", tempMax: 30, tempMin: 21, condition: "Açık", icon: "☀️" },
      { day: "Sonraki Gün", tempMax: 29, tempMin: 20, condition: "Açık", icon: "☀️" }
    ]
  });

  // To Do LocalStorage Senkronizasyonu
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Hava Durumu Arama Handler
  const handleSearch = async (targetCity) => {
    const rawInput = (targetCity || cityInput).trim();
    if (!rawInput) return;

    const normalizedKey = normalizeText(rawInput);
    const apiSearchName = TURKISH_CITIES_MAP[normalizedKey] || rawInput;

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(apiSearchName)}&count=1&language=tr`
      );
      const geoData = await geoRes.json();

      if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude, name } = geoData.results[0];
        
        const wRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=daily,weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const wData = await wRes.json();
        
        const currentInfo = mapWeatherCode(wData.current_weather.weathercode);
        
        const dailyForecast = [];
        if (wData.daily && wData.daily.time) {
          for (let i = 0; i < 3; i++) {
            if (wData.daily.time[i]) {
              const dayInfo = mapWeatherCode(wData.daily.weathercode[i]);
              let dayLabel = formatDayName(wData.daily.time[i]);
              if (i === 0) dayLabel = "Bugün";
              else if (i === 1) dayLabel = "Yarın";

              dailyForecast.push({
                day: dayLabel,
                tempMax: Math.round(wData.daily.temperature_2m_max[i]),
                tempMin: Math.round(wData.daily.temperature_2m_min[i]),
                condition: dayInfo.condition,
                icon: dayInfo.icon
              });
            }
          }
        }

        setWeatherData({
          name: name,
          temp: Math.round(wData.current_weather.temperature),
          tempMax: wData.daily ? Math.round(wData.daily.temperature_2m_max[0]) : Math.round(wData.current_weather.temperature + 3),
          tempMin: wData.daily ? Math.round(wData.daily.temperature_2m_min[0]) : Math.round(wData.current_weather.temperature - 3),
          condition: currentInfo.condition,
          wind: Math.round(wData.current_weather.windspeed),
          icon: currentInfo.icon,
          forecast: dailyForecast.length > 0 ? dailyForecast : [
            { day: "Bugün", tempMax: Math.round(wData.current_weather.temperature + 3), tempMin: Math.round(wData.current_weather.temperature - 3), condition: currentInfo.condition, icon: currentInfo.icon }
          ]
        });
      } else {
        const capitalizedCity = apiSearchName.charAt(0).toUpperCase() + apiSearchName.slice(1);
        setWeatherData({
          name: capitalizedCity,
          temp: 22,
          tempMax: 25,
          tempMin: 18,
          condition: "Güneşli",
          wind: 12,
          icon: "☀️",
          forecast: [
            { day: "Bugün", tempMax: 25, tempMin: 18, condition: "Güneşli", icon: "☀️" },
            { day: "Yarın", tempMax: 26, tempMin: 17, condition: "Güneşli", icon: "☀️" },
            { day: "Sonraki Gün", tempMax: 24, tempMin: 16, condition: "Güneşli", icon: "☀️" }
          ]
        });
      }
    } catch (err) {
      const capitalizedCity = apiSearchName.charAt(0).toUpperCase() + apiSearchName.slice(1);
      setWeatherData({
        name: capitalizedCity,
        temp: 22,
        tempMax: 25,
        tempMin: 18,
        condition: "Güneşli",
        wind: 12,
        icon: "☀️",
        forecast: [
          { day: "Bugün", tempMax: 25, tempMin: 18, condition: "Güneşli", icon: "☀️" },
          { day: "Yarın", tempMax: 26, tempMin: 17, condition: "Güneşli", icon: "☀️" },
          { day: "Sonraki Gün", tempMax: 24, tempMin: 16, condition: "Güneşli", icon: "☀️" }
        ]
      });
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
      <Navbar theme={theme} toggleTheme={toggleTheme} setIsContactOpen={setIsContactOpen} />

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
            {/* Arama Kutusu */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <input
                type="text"
                placeholder="Proje adı veya kullanılan teknoloji ara..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
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
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

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
                        <span key={tech} style={{ fontSize: '9px', padding: '3px 8px', borderRadius: '5px', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-cyan)', border: '1px solid rgba(56, 189, 248, 0.15)' }}>{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {project.hasDetails && (
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        if (project.detailAction === 'trendsepetix') setIsTrendsepetixOpen(true);
                        else if (project.detailAction === 'weather') setIsWeatherOpen(true);
                        else if (project.detailAction === 'todo') setIsTodoOpen(true);
                      }} className="card-link">Detayları Gör →</a>
                    )}
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="card-link">GitHub →</a>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="card-link">Canlı Gör →</a>
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
      {isWeatherOpen && (
        <div className="modal-overlay" onClick={() => setIsWeatherOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.8rem', fontSize: '1.5rem', fontWeight: '800' }}>Hava Durumu Uygulaması</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Hızlı şehir seçici, animasyonlu ikonlar ve özelleştirilebilir şehir arama ile güncel hava durumunu gösteren modern SPA widget'ı.
            </p>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
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
                style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'background-color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                Ara
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '18px', flexWrap: 'wrap' }}>
              {['İstanbul', 'Ankara', 'İzmir', 'Van'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleSearch(c)}
                  style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.05)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div style={{ backgroundColor: 'var(--bg-dark)', padding: '20px', borderRadius: '16px', marginBottom: '18px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '20px', color: '#f8fafc', fontWeight: '800', margin: 0 }}>{weatherData.name}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0, marginTop: '2px' }}>{weatherData.condition}</p>
                </div>
                <div style={{ fontSize: '42px', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }}>{weatherData.icon}</div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                <span style={{ fontSize: '36px', fontWeight: '900', color: 'var(--accent-cyan)', letterSpacing: '-1px' }}>{weatherData.temp}°C</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  Yüksek: <strong style={{ color: '#f43f5e' }}>{weatherData.tempMax}°</strong> / Düşük: <strong style={{ color: '#60a5fa' }}>{weatherData.tempMin}°</strong>
                </span>
              </div>
              <div style={{ textAlign: 'left', marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>💨 Rüzgar Hızı: <strong>{weatherData.wind} km/s</strong></span>
                <span>💧 Güncel Ölçüm</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <h5 style={{ color: 'var(--accent-cyan)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontWeight: '800' }}>3 Günlük Hava Tahmini</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {weatherData.forecast.map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-dark)', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', border: '1px solid var(--border-color)' }}>
                    <span style={{ color: '#f8fafc', fontWeight: '600', width: '90px' }}>{f.day}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', flex: 1 }}>
                      <span style={{ fontSize: '18px' }}>{f.icon}</span>
                      <span style={{ fontSize: '12px' }}>{f.condition}</span>
                    </span>
                    <span style={{ color: '#f8fafc', fontWeight: '700' }}>
                      <span style={{ color: '#f43f5e' }}>{f.tempMax}°</span>
                      <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 6px' }}>|</span>
                      <span style={{ color: '#60a5fa' }}>{f.tempMin}°</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', justifyContent: 'center' }}>
              <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-cyan)', border: '1px solid rgba(56, 189, 248, 0.15)', fontWeight: '700' }}>React</span>
              <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-cyan)', border: '1px solid rgba(56, 189, 248, 0.15)', fontWeight: '700' }}>JavaScript</span>
              <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-cyan)', border: '1px solid rgba(56, 189, 248, 0.15)', fontWeight: '700' }}>API</span>
              <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-cyan)', border: '1px solid rgba(56, 189, 248, 0.15)', fontWeight: '700' }}>CSS</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
              <a href="https://benim-react-sitem.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1, padding: '10px 0', fontSize: '13.5px' }}>Canlı Gör</a>
              <a href="https://github.com/botankly" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, padding: '10px 0', fontSize: '13.5px' }}>GitHub</a>
            </div>

            <button onClick={() => setIsWeatherOpen(false)} className="btn btn-secondary close-btn">Kapat</button>
          </div>
        </div>
      )}

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