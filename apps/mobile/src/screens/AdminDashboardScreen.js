import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, SafeAreaView } from 'react-native';
import { io } from 'socket.io-client';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen() {
  const [metrics, setMetrics] = useState({
    activeUsers: 120,
    cpuLoad: 28,
    ramUsage: 54,
    totalRevenue: 42850,
    orderCount: 8
  });

  const [socketStatus, setSocketStatus] = useState('connecting');
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Sistem Başlatıldı', message: 'Admin Mobil Dashboard başarıyla aktif edildi.', type: 'info', time: 'Şimdi' }
  ]);

  // Alert Banner State & Animation
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'info' });
  const slideAnim = useRef(new Animated.Value(-120)).current;

  // Trigger alert banner animation
  const triggerAlert = (title, message, type) => {
    setAlert({ visible: true, title, message, type });
    
    // Add to history
    const newNotif = {
      id: Math.random().toString(),
      title,
      message,
      type,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Slide down
    Animated.timing(slideAnim, {
      toValue: 20,
      duration: 350,
      useNativeDriver: true
    }).start(() => {
      // Hold for 3.5s and slide up
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -120,
          duration: 350,
          useNativeDriver: true
        }).start(() => {
          setAlert(prev => ({ ...prev, visible: false }));
        });
      }, 3500);
    });
  };

  useEffect(() => {
    let socket;
    let fallbackInterval;

    try {
      // Connect to Socket.io backend
      socket = io('http://localhost:5000', {
        timeout: 4000,
        reconnectionAttempts: 1
      });

      socket.on('connect', () => {
        setSocketStatus('connected');
        triggerAlert('Soket Bağlandı', 'Real-time WebSocket kanalı aktif edildi.', 'success');
      });

      socket.on('connect_error', () => {
        console.warn('Socket connection failed in mobile app, entering fallback mode.');
        setSocketStatus('fallback');
        startFallbackSimulation();
      });

      socket.on('metricsUpdate', (data) => {
        setMetrics(data);
        // Occasionally trigger a warning alert if CPU is simulated high
        if (data.cpuLoad > 70 && Math.random() < 0.3) {
          triggerAlert('⚠️ Yüksek Sunucu Yükü', `Sunucu işlemci kullanımı kritik düzeyde: %${data.cpuLoad}`, 'warning');
        }
      });

      socket.on('newOrder', (order) => {
        triggerAlert('🛒 Yeni Sipariş Alındı', `${order.product} satıldı! Tutar: ₺${order.price}`, 'success');
      });

    } catch (e) {
      console.warn('Failed to connect socket, using fallback local simulation.', e);
      setSocketStatus('fallback');
      startFallbackSimulation();
    }

    function startFallbackSimulation() {
      let revenue = 42850;
      let count = 8;
      let users = 124;

      fallbackInterval = setInterval(() => {
        users = Math.max(80, users + Math.floor(Math.random() * 11) - 5);
        const cpu = Math.floor(Math.random() * 40) + (users > 130 ? 40 : 15);
        const ram = Math.floor(Math.random() * 10) + 55;

        // Occasional simulated order
        if (Math.random() < 0.20) {
          const productsList = ['Ergonomik Mouse', 'Termos 1L', 'Katlanabilir Kamp Sandalyesi', 'Akıllı Saat'];
          const product = productsList[Math.floor(Math.random() * productsList.length)];
          const price = Math.floor(Math.random() * 800) + 200;
          revenue += price;
          count += 1;

          triggerAlert('🛒 Yeni Sipariş Alındı', `${product} satıldı! Tutar: ₺${price}`, 'success');
        }

        // CPU critical alert simulation
        if (cpu > 70 && Math.random() < 0.15) {
          triggerAlert('⚠️ Yüksek Sunucu Yükü', `Sunucu CPU kullanımı yüksek seviyede: %${cpu}`, 'warning');
        }

        setMetrics({
          activeUsers: users,
          cpuLoad: cpu,
          ramUsage: ram,
          totalRevenue: revenue,
          orderCount: count
        });
      }, 3500);
    }

    return () => {
      if (socket) socket.disconnect();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  const handleSimulateHighLoad = () => {
    setMetrics(prev => ({ ...prev, cpuLoad: 89 }));
    triggerAlert('🚨 Kritik Durum Uyarısı', 'Sunucu işlemci yükü kritik seviyede: %89 CPU', 'warning');
  };

  const handleSimulateProSale = () => {
    setMetrics(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + 986, // Add 29 USD in TL equivalent
      orderCount: prev.orderCount + 1
    }));
    triggerAlert('🎉 Yeni Abonelik Satışı', 'Kullanıcı Pro plan üyeliğine yükseltti! Tutar: $29', 'success');
  };

  const handleClearAlerts = () => {
    setNotifications([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Animated Floating Push Notification Banner */}
      <Animated.View style={[
        styles.alertBanner,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor: alert.type === 'warning' ? '#b91c1c' : alert.type === 'success' ? '#047857' : '#1e293b',
          borderColor: alert.type === 'warning' ? '#f87171' : alert.type === 'success' ? '#34d399' : '#38bdf8'
        }
      ]}>
        <Text style={styles.alertTitle}>{alert.title}</Text>
        <Text style={styles.alertMessage}>{alert.message}</Text>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Status Indicator */}
        <View style={styles.statusRow}>
          <Text style={styles.sectionTitle}>Canlı Metrikler (Admin)</Text>
          <View style={styles.statusBadge}>
            <View style={[
              styles.statusDot,
              { backgroundColor: socketStatus === 'connected' ? '#10b981' : socketStatus === 'fallback' ? '#f59e0b' : '#ef4444' }
            ]} />
            <Text style={styles.statusText}>
              {socketStatus === 'connected' ? 'Socket Canlı' : socketStatus === 'fallback' ? 'Soket: Simülasyon' : 'Bağlanıyor...'}
            </Text>
          </View>
        </View>

        {/* Metric Cards Grid */}
        <View style={styles.grid}>
          {/* Revenue Card */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>TOPLAM CİRO</Text>
            <Text style={styles.metricVal}>₺{metrics.totalRevenue.toLocaleString('tr-TR')}</Text>
            <Text style={styles.metricFooter}>Sipariş: {metrics.orderCount}</Text>
          </View>

          {/* Active Users Card */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>AKTİF KULLANICI</Text>
            <Text style={[styles.metricVal, { color: '#818cf8' }]}>{metrics.activeUsers}</Text>
            <Text style={styles.metricFooter}>Anlık Canlı Akış</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {/* CPU Card */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>İŞLEMCİ YÜKÜ (CPU)</Text>
            <Text style={[styles.metricVal, { color: metrics.cpuLoad > 75 ? '#f87171' : '#38bdf8' }]}>%{metrics.cpuLoad}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBar, { width: `${metrics.cpuLoad}%`, backgroundColor: metrics.cpuLoad > 75 ? '#f87171' : '#38bdf8' }]} />
            </View>
          </View>

          {/* RAM Card */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>SUNUCU BELLEK (RAM)</Text>
            <Text style={[styles.metricVal, { color: '#a78bfa' }]}>%{metrics.ramUsage}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBar, { width: `${metrics.ramUsage}%`, backgroundColor: '#a78bfa' }]} />
            </View>
          </View>
        </View>

        {/* Simulator Actions */}
        <Text style={styles.subTitle}>Aksiyon Simülatörü</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#b91c1c' }]} onPress={handleSimulateHighLoad}>
            <Text style={styles.actionBtnText}>🚨 Yüksek Yük Simüle Et</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#047857' }]} onPress={handleSimulateProSale}>
            <Text style={styles.actionBtnText}>🎉 Pro Satış Simüle Et</Text>
          </TouchableOpacity>
        </View>

        {/* In-App Notifications History */}
        <View style={styles.historyHeader}>
          <Text style={styles.subTitle}>Bildirim Geçmişi</Text>
          {notifications.length > 0 && (
            <TouchableOpacity onPress={handleClearAlerts}>
              <Text style={styles.clearBtnText}>Temizle</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.historyContainer}>
          {notifications.length === 0 ? (
            <Text style={styles.noNotifications}>Kayıtlı anlık bildirim bulunmuyor.</Text>
          ) : (
            notifications.map(n => (
              <View key={n.id} style={styles.historyItem}>
                <View style={styles.historyItemHeader}>
                  <Text style={[
                    styles.historyItemTitle,
                    { color: n.type === 'warning' ? '#f87171' : n.type === 'success' ? '#34d399' : '#38bdf8' }
                  ]}>
                    {n.title}
                  </Text>
                  <Text style={styles.historyTime}>{n.time}</Text>
                </View>
                <Text style={styles.historyMessage}>{n.message}</Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f19' },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  alertBanner: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10
  },
  alertTitle: { color: '#fff', fontSize: 13, fontWeight: '900', marginBottom: 2 },
  alertMessage: { color: '#cbd5e1', fontSize: 11, fontWeight: '600' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#f8fafc' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#151e2f', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { color: '#94a3b8', fontSize: 10, fontWeight: '700' },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  metricCard: { flex: 1, backgroundColor: '#151e2f', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', justifyContent: 'space-between', height: 100 },
  metricLabel: { fontSize: 9, color: '#64748b', fontWeight: '800' },
  metricVal: { fontSize: 18, fontWeight: '900', color: '#f8fafc', marginVertical: 4 },
  metricFooter: { fontSize: 9, color: '#38bdf8', fontWeight: '700' },
  progressBarBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', marginTop: 4 },
  progressBar: { height: '100%' },
  subTitle: { fontSize: 14, fontWeight: '900', color: '#f8fafc', marginTop: 16, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  actionsContainer: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  actionBtn: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  clearBtnText: { color: '#ef4444', fontSize: 11, fontWeight: '750', textDecorationLine: 'underline', marginTop: 4 },
  historyContainer: { backgroundColor: '#151e2f', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', minHeight: 180 },
  noNotifications: { color: '#64748b', fontSize: 12, textAlign: 'center', marginTop: 60 },
  historyItem: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.02)', paddingVertical: 8, marginBottom: 4 },
  historyItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  historyItemTitle: { fontSize: 12, fontWeight: '900' },
  historyTime: { fontSize: 9, color: '#64748b', fontWeight: '600' },
  historyMessage: { color: '#94a3b8', fontSize: 11, lineHeight: 15, fontWeight: '600' }
});
