import { reviews, products } from '../models/db.js';

export const createProductReview = (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Ürün bulunamadı.' });
  }

  const newReview = {
    id: (reviews.length + 1).toString(),
    productId,
    userName: req.user.name,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString()
  };

  reviews.push(newReview);
  
  // Calculate average rating
  const productReviews = reviews.filter(r => r.productId === productId);
  const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  product.rating = Number(avgRating.toFixed(1));

  res.status(201).json({ message: 'Yorum başarıyla eklendi.', review: newReview });
};

export const getProductReviews = (req, res) => {
  const productReviews = reviews.filter(r => r.productId === req.params.productId);
  res.json(productReviews);
};
