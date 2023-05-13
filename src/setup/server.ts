import { v2 as cloudinary } from 'cloudinary';
import express from 'express';
import { checkAuth } from '../middleware/auth';
import { router as categoriesAdmin } from '../routes/adminRoutes/categoriesAdmin';
import { router as productsAdmin } from '../routes/adminRoutes/productsAdmin';
import { router as usersAdmin } from '../routes/adminRoutes/usersAdmin';
import { router as categories } from '../routes/categories/categories';
import { router as products } from '../routes/products/products';
import { adminCors, clientCors } from '../utils/cors';
import { limiter } from '../utils/limiter';
import { errorHandler } from '../middleware/error';

export const startServer = (port: number) => {
  const app = express();

  // Middleware
  app.use(limiter);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
  });

  // health check
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  // Routes
  app.use('/api/v1/products', clientCors, products);
  app.use('/api/v1/categories', clientCors, categories);
  app.use('/api/v1/admin', adminCors, usersAdmin);
  app.use('/api/v1/admin/categories', adminCors, checkAuth, categoriesAdmin);
  app.use('/api/v1/admin/products', adminCors, checkAuth, productsAdmin);

  // Error Middleware
  app.use(errorHandler);

  // Start server
  app.listen(port, () => {
    console.log('Server started on http://localhost:' + port);
  });
};
