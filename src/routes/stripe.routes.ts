import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2020-08-27',
});

const stripeRoutes = express.Router();

stripeRoutes.post('/payment', async (req, res) => {
    const { token, amount } = req.body;

    console.log(token, amount);

    try {
        const charge = await stripe.charges.create({
            source: token,
            amount,
            currency: 'brl',
            description: 'Example charge',
        });

        res.json({ message: 'From api', charge });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

export { stripeRoutes };
