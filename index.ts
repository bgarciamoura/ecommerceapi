import express from 'express';
import { dotenvConfig } from './src/config/dotenv.config';
import { userRoutes } from './src/routes/user.routes';
import { mongooseConnection } from './src/db/mongoose.config';

dotenvConfig;
mongooseConnection;

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use('/api/v1/', userRoutes);

app.listen(PORT, () => {
    console.log('[SERVER]', `Listening on port ${PORT}`);
});
