import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        if (!event.context?.params) {
            setResponseStatus(event, 400);
            return null;
        }

        const { customName, receiverName } = await readBody(event);

        return new DbContext().addCustomWishPurchase(auth.id, customName, receiverName);
    })
);
