import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
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
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/billing', billingRoutes);

// Error Handling Middleware
app.use(errorHandler);

// HTTP Server & Socket.io configuration
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Live Simulation State
let activeUsers = 120;
let totalRevenue = 42850;
let orderCount = 8;
const productNames = [
  'Ergonomik Kablosuz Mouse',
  'Termos 1L',
  'Katlanabilir Kamp Sandalyesi',
  'RGB Mekanik Klavye',
  'Kablosuz Kulaküstü Kulaklık',
  'Akıllı Saat Pro'
];

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  socket.emit('metricsUpdate', {
    activeUsers,
    cpuLoad: Math.floor(Math.random() * 30) + 20,
    ramUsage: Math.floor(Math.random() * 15) + 50,
    totalRevenue,
    orderCount
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Periodic simulator (runs every 3 seconds)
setInterval(() => {
  activeUsers = Math.max(80, activeUsers + Math.floor(Math.random() * 11) - 5);
  const cpuLoad = Math.floor(Math.random() * 40) + (activeUsers > 130 ? 40 : 15);
  const ramUsage = Math.floor(Math.random() * 10) + 55;

  if (Math.random() < 0.20) {
    const randomProduct = productNames[Math.floor(Math.random() * productNames.length)];
    const price = Math.floor(Math.random() * 1500) + 200;
    totalRevenue += price;
    orderCount += 1;

    const newOrder = {
      id: Math.random().toString(36).substring(2, 9),
      product: randomProduct,
      price,
      timestamp: new Date().toLocaleTimeString('tr-TR')
    };

    io.emit('newOrder', newOrder);
  }

  io.emit('metricsUpdate', {
    activeUsers,
    cpuLoad,
    ramUsage,
    totalRevenue,
    orderCount
  });
}, 3000);

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
  server.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📖 API documentation available at http://localhost:${PORT}/api-docs`);
  });
}

export { server };
export default app;
