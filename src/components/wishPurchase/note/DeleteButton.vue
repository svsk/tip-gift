<script setup lang="ts">
interface Props {
    noteId: string;
    readonly?: boolean;
}

const props = defineProps<Props>();
const noteStore = useWishPurchaseNotes();

const showDeleteConfirmation = ref(false);
const busy = ref(false);

const handleDeleteRequested = () => {
    showDeleteConfirmation.value = true;
};

const handleDeleteConfirmed = async () => {
    try {
        busy.value = true;
        await noteStore.deleteWishPurchaseNote(props.noteId);
        showDeleteConfirmation.value = false;
    } finally {
        busy.value = false;
    }
};
</script>

<template>
    <div>
        <Button :disable="readonly" color="bg-red-500 w-full" @click="handleDeleteRequested">
            <Localized tkey="Delete" />
        </Button>

        <Dialog v-model="showDeleteConfirmation" :persistent="busy">
            <template #title> <Localized tkey="DeleteWishPurchaseNote" />? </template>

            <Localized tkey="DeleteWishPurchaseNoteConfirmation" />

            <div class="flex items-center justify-end gap-4 pt-3">
                <Button :disable="busy" flat @click="showDeleteConfirmation = false">
                    <Localized tkey="Cancel" />
                </Button>
                <Button :disable="busy" color="bg-red-500" @click="handleDeleteConfirmed">
                    <Localized tkey="Delete" />
                </Button>
            </div>
        </Dialog>
    </div>
</template>
