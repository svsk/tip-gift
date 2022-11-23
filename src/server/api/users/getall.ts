import { DbContext } from '~~/data/DbContext';

export default defineEventHandler((event) => {
    const db = new DbContext();
    return db.getUsers();
});
