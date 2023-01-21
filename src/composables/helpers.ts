import { WishUserGroup } from '@prisma/client';

export const isGroupAdmin = (resolveGroup: () => WishUserGroup | undefined) =>
    computed(() => {
        const group = resolveGroup();
        const user = useAuth();
        if (group && user.value) {
            return group.CreatedByUserId === user.value.id;
        }

        return false;
    });
