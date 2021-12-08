import express from 'express';
import User from '../models/User';
import CryptoJS from 'crypto-js';
import { dotenvConfig } from '../config/dotenv.config';
import jwt from 'jsonwebtoken';

dotenvConfig;

const authRoutes = express.Router();

authRoutes.get('/auth', (req, res) => {
    res.json({ message: 'Hello World' });
});

authRoutes.post('/auth/register', async (req, res) => {
    const { name, username, password, email } = req.body;

    const hashedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY || '').toString();

    const newUser = new User({
        name,
        username,
        password: hashedPassword,
        email,
    });

    try {
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

authRoutes.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Username or password is incorrect' });
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY || '').toString(
            CryptoJS.enc.Utf8
        );

        if (password === hashedPassword) {
            user.password = undefined;

            const token = jwt.sign(
                {
                    userId: user._id,
                    isAdmin: user.isAdmin,
                },
                process.env.JWT_SECRET_KEY || '',
                { expiresIn: '1h' }
            );

            res.status(200).json({ user, token });
        } else {
            res.status(401).json({ message: 'Username or password is incorrect' });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

export { authRoutes };
