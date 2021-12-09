import express from 'express';
import mongoose from 'mongoose';
import { verifyTokenAndAdmin } from '../middlewares/verifyToken';
import Product from '../models/Product';

const productRoutes = express.Router();

productRoutes.post('/products', verifyTokenAndAdmin, async (req, res) => {
    const { title, desc, img, categories, size, color, price } = req.body;

    const product = new Product({
        title,
        desc,
        img,
        categories,
        size,
        color,
        price,
    });

    try {
        const newProduct = await product.save();
        res.status(200).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

productRoutes.put('/products/:id', verifyTokenAndAdmin, async (req, res) => {
    const id = req.params.id;

    const { title, desc, img, categories, size, color, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
        res.status(400).json({ message: 'Id is not valid' });
    }

    const product = await Product.findById(id);

    if (!product) {
        res.status(404).json({ message: 'Product not found' });
    }

    try {
        const product = await Product.updateOne(
            { id },
            {
                title,
                desc,
                img,
                categories,
                size,
                color,
                price,
            }
        );

        res.status(200).json({ modified: product.modifiedCount });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

productRoutes.delete('/products/:id', verifyTokenAndAdmin, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
        return res.status(400).json({ message: 'Id is not valid' });
    }

    const productExists = await Product.findById(id);

    if (!productExists) {
        return res.status(404).json({ message: 'Product not found' });
    }

    try {
        const product = await Product.deleteOne({ id });

        res.status(200).json({ modified: product.deletedCount });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

productRoutes.get('/products/new', verifyTokenAndAdmin, async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

productRoutes.get('/products/category', verifyTokenAndAdmin, async (req, res) => {
    const { categories } = req.body;

    try {
        if (categories) {
            const products = await Product.find({
                categories: {
                    $in: [...categories],
                },
            });

            res.status(200).json(products);
        } else {
            res.status(400).json({ message: 'Category is required' });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

productRoutes.get('/products/:id?', verifyTokenAndAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        if (mongoose.Types.ObjectId.isValid(id) || id) {
            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json(product);
        } else {
            const products = await Product.find().sort({ createdAt: -1 });

            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

export { productRoutes };
