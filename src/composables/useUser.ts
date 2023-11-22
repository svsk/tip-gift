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

export const refreshUser = async (userId: string) => {
    if (!userId) {
        return;
    }

    const existing = userCache.get(userId);

    if (!existing) {
        useUser(userId);
        return;
    }

    existing.value = await loadUser(userId);
};

export const updateUser = async (user: WishUser) => {
    await $fetch('/api/users/update', {
        body: user,
        method: 'PATCH',
        ...useAuthentication(),
    });

    refreshUser(user.Id);
};

export const useCurrentUser = () => {
    const auth = useAuth();
    if (!auth.value?.id) {
        return null;
    }

    return useUser(auth.value?.id);
};

export const searchUsers = async (search: string) => {
    return await $fetch('/api/users/search', { query: { search }, ...useAuthentication() });
};
