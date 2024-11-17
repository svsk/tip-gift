import { type WishUser } from '@prisma-app/client';

export const loadUser = async (id: string, forceReload = false) => {
    const result = await withClientCache<WishUser>(`user-${id}`, `/api/users/${id}`, forceReload);
    if (!result?.data?.value) {
        throw new Error('User not found');
    }

    return result.data;
};

export const useUser = (id: string) => {
    let user = reactive({
        userRef: null as any,
    });

    loadUser(id).then((result) => {
        user.userRef = result;
    });

    return computed(() => user.userRef.value as WishUser | null);
};

export const refreshUser = async (userId: string) => {
    if (!userId) {
        return;
    }

    loadUser(userId, true);
};

export const updateUser = async (user: WishUser) => {
    await $fetch('/api/users/update', {
        body: user,
        method: 'PATCH',
        ...useAuthentication(),
    });

    refreshUser(user.Id);
};

export const useCurrentUser = async () => {
    const auth = useAuth();
    if (!auth.value?.id) {
        return null;
    }

    return await loadUser(auth.value.id);
};

export const searchUsers = async (search: string) => {
    return await $fetch('/api/users/search', { query: { search }, ...useAuthentication() });
};
