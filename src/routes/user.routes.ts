import express from 'express';

const userRoutes = express.Router();

userRoutes.get('/user', (req, res) => {
    res.json({ message: 'Hello World' });
});

userRoutes.post('/user', (req, res) => {
    const { username } = req.body;
    res.json(username);
});

export { userRoutes };
