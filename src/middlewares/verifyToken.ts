import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.token as string;

    if (authHeader) {
        jwt.verify(authHeader, process.env.JWT_SECRET_KEY || '', (err, decoded) => {
            if (!err) {
                req.user = decoded;
                next();
            } else {
                res.status(401).json({
                    message: `Invalid Token!`,
                });
            }
        });
    } else {
        res.status(401).json({
            message: `You're not authenticated!`,
        });
    }
};

const verifyTokenAndAuthorization = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        const { user } = req;

        if (user && (req.params.id === user.id || user.isAdmin)) {
            next();
        } else {
            res.status(403).json({ message: 'You can not update this profile' });
        }
    });
};

const verifyTokenAndAdmin = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        const { user } = req;

        if (user && user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: 'You can not allowed to do that' });
        }
    });
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
