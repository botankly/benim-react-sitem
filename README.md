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

## 🔐 Rol Tabanlı Yetkilendirme (Auth & RBAC)

SaaS Dashboard ve AI Analiz özelliklerini yetkilendirmek amacıyla JWT tabanlı **Kimlik Doğrulama & Yetki Yönetimi (RBAC)** entegre edilmiştir:
1. **JWT & Kimlik Doğrulama Middleware'i:** Backend tarafında `/api/v1/auth/login`, `/api/v1/auth/register` ve `/api/v1/auth/me` rotaları kurulmuştur. İstemciden gelen istekler `protect` middleware'i ile doğrulanır.
2. **Korumalı Rotalar (Route Protection):** Yetkisiz kullanıcılar `/dashboard` sayfasına girmek istediklerinde otomatik olarak `/login` sayfasına yönlendirilirler.
3. **Rol Tabanlı Arayüz Kısıtlamaları (RBAC UI):**
   - **Yönetici (Admin)** rolündeki kullanıcılar (Örn: `admin@botankulay.com` / `admin123`) sistemin CPU/RAM kaynak kullanım grafiklerini canlı izleyebilir ve AI raporu oluşturabilir.
   - **Kullanıcı (User)** rolündeki kullanıcılar (Örn: `user@test.com` / `user123`) panelde CPU/RAM metriklerinin kilitli olduğunu (`🔒` simgesi) görür ve AI analiz raporu tetikleme butonuna erişemezler.
4. **Çevrimdışı Mod Toleransı:** Backend sunucusu kapalıyken dahi testlerin çalışabilmesi için tarayıcıda otomatik local mock kimlik doğrulama mekanizması devreye girer.

---

## 💳 SaaS Ödeme Altyapısı ve Abonelik Yönetimi (Stripe / Iyzico Sandbox)

Uygulamanın gelir modelini yönetmek amacıyla Stripe ve Iyzico entegrasyon mantığına dayanan tam teşekküllü **Abonelik ve Ödeme Sistemi** entegre edilmiştir:
1. **Abonelik Planları Uç Noktası (`/api/v1/billing/plans`):**
   - **Free Plan ($0/ay):** 100 günlük istek limiti, temel analitik arayüzü.
   - **Pro Plan ($29/ay):** Sınırsız istek, real-time websockets, AI analiz raporları, özel destek.
   - **Enterprise Plan ($99/ay):** Tüm özellikler, 24/7 telefon desteği, %99.9 SLA garantisi.
2. **Ödeme Başlatma ve Simülasyonu (`/api/v1/billing/checkout`):** Stripe/Iyzico Checkout Session mekanizmasını taklit eder. Kullanıcı kredi kartı bilgilerini girip "Ödemeyi Tamamla" butonuna bastığında API üzerinden sandbox ödemesi gerçekleştirilir ve kullanıcının abonelik planı anında yükseltilir.
3. **Webhook İşleyicisi (`/api/v1/billing/webhook`):** Ödeme sağlayıcılarından (Stripe/Iyzico) gelen anlık başarılı/başarısız durum bildirimlerini dinler ve işler.
4. **Fatura Geçmişi (`/api/v1/billing/history`):** Kullanıcının geçmiş ödemelerini, tutarını, tarihini ve kullanılan kart maskesini listeler. Arayüzden faturalar PDF formatında (simüle edilerek) indirilebilir.
5. **Dinamik Yetki Aktivasyonu (Feature Flagging):** Standart bir kullanıcı hesabını Pro veya Enterprise plana yükselttiğinde, dashboard üzerindeki CPU/RAM altyapı metriklerinin kilidi (`🔒`) otomatik olarak açılır ve AI analiz raporu üretme özelliği aktif hale gelir.

---

## 📱 Expo Mobil Uygulaması Real-Time & Anlık Bildirim Entegrasyonu

Expo ile geliştirilen mobil uygulama (`apps/mobile`), sistemin canlı veri akışına ve anlık uyarı sistemine bağlanmıştır:
1. **Mobil Canlı Veri Akışı (WebSocket):** İstemci tarafında `socket.io-client` entegrasyonu ile backend sunucusuna bağlanarak anlık aktif kullanıcı sayısını, CPU ve RAM kullanımlarını ve canlı sipariş cirosunu mobil arayüze gerçek zamanlı yansıtır.
2. **Push Notification & In-App Alert Simülasyonu:** 
   - Web panelinden yeni bir sipariş tetiklendiğinde veya kritik bir olay gerçekleştiğinde (Örn: "Yüksek Sunucu Yükü" veya "Yeni Pro Üyelik Satın Alındı"), mobil arayüzde tepeden kayarak inen şık **Anlık Bildirim Banner'ları (Push Alerts)** gösterilir.
   - Bu bildirimler aynı zamanda mobil ekrandaki **Bildirim Geçmişi** panelinde listelenir.
3. **Admin Mobile Dashboard Ekranı:** Mobil uygulamanın ana ekranına entegre edilen `📊` butonu ile geçiş yapılabilen bu ekran, karanlık tema uyumlu Glassmorphic kartlar, canlı durum rozetleri, sunucu yük barları ve test simülatör butonları ("Yüksek Yük Simüle Et", "Pro Satış Simüle Et") barındırır.
4. **Çevrimdışı Mod Toleransı:** Socket sunucusu kapalıyken dahi test edilebilmesi amacıyla, mobil uygulama sunucuya erişemediğinde otomatik olarak yerel mock veri akışını ve bildirim simülasyonunu başlatır.

---

## 📄 CI/CD ve Test Yapılandırması

Projede kod kalitesini ve kararlılığını korumak için kapsamlı bir CI/CD ve test altyapısı entegre edilmiştir:

1. **GitHub Actions Workflow (`.github/workflows/ci.yml`):** Her `push` veya `pull_request` işleminde otomatik tetiklenerek bağımlılıkları kurar, lint kontrolü yapar, birim ve E2E testleri koşturur ve build sürecini doğrular.
2. **Vitest (Unit Testing):** Hızlı ve yerleşik TypeScript desteği ile frontend ve backend birim testlerini koşturur.
3. **Playwright (E2E Testing):** Tarayıcı simülasyonu üzerinden tüm kullanıcı deneyimini (tema değişimi, projelerin yüklenmesi vb.) baştan sona test eder.

---

## 🚀 Canlıya Alma Rehberi (Production Deployment Guide)

Proje üç ayrı platforma dağıtılmak üzere yapılandırılmıştır:

### 1️⃣ Supabase / Neon — Ücretsiz PostgreSQL Veritabanı

1. [supabase.com](https://supabase.com) veya [neon.tech](https://neon.tech) adresine gidin ve ücretsiz bir hesap oluşturun.
2. Yeni bir proje ve veritabanı oluşturun.
3. **Database → Connection String** bölümünden `postgresql://...` formatındaki bağlantı adresinizi kopyalayın.
4. Bu adresi `DATABASE_URL` ortam değişkeni olarak Render dashboard'una ekleyeceksiniz.

> Şablonu kopyalamak için: `apps/api/.env.production.example`

### 2️⃣ Render — Node.js API ve Socket.io Servisi

1. [render.com](https://render.com) adresine gidin ve GitHub hesabınızla oturum açın.
2. **New → Web Service** oluşturun ve `botanikly/benim-react-sitem` reposunu seçin.
3. Aşağıdaki ayarları uygulayın:
   - **Root Directory:** `apps/api`
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `node server.js`
   - **Environment:** `Node`
4. **Environment Variables** bölümünden şu değerleri ekleyin:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<supabase/neon bağlantı adresiniz>
   JWT_SECRET=<güvenli ve rastgele üretilmiş bir gizli anahtar>
   FRONTEND_URL=<Vercel deploy URL'i — aşağıda oluşturulacak>
   ```
5. Deploy işlemi tamamlandığında servis URL'nizi not alın (örn. `https://trendsepetix-api.onrender.com`).
6. Prisma şemasını uygulamak için Render üzerindeki **Shell** sekmesinden çalıştırın:
   ```bash
   npx prisma db push
   ```

> Render Blueprint dosyası: `render.yaml` (kök dizinde)

### 3️⃣ Vercel — Frontend Web Uygulaması

1. [vercel.com](https://vercel.com) adresine gidin ve GitHub hesabınızla oturum açın.
2. **New Project → Import Git Repository** adımlarıyla `botanikly/benim-react-sitem` reposunu ekleyin.
3. Aşağıdaki proje ayarlarını yapılandırın:
   - **Framework Preset:** Vite
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables** bölümünden şu değeri ekleyin:
   ```
   VITE_API_URL=https://trendsepetix-api.onrender.com
   ```
5. **Deploy** butonuna tıklayın.
6. Deploy tamamlandıktan sonra Vercel URL'nizi (örn. `https://benim-react-sitem.vercel.app`) kopyalayın ve Render üzerindeki `FRONTEND_URL` değişkenini bu adres ile güncelleyin.

> Vercel konfigürasyon dosyası: `vercel.json` (kök dizinde)

### ⚙️ Ortam Değişkeni Şablonları

| Dosya | Açıklama |
|---|---|
| `apps/api/.env.production.example` | API servisi için üretim ortam değişkeni şablonu |
| `apps/web/.env.production.example` | Web uygulaması için üretim ortam değişkeni şablonu |

### 🔒 Güvenlik Notları
- `JWT_SECRET` değeri için `openssl rand -base64 64` komutu ile güçlü bir anahtar üretin.
- `DATABASE_URL` ve `JWT_SECRET` değerlerini asla kaynak koda veya repoya eklemeyin.
- `.env` dosyaları `.gitignore` kapsamındadır; yalnızca `.env.production.example` şablon dosyaları repoda yer almaktadır.

---

**Botan Külay** tarafından geliştirilmiştir. [GitHub](https://github.com/botankly) | [LinkedIn](https://www.linkedin.com/in/botan-k%C3%BClay-6786a4295/)
