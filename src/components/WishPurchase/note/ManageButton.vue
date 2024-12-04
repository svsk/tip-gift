<script setup lang="ts">
interface Props {
    wishPurchaseId: string;
}

const props = defineProps<Props>();

const noteStore = useWishPurchaseNotes();
const { i18n } = await useI18n();

const showManageDialog = ref(false);
const noteText = ref('');
const selectedNoteId = ref<string | null>(null);
const busy = ref(false);

const handleNoteAdded = async () => {
    try {
        busy.value = true;
        await noteStore.addWishPurchaseNote(props.wishPurchaseId, noteText.value);
        noteText.value = '';
    } finally {
        busy.value = false;
    }
};

const handleNoteEdited = async () => {
    try {
        busy.value = true;
        await noteStore.updateWishPurchaseNote(selectedNoteId.value!, noteText.value);
    } finally {
        busy.value = false;
    }
};

watch(
    () => selectedNoteId.value,
    async () => {
        if (selectedNoteId.value) {
            const { data: notes } = await noteStore.getWishPurchaseNotes();
            const note = notes.value?.find((n) => n.Id === selectedNoteId.value);
            if (note) {
                noteText.value = note.Note;
            }
        } else {
            noteText.value = '';
        }
    }
);

const required = (v: string) => !!v || i18n('Required');
const maxWidth = (max: number) => (v: string) => v.length <= max || i18n('MaxLength', max.toString());
</script>

<template>
    <div>
        <Button round flat icon="label" @click="showManageDialog = true" />

        <Dialog v-model="showManageDialog">
            <template #title>
                <Localized tkey="ManageWishPurchaseNotes" />
            </template>

            <div class="flex flex-col gap-3">
                <Localized tkey="WishPurchaseNotesExplanation" />

                <div class="p-4 rounded border border-gray-600 overflow-y-auto max-h-[60vh]">
                    <WishPurchaseNoteBadges
                        :wish-purchase-id="props.wishPurchaseId"
                        v-model:selected-note-id="selectedNoteId"
                        selectable
                        class="flex flex-wrap gap-2"
                    >
                        <template #empty-state>
                            <div class="w-full text-center">
                                <Localized class="text-gray-400 italic" tkey="NoNotesAdded" />
                            </div>
                        </template>
                    </WishPurchaseNoteBadges>
                </div>

                <Form class="flex flex-col gap-2" @submit="selectedNoteId ? handleNoteEdited() : handleNoteAdded()">
                    <Input
                        v-model="noteText"
                        :readonly="busy"
                        :label="selectedNoteId ? i18n('EditNote') : i18n('NewNote')"
                        :rules="[required, maxWidth(150)]"
                    />

                    <div class="flex gap-2">
                        <div class="flex-grow">
                            <WishPurchaseNoteDeleteButton
                                :readonly="busy"
                                v-if="selectedNoteId"
                                :note-id="selectedNoteId"
                            />
                        </div>
                        <Button :disable="busy" type="submit" class="flex-grow whitespace-nowrap">
                            <Localized v-if="selectedNoteId" tkey="Update" />
                            <Localized v-else tkey="AddNew" />
                        </Button>
                    </div>
                </Form>

                <div class="flex items-center justify-end">
                    <Button flat @click="showManageDialog = false"> <Localized tkey="Close" /> </Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>
