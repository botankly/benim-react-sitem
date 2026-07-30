import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { CartContext } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (appliedDiscount / 100);
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'INDIRIM20') {
      setAppliedDiscount(20);
      alert('Kupon başarıyla uygulandı! %20 İndirim.');
    } else {
      alert('Geçersiz kupon kodu.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sepetim</Text>

      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.body}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.price}>{item.price} TL</Text>

                  {/* Quantity adjust */}
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, -1)}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.removeBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.list}
          />

          {/* Coupon inputs */}
          <View style={styles.couponContainer}>
            <TextInput
              style={styles.couponInput}
              placeholder="İndirim Kuponu Girin (Örn: INDIRIM20)"
              placeholderTextColor="#64748b"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.couponApplyBtn} onPress={handleApplyCoupon}>
              <Text style={styles.couponApplyText}>Uygula</Text>
            </TouchableOpacity>
          </View>

          {/* Totals card */}
          <View style={styles.totalsCard}>
            <View style={styles.row}>
              <Text style={styles.label}>Ara Toplam</Text>
              <Text style={styles.val}>{subtotal} TL</Text>
            </View>
            {appliedDiscount > 0 && (
              <View style={styles.row}>
                <Text style={styles.label}>İndirim (%{appliedDiscount})</Text>
                <Text style={[styles.val, { color: '#ef4444' }]}>-{discountAmount} TL</Text>
              </View>
            )}
            <View style={[styles.row, styles.totalRow]}>
              <Text style={styles.totalLabel}>Toplam</Text>
              <Text style={styles.totalVal}>{total} TL</Text>
            </View>

            <TouchableOpacity 
              style={styles.checkoutBtn} 
              onPress={() => navigation.navigate('Checkout', { total })}
            >
              <Text style={styles.checkoutText}>Ödemeye Geç</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Sepetinizde ürün bulunmamaktadır.</Text>
          <TouchableOpacity style={styles.goHomeBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.goHomeText}>Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f19', paddingHorizontal: 16 },
  header: { fontSize: 20, fontWeight: '900', color: '#f8fafc', marginVertical: 16 },
  list: { paddingBottom: 16 },
  cartCard: { backgroundColor: '#151e2f', borderRadius: 16, borderHeight: 1, borderColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', padding: 12, marginBottom: 12, alignItems: 'center' },
  image: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#fff' },
  body: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  title: { fontSize: 13, fontWeight: '800', color: '#f8fafc' },
  price: { fontSize: 13, fontWeight: '850', color: '#38bdf8', marginVertical: 4 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  qtyText: { color: '#fff', fontSize: 13, fontWeight: '700', minWidth: 15, textAlign: 'center' },
  removeBtn: { padding: 8 },
  removeBtnText: { fontSize: 16 },
  couponContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  couponInput: { flex: 1, backgroundColor: '#1e293b', color: '#fff', padding: 10, borderRadius: 10, fontSize: 12 },
  couponApplyBtn: { backgroundColor: '#6366f1', justifyContent: 'center', paddingHorizontal: 16, borderRadius: 10 },
  couponApplyText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  totalsCard: { backgroundColor: '#151e2f', padding: 16, borderRadius: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#94a3b8', fontSize: 12 },
  val: { color: '#f8fafc', fontSize: 12, fontWeight: '700' },
  totalRow: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10, marginTop: 4 },
  totalLabel: { color: '#f8fafc', fontSize: 14, fontWeight: '900' },
  totalVal: { color: '#38bdf8', fontSize: 14, fontWeight: '900' },
  checkoutBtn: { backgroundColor: '#10b981', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  checkoutText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 13, marginBottom: 16 },
  goHomeBtn: { backgroundColor: '#6366f1', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  goHomeText: { color: '#fff', fontSize: 12, fontWeight: '700' }
});
