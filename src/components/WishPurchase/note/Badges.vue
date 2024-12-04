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
            :class="{ 'select-none': selectable, 'outline-blue-300 outline': selectedNoteId === noteEntry.Id }"
        >
            {{ noteEntry.Note }}
        </Badge>

        <slot name="empty-state" v-if="!notes.length" />
    </div>
</template>
