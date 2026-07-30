export const generateAIReport = (req, res) => {
  const { metrics } = req.body;
  
  const activeUsers = metrics?.activeUsers || 142;
  const cpuLoad = metrics?.cpuLoad || 45;
  const ramUsage = metrics?.ramUsage || 60;
  const revenue = metrics?.revenue || 42850;
  const orderCount = metrics?.orderCount || 8;

  // Analiz Kuralları
  const systemStatusTr = cpuLoad > 75 ? '⚠️ YÜKSEK YÜK' : '🟢 KARARLI';
  const systemStatusEn = cpuLoad > 75 ? '⚠️ HIGH LOAD' : '🟢 STABLE';
  
  const recommendationTr = cpuLoad > 75 
    ? 'Sunucu işlemci yükü kritik seviyededir. Auto-scaling kurallarının tetiklenmesi veya yük dengeleyici (load balancer) üzerinden trafik dağılımının yapılması önerilir.'
    : 'Sistem kaynakları optimum seviyededir. Herhangi bir ek kapasite artırımına ihtiyaç bulunmamaktadır.';

  const recommendationEn = cpuLoad > 75
    ? 'Server processor load is at critical level. Triggering auto-scaling rules or distributing traffic via load balancer is highly recommended.'
    : 'System resources are at optimal levels. No additional capacity expansion is required at this time.';

  const marketingInsightTr = activeUsers > 130 
    ? `Anlık aktif kullanıcı sayısı (${activeUsers}) standart ortalamanın üzerindedir. Kampanya ve dönüşüm oranları beklentiyi karşılamaktadır.`
    : `Kullanıcı trafiği sakin seyretmektedir. Dönüşüm oranlarını artırmak için anlık kupon kodları tanımlanabilir.`;

  const marketingInsightEn = activeUsers > 130
    ? `Active users (${activeUsers}) are above standard averages. Current campaigns and conversion metrics are performing exceptionally well.`
    : `Traffic is light. To increase conversion rates, temporary dynamic coupons may be offered to users.`;

  const markdownReport = `
# 📊 AI EXECUTIVE REPORT & SYSTEM INSIGHTS / AKILLI YÖNETİCİ ÖZETİ
*Generated dynamically by Botan-AI Core / Botan-AI tarafından otomatik olarak üretilmiştir.*

---

## 🇹🇷 Türkçe Analiz Raporu

### 📈 Genel SaaS Metrikleri
- **Toplam Gelir:** ₺${revenue.toLocaleString('tr-TR')}
- **Toplam Sipariş Adedi:** ${orderCount} adet
- **Anlık Aktif Kullanıcı:** ${activeUsers} kullanıcı

### ⚙️ Sistem Sağlık Durumu: ${systemStatusTr}
- **CPU Yükü:** %${cpuLoad}
- **RAM Kullanımı:** %${ramUsage}

### 🧠 Botan-AI Akıllı Yorum ve Öneriler
1. **İşletme ve Gelir Performansı:** Toplam ₺${revenue} gelir ve ${orderCount} adet sipariş ile SaaS ekosistemi sağlıklı bir nakit akışı sergilemektedir. Sipariş başına ortalama sepet tutarı yaklaşık ₺${(revenue / (orderCount || 1)).toFixed(2)} düzeyindedir.
2. **Kullanıcı Davranış Analizi:** ${marketingInsightTr}
3. **Altyapı ve Sistem Tavsiyesi:** ${recommendationTr}

---

## 🇺🇸 English Executive Report

### 📈 SaaS Core Metrics
- **Total Revenue:** $${(revenue / 34).toFixed(2)} (Estimated)
- **Total Order Count:** ${orderCount} orders
- **Active Live Users:** ${activeUsers} users

### ⚙️ Infrastructure & Health: ${systemStatusEn}
- **CPU Load:** ${cpuLoad}%
- **RAM Usage:** ${ramUsage}%

### 🧠 Botan-AI Insights & Actions
1. **Business Performance:** Showing a healthy transactional stream with $${(revenue / 34).toFixed(2)} revenue and ${orderCount} total orders. Average order value (AOV) is around $${((revenue / 34) / (orderCount || 1)).toFixed(2)}.
2. **User Traffic Trends:** ${marketingInsightEn}
3. **Infrastructure Advisory:** ${recommendationEn}
  `;

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    report: markdownReport.trim()
  });
};
