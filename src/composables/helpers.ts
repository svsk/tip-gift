import { type WishUserGroup } from '@prisma-app/client';

export const isGroupAdmin = (group?: WishUserGroup) => {
    if (!group) {
        return false;
    }

    const user = useAuth();
    if (group && user.value) {
        return group.CreatedByUserId === user.value.id;
    }

    return false;
};

export const random = () => {
    return Math.floor(Math.random() * 99999999)
        .toString()
        .padStart(8, '0');
};

export const Toast = () => {
    const toast = ref<HTMLElement | null>(null);

    const show = (message: string, duration = 3000) => {
        if (toast.value) {
            toast.value.innerText = message;
            toast.value.classList.add('show');

            setTimeout(() => {
                toast.value?.classList.remove('show');
            }, duration);
        }
    };

    return { show };
};
