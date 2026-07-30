# 📦 Botan Külay | Monorepo Portfolyo ve E-Ticaret Ekosistemi

[![CI/CD Pipeline](https://github.com/botankly/benim-react-sitem/actions/workflows/ci.yml/badge.svg)](https://github.com/botankly/benim-react-sitem/actions/workflows/ci.yml)
[![Test Coverage](https://img.shields.io/badge/tests-passed-brightgreen)](https://github.com/botankly/benim-react-sitem/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
- **Tüm Birim (Unit) Testleri Çalıştırma:**
  ```bash
  npm run test
  ```
- **Tüm Uçtan Uca (E2E) Testleri Çalıştırma:**
  ```bash
  npm run test:e2e
  ```

---

## 🚀 Alt Proje Detayları

### 💻 Web Uygulaması (`apps/web`)
- **Teknolojiler:** React 19, Vite, Tailwind CSS, EmailJS, PWA, Socket.io-client
- **Özellikler:** Real-Time SaaS Dashboard, Botan-AI Chatbot, CLI Developer Terminal, Code Playground, CV Önizleyici, Sayaçlar ve animasyonlu grafik panelleri.
- **Canlı Demo:** [benim-react-sitem.vercel.app](https://benim-react-sitem.vercel.app)
- **Birim Testleri:** Vitest ve React Testing Library ile bileşen testleri (`Navbar.test.tsx`).
- **E2E Testleri:** Playwright ile sayfa bazlı akış testleri (`e2e/home.spec.ts`).

### 🔌 RESTful API Servisi (`apps/api`)
- **Teknolojiler:** Node.js, Express, Socket.io, JWT, Helmet, Express Rate Limit, Swagger UI
- **Dokümantasyon:** Localde `http://localhost:5000/api-docs` adresinde Swagger UI ile canlı test imkanı sunar.
- **Birim Testleri:** Vitest ve Supertest ile Auth ve Product rotalarının doğrulanması (`tests/auth.test.ts`).

### 📱 Mobil Uygulama (`apps/mobile`)
- **Teknolojiler:** React Native, Expo SDK 51, React Navigation, AsyncStorage
- **Özellikler:** Kategori sekmeli ürün listesi, detay ekranı, AsyncStorage sepet saklama, kupon kodu doğrulama ve native ödeme simülasyonu.

---

## 📈 Real-Time & AI SaaS Dashboard

Projeye entegre edilen 3. ana büyük modül olan **Real-Time SaaS Dashboard**, WebSocket (Socket.io) ve yapay zeka (AI) destekli bir veri analitiği panelidir:
1. **Canlı Veri Akışı (WebSockets):** Sunucu CPU yükü, bellek kullanımı, anlık aktif kullanıcı sayısı ve yeni siparişler (`socket.io` üzerinden) her 3 saniyede bir canlandırılıp istemciye aktarılır.
2. **Dayanıklı Altyapı (Fallback Mode):** Socket sunucusu aktif olmasa dahi tarayıcı üzerinde mock simülatör devreye girerek panelin kesintisiz çalışmasını garanti eder.
3. **AI Rapor Oluşturucu (Yapay Zeka Analisti):** `api/v1/ai/analyze` rotası aracılığıyla o anki sistem metriklerini analiz eden ve Türkçe/İngilizce yönetici raporu sunan akıllı raporlama sistemi barındırır.

---

## 📄 CI/CD ve Test Yapılandırması

Projede kod kalitesini ve kararlılığını korumak için kapsamlı bir CI/CD ve test altyapısı entegre edilmiştir:

1. **GitHub Actions Workflow (`.github/workflows/ci.yml`):** Her `push` veya `pull_request` işleminde otomatik tetiklenerek bağımlılıkları kurar, lint kontrolü yapar, birim ve E2E testleri koşturur ve build sürecini doğrular.
2. **Vitest (Unit Testing):** Hızlı ve yerleşik TypeScript desteği ile frontend ve backend birim testlerini koşturur.
3. **Playwright (E2E Testing):** Tarayıcı simülasyonu üzerinden tüm kullanıcı deneyimini (tema değişimi, projelerin yüklenmesi vb.) baştan sona test eder.

**Botan Külay** tarafından geliştirilmiştir. [GitHub](https://github.com/botankly) | [LinkedIn](https://www.linkedin.com/in/botan-k%C3%BClay-6786a4295/)
