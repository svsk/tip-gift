<script setup lang="ts">
import { type WishPurchase } from '@prisma-app/client';
import type { WishPurchaseWish } from '~/prisma/customTypes';

interface Props {
    wishPurchase: WishPurchase | WishPurchaseWish;
    wishTitle?: string | null;
}

interface Emits {
    (event: 'wish-purchase-deleted'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const user = await useCurrentUser();
const { i18n } = await useI18n();

const showDeleteConfirmation = ref(false);
const busy = ref(false);

const isCurrentUserBuyer = computed(() => {
    return props.wishPurchase.UserId === user?.value?.Id;
});

const title = computed(() => {
    if (props.wishTitle) {
        return props.wishTitle;
    }

    if ('Name' in props.wishPurchase) {
        return props.wishPurchase.Name;
    }

    return null;
});

const handleClick = () => {
    if (isCurrentUserBuyer.value) {
        showDeleteConfirmation.value = true;
    }
};

const handleDeleteConfirmed = async () => {
    try {
        busy.value = true;
        await deleteWishPurchase(props.wishPurchase.Id, props.wishPurchase.GroupId);
        showDeleteConfirmation.value = false;
        emit('wish-purchase-deleted');
    } catch (error) {
        console.error(error);
    } finally {
        busy.value = false;
    }
};
</script>

<template>
    <div>
        <Button flat round :disable="!isCurrentUserBuyer" @click="handleClick">
            <slot>
                <Icon name="delete" font-size="24px" />
            </slot>
        </Button>

        <Dialog :model-value="showDeleteConfirmation" persistent>
            <template #title> <Localized tkey="RemoveBoughtWish" /> </template>

            <div class="flex flex-col gap-4">
                {{ i18n('ConfirmRemoveBoughtWish', title || '') }}

                <div class="flex justify-end items-center gap-2">
                    <Button :disable="busy" flat @click="() => (showDeleteConfirmation = false)">
                        <Localized tkey="Cancel" />
                    </Button>
                    <Button :disable="busy" color="bg-red-500" @click="handleDeleteConfirmed">
                        <Localized tkey="Delete" />
                    </Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>
