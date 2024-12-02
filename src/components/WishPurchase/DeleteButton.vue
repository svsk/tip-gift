<script setup lang="ts">
import { type WishPurchase } from '@prisma-app/client';

interface Props {
    wishPurchase: WishPurchase;
    wishTitle: string | null;
}

const props = defineProps<Props>();

const user = await useCurrentUser();
const { i18n } = await useI18n();

const showDeleteConfirmation = ref(false);

const isCurrentUserBuyer = computed(() => {
    return props.wishPurchase.UserId === user?.value?.Id;
});

const handleClick = () => {
    if (isCurrentUserBuyer.value) {
        showDeleteConfirmation.value = true;
    }
};

const handleDeleteConfirmed = () => {
    if (!props.wishPurchase.GroupId) {
        return;
    }

    deleteWishPurchase(props.wishPurchase.Id, props.wishPurchase.GroupId);
    showDeleteConfirmation.value = false;
};
</script>

<template>
    <div>
        <Button flat round :disable="!isCurrentUserBuyer" @click="handleClick">
            <slot />
        </Button>

        <Dialog :model-value="showDeleteConfirmation">
            <template #title> <Localized tkey="RemoveBoughtWish" /> </template>

            <div class="flex flex-col gap-4">
                {{ i18n('ConfirmRemoveBoughtWish', wishTitle || '') }}

                <div class="flex justify-end items-center gap-2">
                    <Button @click="() => (showDeleteConfirmation = false)" flat>
                        <Localized tkey="Cancel" />
                    </Button>
                    <Button color="bg-red-500" @click="handleDeleteConfirmed">
                        <Localized tkey="Delete" />
                    </Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>
