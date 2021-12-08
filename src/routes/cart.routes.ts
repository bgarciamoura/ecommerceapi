import express from 'express';

const cartRoutes = express.Router();

cartRoutes.get('/cart', (req, res) => {
    res.json({ message: 'Hello World' });
});

cartRoutes.post('/cart', (req, res) => {
    const { username } = req.body;
    res.json({ message: `This is your username: ${username}` });
});

export { cartRoutes };
