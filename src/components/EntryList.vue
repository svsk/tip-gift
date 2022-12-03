<script setup lang="ts">
import { Wish } from '@prisma/client';
import { ref } from 'vue';

const cookie = useRequestHeaders(['cookie']).cookie || '';
const { data: entries, refresh: refreshEntries } = await useFetch('/api/entries/getall', {
    headers: { cookie },
});

const nextOrder = () => {
    if (entries.value?.length) {
        return Math.max(...(entries.value?.map((w) => w.Order) || [0])) + 1;
    }

    return 1;
};

const newEntry = ref<Wish | null>(null);
const handleAddClicked = async () => {
    const userId = useAuth().value?.id;
    const groupId = crypto.randomUUID();

    if (userId && groupId) {
        newEntry.value = {
            Order: nextOrder(),
            GroupId: groupId,
            UserId: userId,
        } as Wish;
    }
};

const handleSaveNewEntry = async () => {
    await useFetch('/api/entries/add', {
        key: crypto.randomUUID(),
        body: newEntry.value,
        method: 'POST',
        headers: { cookie },
    });
    await refreshEntries();

    newEntry.value = null;
};
</script>

<template>
    <div class="flex flex-col flex-nowrap">
        <div class="flex justify-end pb-4">
            <Button @click="handleAddClicked">Add New</Button>
        </div>

        <EmptyState v-if="!entries?.length"> Nothing here yet... </EmptyState>

        <EntryListItem class="py-2 border-b border-gray-500" v-for="entry in entries" :entry="entry" :key="entry.Id" />
        <EntryListItem
            @save="handleSaveNewEntry"
            class="py-2 border-b border-gray-500"
            v-if="newEntry !== null"
            :entry="newEntry"
            editable
        />
    </div>
</template>
