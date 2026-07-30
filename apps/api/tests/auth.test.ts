import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import { users } from '../models/db.js';

describe('Auth & Products API Rotaları Testi', () => {
  beforeEach(() => {
    // Testler arasında kullanıcı listesini temizleyelim
    users.length = 0;
  });

  describe('Kimlik Doğrulama (Auth) Rotaları', () => {
    it('Yeni kullanıcı kaydı yapabilmelidir', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.name).toBe('Test User');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.role).toBe('user');
    });

    it('Aynı e-posta ile kayıt olmaya çalışıldığında 400 hatası vermelidir', async () => {
      // Önce kaydet
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      // Tekrar kaydetmeyi dene
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('zaten kayıtlı bir kullanıcı var');
    });

    it('Kayıtlı kullanıcı giriş yapabilmelidir', async () => {
      // Önce kaydet
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      // Giriş yap
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe('test@example.com');
    });

    it('Yanlış şifre ile girişte 41 hatası vermelidir', async () => {
      // Önce kaydet
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      // Yanlış şifre ile giriş yap
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Geçersiz e-posta adresi veya şifre');
    });
  });

  describe('Ürün (Products) Rotaları', () => {
    it('Tüm ürünleri listeleyebilmelidir', async () => {
      const response = await request(app)
        .get('/api/v1/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('price');
    });

    it('ID ile tek bir ürünü getirebilmelidir', async () => {
      const response = await request(app)
        .get('/api/v1/products/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body).toHaveProperty('name');
    });

    it('Bulunamayan ürün IDsi için 404 hatası vermelidir', async () => {
      const response = await request(app)
        .get('/api/v1/products/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Ürün bulunamadı');
    });
  });
});
