<script setup lang="ts">
interface Props {
    groupId: string;
    collaborationId: string;
}

const props = defineProps<Props>();

const showConfirmation = ref(false);
const busy = ref(false);

const collaborations = await getGroupCollaborations(props.groupId);

const collaboration = computed(() => {
    return collaborations.value?.find((c) => c.Id === props.collaborationId);
});

const canDelete = computed(() => canManageCollaboration(collaboration.value));

const handleClick = () => {
    showConfirmation.value = true;
};

const handleDeleteConfirmed = async () => {
    try {
        busy.value = true;
        await deleteGroupCollaboration(props.groupId, props.collaborationId);
        showConfirmation.value = false;
    } finally {
        busy.value = false;
    }
};
</script>

<template>
    <div>
        <Button v-if="canDelete" color="bg-red-500" @click="handleClick">
            <Localized tkey="Delete" />
        </Button>

        <Dialog v-model="showConfirmation">
            <template #title> <Localized tkey="DeleteCollaboration" />? </template>

            <Localized tkey="ConfirmDeleteCollaboration" />

            <div class="flex items-center gap-2 justify-end pt-5">
                <Button :disable="busy" flat @click="showConfirmation = false">
                    <Localized tkey="Cancel" />
                </Button>
                <Button :disable="busy" color="bg-red-500" @click="handleDeleteConfirmed">
                    <Localized tkey="Delete" />
                </Button>
            </div>
        </Dialog>
    </div>
</template>
