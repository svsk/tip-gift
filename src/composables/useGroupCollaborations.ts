import type { WishGroupCollaboration } from '@prisma-app/client';

export const getGroupCollaborations = async (groupId: string, forceReload = false) => {
    const result = await withClientCache<WishGroupCollaboration[]>(
        `collabs-${groupId}`,
        `/api/groups/${groupId}/collaborations`,
        forceReload
    );

    if (!result?.data?.value) {
        console.error('Failed to get collaborations.', result.error);
        throw new Error('Failed to get collaborations.');
    }

    return result.data;
};

export const createGroupCollaboration = async (groupId: string, title: string) => {
    await $fetch(`/api/groups/${groupId}/collaborations/add`, {
        method: 'POST',
        body: { groupId, title },
        ...useAuthentication(),
    });

    refreshCollaborations(groupId);
};

export const deleteGroupCollaboration = async (groupId: string, collaborationId: string) => {
    await $fetch(`/api/groups/${groupId}/collaborations/${collaborationId}`, {
        method: 'DELETE',
        ...useAuthentication(),
    });

    refreshCollaborations(groupId);
};

export const canManageCollaboration = (collaboration?: WishGroupCollaboration) => {
    if (!collaboration) {
        return false;
    }

    const user = useAuth();
    return collaboration.CreatedByUserId === user.value?.id;
};

export const refreshCollaborations = async (groupId: string) => getGroupCollaborations(groupId, true);
