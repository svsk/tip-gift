import { DbContext } from '~~/data/DbContext';

export default defineEventHandler(async (event) => {
    const body = await readBody<{ username: string }>(event);

    console.log('loggin in', body.username);

    return new DbContext().getUserByUsername(body.username);
});
