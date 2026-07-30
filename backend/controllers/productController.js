import { products } from '../models/db.js';

export const getProducts = (req, res) => {
  res.json(products);
};

export const getProductById = (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Ürün bulunamadı.' });
  }
};

export const createProduct = (req, res) => {
  const { name, category, price, stock } = req.body;

  const newProduct = {
    id: (products.length + 1).toString(),
    name,
    category,
    price,
    stock: stock || 0,
    rating: 5.0
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

export const deleteProduct = (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index > -1) {
    products.splice(index, 1);
    res.json({ message: 'Ürün başarıyla silindi.' });
  } else {
    res.status(404).json({ message: 'Ürün bulunamadı.' });
  }
};
