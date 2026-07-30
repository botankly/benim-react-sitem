import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { CartContext } from '../context/CartContext';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Standard');

  const sizes = ['Standard', 'Medium', 'Large'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Back and Close buttons simulated */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Geri Dön</Text>
        </TouchableOpacity>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>

        {/* Details card */}
        <View style={styles.detailsCard}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{product.price} TL</Text>
          <Text style={styles.desc}>{product.desc}</Text>

          {/* Size Select */}
          <Text style={styles.sectionTitle}>Ebat / Beden Seçimi</Text>
          <View style={styles.sizeContainer}>
            {sizes.map(size => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeBtn, selectedSize === size && styles.activeSizeBtn]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[styles.sizeText, selectedSize === size && styles.activeSizeText]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity Selector */}
          <Text style={styles.sectionTitle}>Adet</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(q => q > 1 ? q - 1 : 1)}>
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(q => q + 1)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Add to Basket Action */}
          <TouchableOpacity 
            style={styles.addCartBtn} 
            onPress={() => {
              addToCart(product, quantity);
              alert('Ürün sepete eklendi!');
              navigation.goBack();
            }}
          >
            <Text style={styles.addCartText}>Sepete Ekle ({product.price * quantity} TL)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f19', paddingHorizontal: 16 },
  backBtn: { marginVertical: 12, paddingVertical: 6 },
  backText: { color: '#38bdf8', fontSize: 13, fontWeight: '700' },
  imageContainer: { width: '100%', height: 260, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  image: { width: '80%', height: '80%', objectFit: 'contain' },
  detailsCard: { marginTop: 16, padding: 4 },
  category: { fontSize: 11, color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' },
  title: { fontSize: 20, fontWeight: '900', color: '#f8fafc', marginVertical: 8 },
  price: { fontSize: 20, fontWeight: '950', color: '#38bdf8', marginBottom: 12 },
  desc: { fontSize: 13, color: '#94a3b8', lineHeight: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 13, color: '#f8fafc', fontWeight: '800', marginBottom: 8 },
  sizeContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  sizeBtn: { backgroundColor: '#151e2f', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  activeSizeBtn: { backgroundColor: '#6366f1' },
  sizeText: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  activeSizeText: { color: '#fff' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 },
  qtyBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  qtyValue: { color: '#fff', fontSize: 15, fontWeight: '800', minWidth: 20, textAlign: 'center' },
  addCartBtn: { backgroundColor: '#6366f1', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  addCartText: { color: '#fff', fontSize: 14, fontWeight: '800' }
});
