import { H3Event } from 'h3';

type Auth = {
    id: string;
};

export async function requireAuth<T>(event: H3Event, successDelegate: (auth: Auth) => T | Promise<T>) {
    if (!event.context.auth) {
        event.res.statusCode = 403;
        return null;
    }

    return await successDelegate(event.context.auth.data.user);
}
