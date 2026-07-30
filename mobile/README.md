# 📱 Trendsepetix Mobile (React Native & Expo)

[![Expo SDK 51](https://img.shields.io/badge/Expo-SDK_51-00020d?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![React Navigation](https://img.shields.io/badge/React_Navigation-v6-9b59b6?logo=react&logoColor=white)](https://reactnavigation.org/)
[![AsyncStorage](https://img.shields.io/badge/Storage-AsyncStorage-3b82f6?logo=sqlite&logoColor=white)](#)

Trendsepetix e-ticaret platformunun iOS, Android ve Web uyumlu, modern arayüze ve yerel veri depolama yeteneklerine sahip mobil vitrin uygulaması.

---

## ✨ Özellikler ve Ekranlar

- **🏠 Ana Ekran (HomeScreen):** Kategori bazlı filtreleme sekmeleri, gerçek zamanlı arama motoru, ürün kartları ve sepet doluluk rozeti (badge).
- **🔎 Ürün Detayı (ProductDetailScreen):** Ürün resim galerisi, detaylı açıklama, ebat/beden seçimi, adet kontrolü ve doğrudan sepete ekleme aksiyonu.
- **🛒 Sepetim Ekranı (CartScreen):** Sepetteki ürünlerin listesi, miktar arttırma/azaltma, ürünü listeden kaldırma, dinamik toplam tutar hesaplama ve kupon kodu (`INDIRIM20`) doğrulama sistemi.
- **💳 Ödeme Adımı (CheckoutScreen):** Teslimat adresi girişi, kredi kartı simülasyonu (kart no, skt, cvv) ve başarılı ödeme durumunda sepet temizleme otomasyonu.
- **💾 Yerel Depolama (AsyncStorage):** Uygulama kapatılıp açılsa dahi sepet içeriklerinin kaybolmamasını sağlayan yerel veritabanı senkronizasyonu.

---

## 🚀 Kurulum ve Çalıştırma

Uygulamayı telefonunuzda veya emülatörde çalıştırmak için aşağıdaki adımları uygulayabilirsiniz:

1. **Mobil Dizinine Geçin:**
   ```bash
   cd mobile
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Expo Geliştirme Sunucusunu Başlatın:**
   ```bash
   npx expo start
   ```

4. **Test Etme Yöntemleri:**
   - **Expo Go ile (Gerçek Telefon):** Telefonunuza App Store veya Google Play Store üzerinden **Expo Go** uygulamasını yükleyin. Terminalde veya tarayıcıda beliren **QR Kodu** telefonunuzun kamerası (iOS) veya Expo Go (Android) uygulaması ile taratarak projeyi anında telefonunuzda çalıştırın.
   - **Android Emülatör:** `a` tuşuna basarak yerel Android Studio emülatörünü başlatın.
   - **iOS Simulator:** `i` tuşuna basarak Xcode simülatörünü başlatın.
   - **Web Sürümü:** `w` tuşuna basarak uygulamayı tarayıcıda çalıştırın.

---

## 🛠️ Kullanılan Başlıca Paketler

- `expo` ve `react-native`
- `@react-navigation/native` ve `@react-navigation/native-stack`
- `@react-native-async-storage/async-storage` (Sepet verilerinin saklanması için)
- `expo-status-bar` (Şık üst bar tasarımı için)
- `react-native-safe-area-context` & `react-native-screens`

---

**Botan Külay** tarafından geliştirilmiştir. [Web Portfolyom](https://benim-react-sitem.vercel.app)
