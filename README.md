# 📦 Botan Külay | Monorepo Portfolyo ve E-Ticaret Ekosistemi

Bu depo, **Turborepo** tabanlı monorepo mimarisi ile yönetilen; kişisel portfolyo, Trendsepetix RESTful API backend servisi, Trendsepetix Mobile uygulamasını ve ortak paketleri barındıran kurumsal standartlarda bir yazılım ekosistemidir.

---

## 📂 Monorepo Mimarisi ve Klasör Yapısı

```text
benim-react-sitem/ (Monorepo Root)
├── apps/
│   ├── web/          # React 19 Kişisel Portfolyo Sitesi & E-Ticaret Arayüzü
│   ├── api/          # Node.js & Express RESTful API Servisi (Swagger Belgelendirmeli)
│   └── mobile/       # Trendsepetix Expo & React Native Mobil Alışveriş Uygulaması
├── packages/
│   ├── ui/           # Web ve Mobil projeleri için paylaşılan tasarım tokenları & UI ögeleri
│   ├── config/       # ESLint, Prettier konfigürasyon presetleri
│   └── types/        # Tüm uygulamalar arasında ortak veri modelleri (User, Product, Order, vb.)
├── turbo.json        # Turborepo önbellekleme (caching) ve boru hattı (pipeline) tanımları
└── package.json      # Workspace tanımları ve monorepo genel komutları
```

---

## 🛠️ Monorepo Genel Komutları

Kök dizindeyken tüm workspace genelinde aşağıdaki komutları çalıştırabilirsiniz:

- **Geliştirme Ortamını Başlatma (Tüm Projeler):**
  ```bash
  npm run dev
  ```
- **Tüm Projeleri Derleme (Turborepo Caching Aktif):**
  ```bash
  npm run build
  ```
- **Tüm Projeleri Lint Etme:**
  ```bash
  npm run lint
  ```

---

## 🚀 Alt Proje Detayları

### 💻 Web Uygulaması (`apps/web`)
- **Teknolojiler:** React 19, Vite, Tailwind CSS, EmailJS, PWA
- **Özellikler:** Botan-AI Chatbot, CLI Developer Terminal, Code Playground, CV Önizleyici, Sayaçlar ve animasyonlu grafik panelleri.
- **Canlı Demo:** [benim-react-sitem.vercel.app](https://benim-react-sitem.vercel.app)

### 🔌 RESTful API Servisi (`apps/api`)
- **Teknolojiler:** Node.js, Express, JWT, Helmet, Express Rate Limit, Swagger UI
- **Dokümantasyon:** Localde `http://localhost:5000/api-docs` adresinde Swagger UI ile canlı test imkanı sunar.

### 📱 Mobil Uygulama (`apps/mobile`)
- **Teknolojiler:** React Native, Expo SDK 51, React Navigation, AsyncStorage
- **Özellikler:** Kategori sekmeli ürün listesi, detay ekranı, AsyncStorage sepet saklama, kupon kodu doğrulama ve native ödeme simülasyonu.

---

## 📄 CI/CD ve Test Yapılandırması

Projede kod kalitesini kontrol etmek için otomatik GitHub Actions ve Turborepo entegrasyonu mevcuttur.

**Botan Külay** tarafından geliştirilmiştir. [GitHub](https://github.com/botankly) | [LinkedIn](https://www.linkedin.com/in/botan-k%C3%BClay-6786a4295/)
