import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI || '')
    .then(() => {
        console.log('[DB]', 'DB Connection successfull!');
    })
    .catch((err) => {
        console.log('[DB]', err);
    });

app.listen(3333, () => {
    console.log('[SERVER]', 'Listening on port 3333');
});
