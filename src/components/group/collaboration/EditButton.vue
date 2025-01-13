<script setup lang="ts">
interface Props {
    groupId: string;
    collaborationId: string;
}

const props = defineProps<Props>();

const collaborations = await getGroupCollaborations(props.groupId);
const { i18n } = await useI18n();

const showEditDialog = ref(false);
const canEdit = computed(() => true);
const busy = ref(false);

const editModel = reactive({
    Id: '',
    WishUserGroupId: '',
    Title: '',
    AvatarEmoji: '',
    AvatarColour: '',
});

const handleEditClicked = () => {
    const collaboration = collaborations.value.find((c) => c.Id === props.collaborationId);
    if (!collaboration) {
        return;
    }

    editModel.Id = collaboration.Id;
    editModel.WishUserGroupId = collaboration.WishUserGroupId;
    editModel.Title = collaboration.Title || '';
    editModel.AvatarEmoji = collaboration.AvatarEmoji || '🤝';
    editModel.AvatarColour = collaboration.AvatarColour || '#339DD7';

    showEditDialog.value = true;
};

const handleEditConfirmed = async () => {
    try {
        busy.value = true;
        updateGroupCollaboration(editModel);
        showEditDialog.value = false;
    } finally {
        busy.value = false;
    }
};

const required = (v: string) => !!v || i18n('Required');
</script>

<template>
    <div>
        <Button v-if="canEdit" @click="handleEditClicked">
            <Localized tkey="Edit" />
        </Button>

        <Dialog v-model="showEditDialog">
            <template #title> <Localized tkey="EditCollaboration" /> </template>

            <Form @submit="handleEditConfirmed">
                <div class="flex gap-2 items-center">
                    <EmojiAvatar :color="editModel.AvatarColour" class="cursor-pointer">
                        {{ editModel.AvatarEmoji }}
                        <Menu class="drop-shadow-lg">
                            <Card class="flex gap-2 items-center">
                                <EmojiPickerButton v-model="editModel.AvatarEmoji" />
                                <ColorPicker v-model="editModel.AvatarColour" />
                            </Card>
                        </Menu>
                    </EmojiAvatar>

                    <Input v-model="editModel.Title" :label="i18n('Title')" autofocus :rules="[required]" />
                </div>

                <div class="flex items-center gap-2 justify-end pt-5">
                    <Button :disable="busy" flat @click="showEditDialog = false">
                        <Localized tkey="Cancel" />
                    </Button>
                    <Button :disable="busy" type="submit">
                        <Localized tkey="Confirm" />
                    </Button>
                </div>
            </Form>
        </Dialog>
    </div>
</template>
