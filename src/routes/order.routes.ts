import express from 'express';
import mongoose from 'mongoose';
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middlewares/verifyToken';
import Order from '../models/Order';

const orderRoutes = express.Router();

orderRoutes.post('/order', verifyToken, async (req, res) => {
    const { userId, products, amount, address } = req.body;
    // const order = new Order(req.body);

    const order = await Order.create({
        userId,
        products,
        amount,
        address,
    });

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json(error);
    }
});

orderRoutes.put('/order/:id', verifyTokenAndAdmin, async (req, res) => {
    const id = req.params.id;

    const { userId, products, amount, address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
        res.status(400).json({ message: 'Id is not valid' });
    }

    const orderExists = await Order.findById(id);

    if (!orderExists) {
        res.status(404).json({ message: 'Order not found' });
    }

    try {
        const order = await Order.updateOne(
            { id },
            {
                $set: {
                    userId,
                    products,
                    amount,
                    address,
                },
            }
        );

        res.status(200).json({ modified: order.modifiedCount });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

orderRoutes.delete('/order/:id', verifyTokenAndAdmin, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
        return res.status(400).json({ message: 'Id is not valid' });
    }

    const orderExists = await Order.findById(id);

    if (!orderExists) {
        return res.status(404).json({ message: 'Order not found' });
    }

    try {
        const order = await Order.deleteOne({ id });

        res.status(200).json({ modified: order.deletedCount });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

orderRoutes.get('/order/new', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).limit(10);

        if (!orders) {
            return res.status(404).json({ message: 'Orders not found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

orderRoutes.get('/order/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                    sales: '$amount',
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales' },
                },
            },
        ]);

        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

orderRoutes.get('/order/:user_id', verifyTokenAndAuthorization, async (req, res) => {
    const { user_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(user_id) || !user_id) {
        return res.status(400).json({ message: 'Id is not valid' });
    }

    try {
        const orders = await Order.find({ userId: user_id });

        if (!orders) {
            return res.status(404).json({ message: 'Orders not found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

orderRoutes.get('/order', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();

        if (!orders) {
            return res.status(404).json({ message: 'Orders not found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

export { orderRoutes };
