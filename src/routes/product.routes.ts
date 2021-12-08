import express from 'express';

const productRoutes = express.Router();

productRoutes.get('/product', (req, res) => {
    res.json({ message: 'Hello World' });
});

productRoutes.post('/product', (req, res) => {
    const { username } = req.body;
    res.json({ message: `This is your username: ${username}` });
});

export { productRoutes };
