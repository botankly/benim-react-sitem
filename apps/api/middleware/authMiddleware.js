import jwt from 'jsonwebtoken';
import { users } from '../models/db.js';

export const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123');
      
      const user = users.find(u => u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Yetkisiz erişim, kullanıcı bulunamadı.' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Yetkisiz erişim, geçersiz token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Yetkisiz erişim, token sağlanmadı.' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Yetkisiz erişim, admin yetkisi gereklidir.' });
  }
};
