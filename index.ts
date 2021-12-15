import express from 'express';
import cors from 'cors';
import { dotenvConfig } from './src/config/dotenv.config';
import { userRoutes } from './src/routes/user.routes';
import { mongooseConnection } from './src/db/mongoose.config';
import { authRoutes } from './src/routes/auth.routes';
import { cartRoutes } from './src/routes/cart.routes';
import { orderRoutes } from './src/routes/order.routes';
import { productRoutes } from './src/routes/product.routes';
import { stripeRoutes } from './src/routes/stripe.routes';

dotenvConfig;
mongooseConnection;

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use('/api/v1/', authRoutes);
app.use('/api/v1/', userRoutes);
app.use('/api/v1/', cartRoutes);
app.use('/api/v1/', orderRoutes);
app.use('/api/v1/', productRoutes);
app.use('/api/v1/', stripeRoutes);

app.listen(PORT, () => {
    console.log('[SERVER]', `Listening on port ${PORT}`);
});
