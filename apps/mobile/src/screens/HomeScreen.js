import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { CartContext } from '../context/CartContext';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Ergonomik Kablosuz Mouse', category: 'Teknoloji', price: 850, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200', desc: 'Gelişmiş optik sensör ve 80 saate varan pil ömrü sunan kablosuz mouse.' },
  { id: '2', name: 'Termos 1L', category: 'Ev/Yaşam', price: 620, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200', desc: 'Paslanmaz çelik, çift katmanlı vakumlu termos. İçecekleri 24 saat soğuk tutar.' },
  { id: '3', name: 'Katlanabilir Kamp Sandalyesi', category: 'Spor', price: 480, image: 'https://images.unsplash.com/photo-1596263576925-d90d63691097?w=200', desc: 'Taşıma çantalı, hafif alüminyum gövdeli, bardak tutuculu kamp sandalyesi.' }
];

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const { cart, addToCart } = useContext(CartContext);

  const categories = ['Tümü', 'Teknoloji', 'Ev/Yaşam', 'Spor'];

  const filteredProducts = MOCK_PRODUCTS.filter(item => {
    const matchesCat = activeCategory === 'Tümü' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Trendsepetix</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.navigate('AdminDashboard')}>
            <Text style={{ fontSize: 20 }} title="Admin Dashboard">📊</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartIcon}>🛒</Text>
            {cartItemsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Ürün ara..."
        placeholderTextColor="#64748b"
        value={search}
        onChangeText={setSearch}
      />

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, activeCategory === cat && styles.activeTab]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.tabText, activeCategory === cat && styles.activeTabText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardBody}>
              <Text style={styles.categoryTag}>{item.category}</Text>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.price}>{item.price} TL</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => { addToCart(item); alert('Ürün sepete eklendi!'); }}>
                <Text style={styles.addBtnText}>Sepete Ekle</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f19', paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
  logo: { fontSize: 22, fontWeight: '900', color: '#6366f1' },
  cartBtn: { position: 'relative', padding: 8 },
  cartIcon: { fontSize: 20 },
  badge: { position: 'absolute', right: 0, top: 0, backgroundColor: '#ef4444', borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  searchInput: { backgroundColor: '#1e293b', color: '#fff', padding: 12, borderRadius: 12, fontSize: 14, marginBottom: 12 },
  tabsContainer: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  tab: { backgroundColor: '#151e2f', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  activeTab: { backgroundColor: '#6366f1' },
  tabText: { color: '#94a3b8', fontWeight: '700', fontSize: 12 },
  activeTabText: { color: '#fff' },
  list: { paddingBottom: 24 },
  card: { backgroundColor: '#151e2f', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', padding: 12, marginBottom: 12 },
  image: { width: 90, height: 90, borderRadius: 12, backgroundColor: '#fff' },
  cardBody: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  categoryTag: { fontSize: 10, color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 14, fontWeight: '850', color: '#f8fafc', marginVertical: 4 },
  price: { fontSize: 14, fontWeight: '900', color: '#38bdf8' },
  addBtn: { backgroundColor: '#6366f1', padding: 6, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  addBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' }
});
