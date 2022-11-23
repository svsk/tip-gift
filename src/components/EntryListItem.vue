<script setup lang="ts">
import { Wish } from '@prisma/client';

interface Props {
    entry: Partial<Wish>;
    editable?: boolean;
}

const titleInput = ref<HTMLDivElement | null>(null);
const props = defineProps<Props>();
const emit = defineEmits(['save']);

onMounted(() => {
    if (props.editable === true) {
        titleInput.value?.focus();
    }
});

const handleValueChanged = () => {
    props.entry.Name = titleInput.value?.innerText;
};

const handlePriceChanged = (e: Event) => {
    const val = parseInt((e.target as HTMLDivElement).innerText);
    if (!isNaN(val) && val > 0) {
        props.entry.Price = val;
    }
};

const handleSaveClicked = () => {
    emit('save', props.entry);
};
</script>

<template>
    <div class="flex justify-between items-center flex-nowrap text-lg">
        <div
            @input="handleValueChanged"
            ref="titleInput"
            :class="{ 'w-[80%] border-b-2 border-blue-500': editable }"
            :tabindex="editable ? '1' : ''"
            :contenteditable="editable ? 'true' : 'false'"
        >
            {{ entry.Name }}
        </div>

        <div class="flex gap-6 items-center">
            <div class="flex flex-nowrap">
                <div class="mr-1">Kr.</div>
                <div
                    @input="handlePriceChanged"
                    :contenteditable="editable ? 'true' : 'false'"
                    :tabindex="editable ? '2' : ''"
                    :class="{ 'border-b-2 border-blue-500': editable }"
                >
                    {{ entry.Price }}
                </div>
                ,-
            </div>
            <div>
                <button class="bg-green-500 rounded px-2 py-1" v-if="editable" type="button" @click="handleSaveClicked">
                    Save
                </button>
                <!-- <a v-if="entry.Link" :href="entry.Link" target="_blank"> [Link] </a> -->
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
*:focus-visible {
    outline: none;
}
</style>
