import type { User } from '#auth-utils';
import { requireAuth } from './requireAuth';
import { H3Event } from 'h3';

export const defineAuthorizedEventHandler = (handler: (event: H3Event, auth: User) => any) => {
    return defineEventHandler(async (event) =>
        requireAuth(event, async (auth) => {
            return handler(event, auth);
        })
    );
};
