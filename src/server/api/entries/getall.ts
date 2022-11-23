import { DbContext } from '~~/data/DbContext';

export default defineEventHandler((_) => {
    const db = new DbContext();
    return db.getWishes();
});
