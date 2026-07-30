import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 mins
  max: Number(process.env.RATE_LIMIT_MAX) || 100, // Limit each IP to 100 requests per window
  message: { message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.' }
});
app.use('/api', limiter);

// Swagger Documentation Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trendsepetix RESTful API',
      version: '1.0.0',
      description: 'Trendsepetix E-Ticaret Platformu Fullstack Node.js/Express Backend Servisi API Dokümantasyonu.'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Yerel Geliştirme Sunucusu'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base status route
app.get('/status', (req, res) => {
  res.json({ status: 'Green', message: 'All APIs fully operational.' });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Swagger specs JSDoc descriptors
/**
 * @openapi
 * /status:
 *   get:
 *     summary: Sistem durumunu kontrol et
 *     responses:
 *       200:
 *         description: Başarılı yanıt
 */

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📖 API documentation available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;
