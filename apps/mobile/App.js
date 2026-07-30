import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { CartProvider } from './src/context/CartContext';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer theme={{
        dark: true,
        colors: {
          primary: '#6366f1',
          background: '#0b0f19',
          card: '#151e2f',
          text: '#f8fafc',
          border: 'rgba(255,255,255,0.05)',
          notification: '#ef4444'
        }
      }}>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#151e2f' },
            headerTintColor: '#f8fafc',
            headerTitleStyle: { fontWeight: '800', fontSize: 16 },
            headerShadowVisible: false
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mağaza' }} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Ürün Detayı' }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Sepetim' }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Ödeme' }} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </CartProvider>
  );
}
