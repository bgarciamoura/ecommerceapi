import express from 'express';
import { dotenvConfig } from '../config/dotenv.config';
import { verifyToken, verifyTokenAndAuthorization } from '../middlewares/verifyToken';
import User from '../models/User';

dotenvConfig;
const userRoutes = express.Router();

userRoutes.get('/user', (req, res) => {
    res.json({ message: 'Hello World' });
});

userRoutes.post('/user', (req, res) => {
    const { username } = req.body;
    res.json({ message: `This is your username: ${username}` });
});

userRoutes.put('/user/:id', verifyTokenAndAuthorization, async (req, res) => {
    const { password, name, username, email, isAdmin } = req.body;
    let hashedPassword;

    if (password) {
        hashedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY || '').toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                password: hashedPassword,
                name,
                username,
                email,
                isAdmin,
            },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

export { userRoutes };
