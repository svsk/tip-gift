import type { WishGroupCollaboration, WishGroupCollaborationMember } from '@prisma-app/client';

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

export const createGroupCollaboration = async (
    groupId: string,
    title: string,
    memberIds: string[],
    avatarEmoji = '🤝',
    avatarColour = '#339DD7'
) => {
    await $fetch(`/api/groups/${groupId}/collaborations/add`, {
        method: 'POST',
        body: { groupId, title, memberIds, avatarColour, avatarEmoji },
        ...useAuthentication(),
    });

    refreshCollaborations(groupId);
};

export const updateGroupCollaboration = async (collaboration: {
    Id: string;
    Title: string;
    AvatarEmoji: string;
    AvatarColour: string;
    WishUserGroupId: string;
}) => {
    await $fetch(`/api/groups/${collaboration.WishUserGroupId}/collaborations/${collaboration.Id}`, {
        method: 'PATCH',
        body: collaboration,
        ...useAuthentication(),
    });

    refreshCollaborations(collaboration.WishUserGroupId);
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

export const useCollaborationMembers = async (groupId: string, collaborationId: string, forceReload = false) => {
    const result = await withClientCache<WishGroupCollaborationMember[]>(
        `collabmembers-${collaborationId}`,
        `/api/groups/${groupId}/collaborations/${collaborationId}/members`,
        forceReload
    );

    if (!result?.data?.value) {
        console.error('Failed to get collaboration members.', result.error);
        throw new Error('Failed to get collaboration members.');
    }

    return result.data;
};

export const refreshCollaborations = async (groupId: string) => getGroupCollaborations(groupId, true);
export const refreshCollaborationMembers = async (groupId: string, collaborationId: string) =>
    useCollaborationMembers(groupId, collaborationId, true);
