import express from 'express';

const orderRoutes = express.Router();

orderRoutes.get('/order', (req, res) => {
    res.json({ message: 'Hello World' });
});

orderRoutes.post('/order', (req, res) => {
    const { username } = req.body;
    res.json({ message: `This is your username: ${username}` });
});

export { orderRoutes };
