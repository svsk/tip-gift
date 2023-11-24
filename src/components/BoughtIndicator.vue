<script setup lang="ts">
import { deleteWishPurchase } from '~/composables/useGroups';
import { useCurrentUser } from '~/composables/useUser';

interface Props {
    wishTitle: string | null;
    wishPurchase: {
        Id: string;
        WishId: string;
        GroupId: string;
        UserId: string;
    };
}

const props = defineProps<Props>();

const user = useCurrentUser();
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
    deleteWishPurchase(props.wishPurchase.Id, props.wishPurchase.GroupId);
    showDeleteConfirmation.value = false;
};
</script>

<template>
    <div :class="{ 'relative select-none w-[36px]': true }" @click="handleClick">
        <div class="scale-[0.5]">
            <User without-username :user-id="wishPurchase.UserId" :class="{ 'cursor-pointer': isCurrentUserBuyer }" />
        </div>
        <div class="absolute bottom-[4px] right-[-6px] scale-75">🎁</div>

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
