import mongoose from 'mongoose';
import { dotenvConfig } from '../config/dotenv.config';

dotenvConfig;

mongoose
    .connect(process.env.MONGO_URI || '')
    .then(() => {
        console.log('[DB]', 'DB Connection successfull!');
    })
    .catch((err) => {
        console.log('[DB]', err);
    });

export { mongoose as mongooseConnection };
