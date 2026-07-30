import { orders } from '../models/db.js';

export const createOrder = (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'Sipariş edilecek ürün seçilmedi.' });
  }

  const newOrder = {
    id: (orders.length + 1).toString(),
    userId: req.user.id,
    orderItems,
    shippingAddress,
    totalPrice,
    status: 'Hazırlanıyor',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
};

export const getUserOrders = (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  res.json(userOrders);
};

export const getOrders = (req, res) => {
  res.json(orders);
};
