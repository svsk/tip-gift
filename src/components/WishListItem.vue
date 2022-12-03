<script setup lang="ts">
import { Wish } from '@prisma/client';

interface Props {
    entry: Partial<Wish>;
    editable?: boolean;
}

const title = ref('');
const titleInput = ref<any>(null);
const props = defineProps<Props>();
const emit = defineEmits(['save', 'delete']);

onMounted(() => {
    if (props.editable === true) {
        titleInput.value?.focus();
    }
});

const handleSaveEntry = () => {
    props.entry.Name = title.value;
    emit('save', props.entry);
};

const handleDeleteClicked = () => {
    emit('delete', props.entry);
};
</script>

<template>
    <form @submit.prevent="handleSaveEntry" class="flex justify-between items-center flex-nowrap text-lg gap-2">
        <div class="text-base">
            <span v-if="!editable">{{ entry.Name }}</span>
            <Input v-else v-model="title" label="Description" />
        </div>
        <div class="flex gap-1 items-center">
            <Button v-if="editable" type="submit" round> 💾 </Button>
            <Button @click="handleDeleteClicked" round> 🗑️ </Button>
        </div>
    </form>
</template>
