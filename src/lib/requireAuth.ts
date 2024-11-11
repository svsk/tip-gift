import type { User } from '#auth-utils';
import { H3Event } from 'h3';

export async function requireAuth<T>(event: H3Event, successDelegate: (auth: User) => T | Promise<T>) {
    if (!event.context.auth) {
        setResponseStatus(event, 403);
        return null;
    }

    try {
        return await successDelegate(event.context.auth.user);
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}
