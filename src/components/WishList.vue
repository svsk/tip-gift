<script setup lang="ts">
import { Wish } from '@prisma/client';
import { ref } from 'vue';

const { data: wishes } = useWishes();
const adding = ref(false);
const newWish = ref<Wish | null>(null);
const busyAdding = ref(false);

const nextOrder = () => {
    if (wishes.value?.length) {
        return Math.max(...(wishes.value?.map((w) => w.Order) || [0])) + 1;
    }

    return 1;
};

const handleAddClicked = async () => {
    newWish.value = {
        GroupId: crypto.randomUUID(),
        Order: 999,
    } as Wish;
    adding.value = true;
};

const handleDeleteEntry = async (entry: Wish) => {
    deleteWish(entry);
};

const handleSaveNewEntry = async () => {
    if (newWish.value) {
        busyAdding.value = true;
        await addWish(newWish.value);
        busyAdding.value = false;
        newWish.value = null;
        adding.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col flex-nowrap">
        <div class="flex justify-end pb-4">
            <Button @click="handleAddClicked">Add New</Button>
        </div>

        <EmptyState v-if="!wishes?.length"> Nothing here yet... </EmptyState>

        <WishListItem
            class="py-2 border-b border-gray-600"
            v-for="wish in wishes"
            :entry="wish"
            :key="wish.Id"
            @delete="handleDeleteEntry"
        />
    </div>

    <Dialog v-model="adding">
        <template #title>Add New Wish</template>

        <form @submit.prevent="handleSaveNewEntry" class="flex flex-col gap-4">
            <WishInputFields v-if="newWish" v-model="newWish" />
            <div class="flex justify-end items-center gap-2">
                <Button :disable="busyAdding" @click="() => (adding = false)" flat>Cancel</Button>
                <Button :disable="busyAdding" type="submit">Confirm</Button>
            </div>
        </form>
    </Dialog>
</template>
