import type { RequestHandler } from 'express';
import { verify } from '../services/firebase';

export const AuthMiddleware: RequestHandler = async (request, response, next) => {
    const token = request.get('Authorization');

    try {
        if (!token) throw 400;
        if (!(await verify(token))) throw 401;
    } catch (code: any) {
        response.status(code).end();
        return;
    };

    next();
}