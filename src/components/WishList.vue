<script setup lang="ts">
import { Wish } from '@prisma/client';
import { ref } from 'vue';

const { data: wishes } = useWishes();

const nextOrder = () => {
    if (wishes.value?.length) {
        return Math.max(...(wishes.value?.map((w) => w.Order) || [0])) + 1;
    }

    return 1;
};

const newWish = ref<Wish | null>(null);
const handleAddClicked = async () => {
    const userId = useAuth().value?.id;
    const groupId = crypto.randomUUID();

    if (userId && groupId) {
        newWish.value = {
            Order: nextOrder(),
            GroupId: groupId,
            UserId: userId,
            Price: 0,
        } as Wish;
    }
};

const handleSaveNewEntry = async () => {
    if (newWish.value) {
        await addWish(newWish.value);
    }

    newWish.value = null;
};

const handleDeleteEntry = async (entry: Wish) => {
    deleteWish(entry);
};
</script>

<template>
    <div class="flex flex-col flex-nowrap">
        <div class="flex justify-end pb-4">
            <Button @click="handleAddClicked">Add New</Button>
        </div>

        <EmptyState v-if="!wishes?.length"> Nothing here yet... </EmptyState>

        <Transition name="slideIn">
            <WishListItem
                @save="handleSaveNewEntry"
                class="py-2 border-b border-gray-600"
                v-if="newWish !== null"
                :entry="newWish"
                editable
            />
        </Transition>

        <WishListItem
            class="py-2 border-b border-gray-600"
            v-for="wish in wishes"
            :entry="wish"
            :key="wish.Id"
            @delete="handleDeleteEntry"
        />
    </div>
</template>

<style lang="scss" scoped>
.slideIn-enter-active,
.slideIn-leave-active {
    transition: all 0.1s linear;
}

.slideIn-enter-from,
.slideIn-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
