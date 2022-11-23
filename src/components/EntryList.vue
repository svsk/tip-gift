<script setup lang="ts">
import { Wish } from '@prisma/client';
import { ref } from 'vue';

const entries = new Array<Wish>();

const newEntry = ref<Wish | null>(null);
const handleAddClicked = async () => { };

const handleSaveNewEntry = async () => { };
</script>

<template>
    <div class="flex flex-col flex-nowrap">
        <div class="flex justify-end pb-4">
            <button @click="handleAddClicked" class="rounded px-3 py-1 bg-blue-500 text-white">Add New</button>
        </div>

        <div v-if="!entries?.length" class="flex flex-col justify-center items-center text-gray-500 py-12">
            Nothing here yet...
        </div>

        <EntryListItem class="py-2 border-b border-gray-500" v-for="entry in entries" :entry="entry" :key="entry.Id" />
        <EntryListItem @save="handleSaveNewEntry" class="py-2 border-b border-gray-500" v-if="newEntry !== null"
            :entry="newEntry" editable />
    </div>
</template>
