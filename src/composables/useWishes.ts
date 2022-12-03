import { Wish } from '@prisma/client';

const storeKey = 'wishes';

const useAuthentication = () => {
    const cookie = useRequestHeaders(['cookie'])?.cookie || '';
    return { headers: { cookie } };
};

export const useWishes = () =>
    useAsyncData(storeKey, async () => {
        return await $fetch('/api/wishes/getall', useAuthentication());
    });

export const addWish = async (wish: Wish) => {
    const result = await $fetch('/api/wishes/add', {
        body: wish,
        method: 'POST',
        ...useAuthentication(),
    });

    refreshWishes();
    return result;
};

export const deleteWish = async (wish: Wish) => {
    console.log(wish);

    const result = await $fetch('/api/wishes/delete', {
        query: { id: wish.Id },
        method: 'DELETE',
        ...useAuthentication(),
    });

    refreshWishes();
    return result;
};

export const refreshWishes = () => refreshNuxtData(storeKey);
