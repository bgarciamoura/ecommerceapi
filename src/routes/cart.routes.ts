import express from 'express';
import mongoose from 'mongoose';
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middlewares/verifyToken';
import Cart from '../models/Cart';

const cartRoutes = express.Router();

cartRoutes.post('/cart', verifyToken, async (req, res) => {
    const cart = new Cart(req.body);

    try {
        const newCart = await cart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json(error);
    }
});

cartRoutes.put('/cart/:id', verifyTokenAndAuthorization, async (req, res) => {
    const id = req.params.id;

    const { userId, products } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
        res.status(400).json({ message: 'Id is not valid' });
    }

    const cartExists = await Cart.findById(id);

    if (!cartExists) {
        res.status(404).json({ message: 'Cart not found' });
    }

    try {
        const cart = await Cart.updateOne(
            { id },
            {
                $set: {
                    userId,
                    products,
                },
            }
        );

        res.status(200).json({ modified: cart.modifiedCount });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

cartRoutes.delete('/cart/:id', verifyTokenAndAuthorization, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
        return res.status(400).json({ message: 'Id is not valid' });
    }

    const cartExists = await Cart.findById(id);

    if (!cartExists) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    try {
        const cart = await Cart.deleteOne({ id });

        res.status(200).json({ modified: cart.deletedCount });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

cartRoutes.get('/cart/:user_id', verifyTokenAndAuthorization, async (req, res) => {
    const { user_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(user_id) || !user_id) {
        return res.status(400).json({ message: 'Id is not valid' });
    }

    try {
        const cart = await Cart.findOne({ user_id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

cartRoutes.get('/cart', verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();

        if (!carts) {
            return res.status(404).json({ message: 'Carts not found' });
        }

        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

export { cartRoutes };
