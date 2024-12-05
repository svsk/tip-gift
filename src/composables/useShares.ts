import type { WishListShare } from '~/prisma/customTypes';

const shareKey = 'user-shares';

export const useShares = () =>
    useAsyncData(shareKey, () => $fetch('/api/wishes/share', useAuthentication()), {
        immediate: true,
    });

export const useGroupShares = (groupId: string, forceReload = false) =>
    withEnsuredSuccess(
        withClientCache<WishListShare[]>(`group-share-${groupId}`, `/api/groups/${groupId}/share`, forceReload)
    );

export const generateShareKey = async (listName: string) => {
    const share = await $fetch('/api/wishes/share', {
        body: { slug: listName },
        method: 'POST',
        ...useAuthentication(),
    });

    refreshShares();
    return share;
};

export const generateGroupShare = async (groupId: string, listName: string) => {
    const share = await $fetch(`/api/groups/${groupId}/share`, {
        body: { slug: listName },
        method: 'POST',
        ...useAuthentication(),
    });

    refreshGroupShares(groupId);
    return share;
};

export const refreshShares = async () => await (await useShares()).refresh();
const refreshGroupShares = async (groupId: string) => useGroupShares(groupId, true);
