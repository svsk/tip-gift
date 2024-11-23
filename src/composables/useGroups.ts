import { type WishUserGroup, type Wish, type WishUserGroupUser } from '@prisma-app/client';
import type { WishWithShareRefs } from '~/prisma/customTypes';

const storeKey = 'userGroups';
const groupWishKey = 'userGroupWishes';
const groupUserKey = 'userGroupUsers';

export const useGroups = () => {
    return withClientCache<WishUserGroup[]>(storeKey, '/api/groups/getall');
};

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

export const useGroupWishes = (groupId: string) => {
    return withClientCache<WishWithShareRefs[]>(`${groupWishKey}-${groupId}`, `/api/groups/${groupId}/wishes`);
};

export const addWishToGroup = async (wishId: string, groupId: string, collaborationId?: string) => {
    const result = await $fetch(`/api/groups/${groupId}/${wishId}`, {
        method: 'POST',
        body: {
            collaborationId,
        },
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
    refreshGroups();
    return result;
};

export const refreshGroups = async () => await (await useGroups()).refresh();
export const refreshGroupWishes = async (groupId: string) => await (await useGroupWishes(groupId)).refresh();
export const refreshGroupUsers = async (groupId: string) => await (await useGroupUsers(groupId)).refresh();
