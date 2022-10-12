import type { RequestHandler } from 'express';
import { verify } from '../services/firebase';

export const AuthMiddleware: RequestHandler = async (request, response, next) => {
    const token = request.get('Authorization');

    if (!token) {
        response.status(400).end();
        return;
    };

    if (!(await verify(token))) {
        response.status(401).end();
        return;
    };

    next();
}