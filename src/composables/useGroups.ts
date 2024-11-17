import { type WishUserGroup, type Wish, type WishUserGroupUser } from '@prisma-app/client';

const storeKey = 'userGroups';
const groupWishKey = 'userGroupWishes';
const groupUserKey = 'userGroupUsers';

export const useGroups = () =>
    useAsyncData(storeKey, () => $fetch<WishUserGroup[]>('/api/groups/getall', useAuthentication()), {
        immediate: true,
    });

export const getGroupByInviteCode = async (inviteCode: string) => {
    return await $fetch<WishUserGroup>(`/api/groups/join/${inviteCode}`, { ...useAuthentication() });
};

export const addGroup = async (group: Partial<WishUserGroup>) => {
    await $fetch('/api/groups/add', {
        method: 'POST',
        body: group,
        ...useAuthentication(),
    });

    refreshGroups();
};

export const updateGroup = async (group: WishUserGroup) => {
    await $fetch('/api/groups/update', {
        method: 'PATCH',
        body: group,
        ...useAuthentication(),
    });

    refreshGroups();
};

export const createGroupInviteCode = async (groupId: string) => {
    const inviteCode = await $fetch(`/api/groups/${groupId}/createInviteCode`, {
        method: 'POST',
        ...useAuthentication(),
    });

    refreshGroups();

    return inviteCode;
};

export const deleteGroup = async (group: WishUserGroup) => {
    await $fetch('/api/groups/delete', {
        method: 'DELETE',
        query: { id: group.Id },
        ...useAuthentication(),
    });

    refreshGroups();
};

export const useGroupWishes = (groupId: string, fromCache = false) => {
    const storeKey = `${groupWishKey}-${groupId}`;

    const cached = fromCache ? retrieveCachedData<Wish[]>(storeKey) : null;
    if (cached) {
        return cached;
    }

    return useAsyncData(storeKey, async () => {
        const result = await $fetch(`/api/groups/${groupId}/wishes`, useAuthentication());
        return result?.map((wish) => ({ ...wish, CreatedDate: new Date(wish.CreatedDate) } as Wish));
    });
};

export const addWishToGroup = async (wishId: string, groupId: string) => {
    const result = await $fetch(`/api/groups/${groupId}/${wishId}`, {
        method: 'POST',
        ...useAuthentication(),
    });

    refreshGroupWishes(groupId);
    return result;
};

export const addWishToAllGroups = async (wishId: string, excludedGroupIds: string[]) => {
    const result = await $fetch(`/api/groups/all/share/${wishId}`, {
        body: { except: excludedGroupIds },
        method: 'POST',
        ...useAuthentication(),
    });

    return result;
};

export const removeWishFromGroup = async (wishGroupWishId: string, groupId: string) => {
    const result = await $fetch(`/api/groups/${groupId}/${wishGroupWishId}`, {
        method: 'DELETE',
        ...useAuthentication(),
    });

    refreshGroupWishes(groupId);
    return result;
};

export const useGroupUsers = (groupId: string) => {
    return withClientCache<WishUserGroupUser[]>(`${groupUserKey}-${groupId}`, `/api/groups/${groupId}/users`);
};

export const addUserToGroup = async (groupId: string, userId: string) => {
    const result = await $fetch(`/api/groups/${groupId}/users/${userId}`, {
        method: 'POST',
        ...useAuthentication(),
    });

    refreshGroupUsers(groupId);
    return result;
};

export const refreshGroups = async () => await (await useGroups()).refresh();
export const refreshGroupWishes = async (groupId: string) => await (await useGroupWishes(groupId)).refresh();
export const refreshGroupUsers = async (groupId: string) => await (await useGroupUsers(groupId)).refresh();
