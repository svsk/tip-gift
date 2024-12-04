<script setup lang="ts">
interface Props {
    wishPurchaseId: string;
    selectable?: boolean;
}

const props = defineProps<Props>();

const selectedNoteId = defineModel<string | null>('selectedNoteId');

const noteStore = useWishPurchaseNotes();

const { data: notes } = await noteStore.getWishPurchaseNotes();

const wishPurchaseNotes = computed(() => {
    return notes.value?.filter((n) => n.WishPurchaseId === props.wishPurchaseId);
});

const handleNoteClicked = (noteId: string) => {
    if (props.selectable) {
        selectedNoteId.value = selectedNoteId.value === noteId ? null : noteId;
    }
};

const isUrl = (note: string) => {
    return props.selectable ? false : note.startsWith('http://') || note.startsWith('https://');
};

const urlDisplayValue = (note: string) => {
    return new URL(note).hostname;
};

watch(
    () => notes.value,
    () => {
        if (selectedNoteId.value && !notes.value?.find((n) => n.Id === selectedNoteId.value)) {
            selectedNoteId.value = null;
        }
    },
    { deep: true }
);
</script>

<template>
    <div>
        <Badge
            v-for="noteEntry in wishPurchaseNotes"
            @click="(_) => handleNoteClicked(noteEntry.Id)"
            :class="{
                'select-none': selectable,
                'outline-blue-300 outline': selectedNoteId === noteEntry.Id,
                'max-w-full overflow-hidden inline-block': true,
            }"
        >
            <a v-if="isUrl(noteEntry.Note)" :href="noteEntry.Note" target="_blank" class="flex items-center gap-1">
                <Icon name="open_in_new" />
                {{ urlDisplayValue(noteEntry.Note) }}
            </a>
            <template v-else>
                {{ noteEntry.Note }}
            </template>
        </Badge>

        <slot name="empty-state" v-if="!notes.length" />
    </div>
</template>
