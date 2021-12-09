import express from 'express';
import { dotenvConfig } from '../config/dotenv.config';
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middlewares/verifyToken';
import User from '../models/User';
import IUser from '../interfaces/user.interface';

dotenvConfig;
const userRoutes = express.Router();

userRoutes.put('/users/:id', verifyTokenAndAuthorization, async (req, res) => {
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

userRoutes.delete('/users/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (deletedUser) {
            res.status(200).json({ message: 'User has been deleted', deletedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

userRoutes.get('/users/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();

    // const lastYear = new Date(date.getFullYear() - 1);
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    console.log({ lastYear });

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 },
                },
            },
        ]);

        // console.log(data);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
});

userRoutes.get('/users/:id?', verifyTokenAndAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            const user = await User.findById(id);
            if (user) {
                user.password = undefined;
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } else {
            const users = await User.find();

            users.forEach((user) => {
                user.password = undefined;
            });

            res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

export { userRoutes };
