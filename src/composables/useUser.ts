import { type WishUser } from '@prisma-app/client';

const loadPromises: { [key: string]: Promise<WishUser> } = {};
const userCache = new Map<string, Ref<WishUser | null>>();

const loadUser = async (id: string) => {
    const user = await $fetch<WishUser>(`/api/users/${id}`, useAuthentication());
    return user;
};

export const useUser = (id: string) => {
    const userRef = userCache.get(id) || ref(null);

    if (!userCache.has(id)) {
        userCache.set(id, userRef);
    }

    const promise = loadPromises[id] || (loadPromises[id] = loadUser(id));
    promise.then((u) => {
        userRef.value = u;
    });

    return userRef;
};

export const updateUser = async (user: WishUser) => {
    if (!user?.Id) {
        return;
    }

    const existing = userCache.get(user.Id);

    if (!existing) {
        useUser(user.Id);
        return;
    }

    existing.value = await loadUser(user.Id);
};

export const searchUsers = async (search: string) => {
    return await $fetch('/api/users/search', { query: { search }, ...useAuthentication() });
};
