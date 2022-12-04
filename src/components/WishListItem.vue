<script setup lang="ts">
import { Wish } from '@prisma/client';

interface Props {
    entry: Partial<Wish>;
}

const props = defineProps<Props>();
const emit = defineEmits(['delete']);

const handleDeleteClicked = () => {
    emit('delete', props.entry);
};
</script>

<template>
    <div class="flex justify-between items-center flex-nowrap text-lg gap-2">
        <div class="text-base flex-grow">
            {{ entry.Name }}
        </div>
        <div class="flex gap-1 items-center">
            <Button @click="handleDeleteClicked" round> 🗑️ </Button>
        </div>
    </div>
</template>
