# 📦 Trendsepetix RESTful API Backend (Node.js & Express)

[![Node.js](https://img.shields.io/badge/Node.js-v18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Documentation-Swagger-85EA2D?logo=swagger&logoColor=black)](https://swagger.io/)

Trendsepetix e-ticaret platformunun JWT tabanlı kimlik doğrulama, rol bazlı yetkilendirme ve kurumsal güvenlik paketleriyle güçlendirilmiş Express.js RESTful API servisi.

---

## 🛠️ Klasör Mimarisi

```text
backend/
├── controllers/      # Auth, Product, Order, Review iş mantıkları
├── middleware/       # JWT Auth, Rol kontrolü, Hata yakalayıcı
├── models/           # Veritabanı tablo modelleri (simüle DB)
├── routes/           # API rota tanımlamaları (/api/v1/...)
├── server.js         # Sunucu başlangıç noktası & middleware yapılandırmaları
├── seed.js           # Örnek veri tohumlama betiği
└── package.json      # Bağımlılık paket tanımları
```

---

## 🔒 Güvenlik & Performans Özellikleri

- **Helmet:** HTTP header güvenliğini otomatik olarak yapılandırarak XSS ve Clickjacking saldırılarını engeller.
- **Express Rate Limit:** API uç noktalarına gelen spam ve Brute-Force (kaba kuvvet) isteklerini sınırlandırır.
- **Bcrypt.js:** Kullanıcı şifrelerini tek yönlü güvenli tuzlama algoritmasıyla hashler.
- **JSON Web Tokens (JWT):** Durumsuz (stateless) ve güvenli kimlik doğrulama sağlar.

---

## 🛣️ API Uç Noktaları (Endpoints)

### Kimlik Doğrulama (Auth)
- `POST /api/v1/auth/register` - Yeni kullanıcı kaydı
- `POST /api/v1/auth/login` - Giriş yapma ve JWT token alma
- `GET /api/v1/auth/profile` - Giriş yapmış kullanıcının profil detayları *(JWT Korumalı)*

### Ürünler (Products)
- `GET /api/v1/products` - Tüm ürünleri listeleme
- `GET /api/v1/products/:id` - Ürün detayını alma
- `POST /api/v1/products` - Yeni ürün ekleme *(JWT & Admin Korumalı)*
- `DELETE /api/v1/products/:id` - Ürün silme *(JWT & Admin Korumalı)*

### Siparişler (Orders)
- `POST /api/v1/orders` - Yeni sipariş oluşturma *(JWT Korumalı)*
- `GET /api/v1/orders/my-orders` - Giriş yapmış kullanıcının siparişleri *(JWT Korumalı)*
- `GET /api/v1/orders` - Tüm siparişleri listeleme *(JWT & Admin Korumalı)*

### Yorumlar (Reviews)
- `POST /api/v1/reviews/:productId` - Ürüne yorum ve puan ekleme *(JWT Korumalı)*
- `GET /api/v1/reviews/:productId` - Ürünün tüm yorumlarını listeleme

---

## 🚀 Kurulum ve Çalıştırma

1. **Backend Dizinine Geçin:**
   ```bash
   cd backend
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Örnek Verileri Seed Edin:**
   ```bash
   npm run seed
   ```

4. **Sunucuyu Çalıştırın:**
   ```bash
   npm start
   ```
   *Geliştirme modunda (nodemon ile) çalıştırmak için:* `npm run dev`

5. **Swagger API Dokümantasyonuna Erişin:**
   Tarayıcınızdan `http://localhost:5000/api-docs` adresine giderek tüm rotaları interaktif olarak test edebilirsiniz.

---

**Botan Külay** tarafından geliştirilmiştir. [Web Portfolyom](https://benim-react-sitem.vercel.app)
