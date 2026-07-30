import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { CartContext } from '../context/CartContext';

export default function CheckoutScreen({ route, navigation }) {
  const { total } = route.params;
  const { clearCart } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckoutComplete = () => {
    if (!address || !cardNumber || !expiry || !cvv) {
      alert('Lütfen tüm bilgileri doldurun.');
      return;
    }

    setIsLoading(true);

    // Simulate Payment Gateway call
    setTimeout(() => {
      setIsLoading(false);
      clearCart();
      alert('Siparişiniz başarıyla tamamlandı! Teşekkür ederiz.');
      navigation.navigate('Home');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Teslimat & Ödeme</Text>

        {/* Address Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Teslimat Adresi</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Adresinizi buraya yazın..."
            placeholderTextColor="#64748b"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        {/* Payment Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kart Bilgileri</Text>
          <TextInput
            style={styles.input}
            placeholder="Kart Numarası"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            maxLength={16}
            value={cardNumber}
            onChangeText={setCardNumber}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="GG/YY"
              placeholderTextColor="#64748b"
              maxLength={5}
              value={expiry}
              onChangeText={setExpiry}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="CVV"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
        </View>

        {/* Total details */}
        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Ödenecek Tutar</Text>
            <Text style={styles.totalVal}>{total} TL</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.payBtn, isLoading && styles.disabledBtn]} 
          onPress={handleCheckoutComplete}
          disabled={isLoading}
        >
          <Text style={styles.payText}>{isLoading ? 'Ödeniyor...' : 'Siparişi Tamamla'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f19', paddingHorizontal: 16 },
  header: { fontSize: 20, fontWeight: '900', color: '#f8fafc', marginVertical: 16 },
  card: { backgroundColor: '#151e2f', padding: 16, borderRadius: 16, borderHeight: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 16 },
  sectionTitle: { fontSize: 13, color: '#f8fafc', fontWeight: '800', marginBottom: 12 },
  input: { backgroundColor: '#1e293b', color: '#fff', padding: 12, borderRadius: 10, fontSize: 12, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: '#94a3b8', fontSize: 13 },
  totalVal: { color: '#38bdf8', fontSize: 16, fontWeight: '900' },
  payBtn: { backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  disabledBtn: { opacity: 0.6 },
  payText: { color: '#fff', fontSize: 14, fontWeight: '800' }
});
