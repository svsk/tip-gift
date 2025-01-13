<script setup lang="ts">
const { i18n } = await useI18n();

interface Props {
    groupId: string;
}

interface Emits {
    (event: 'confirmed'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const title = ref('');
const busy = ref(false);
const selectedMemberIds = ref<string[]>([]);
const emoji = ref('🤝');
const colour = ref('#339DD7');

const handleMemberClicked = (memberId: string) => {
    if (selectedMemberIds.value.includes(memberId)) {
        selectedMemberIds.value = selectedMemberIds.value.filter((id) => id !== memberId);
    } else {
        selectedMemberIds.value = [...selectedMemberIds.value, memberId];
    }
};

const handleSubmit = async () => {
    busy.value = true;
    try {
        await createGroupCollaboration(props.groupId, title.value, selectedMemberIds.value, emoji.value, colour.value);
        emit('confirmed');
    } finally {
        busy.value = false;
    }
};

const required = (v: string) => !!v || i18n('Required');
</script>

<template>
    <Form class="flex flex-col gap-4" @submit="handleSubmit">
        <div class="flex gap-2 items-center">
            <EmojiAvatar :color="colour" class="cursor-pointer">
                {{ emoji }}
                <Menu class="drop-shadow-lg">
                    <Card class="flex gap-2 items-center">
                        <EmojiPickerButton v-model="emoji" />
                        <ColorPicker v-model="colour" />
                    </Card>
                </Menu>
            </EmojiAvatar>

            <Input v-model="title" :label="i18n('Title')" autofocus :rules="[required]" />
        </div>

        <div>
            <label class="block mb-2">
                <Localized tkey="CollaborateWithWho" />
            </label>
            <div class="overflow-x-auto flex items-center gap-2">
                <GroupMembers
                    :selected-member-ids="selectedMemberIds"
                    :group-id="groupId"
                    exclude-self
                    class="flex gap-2 items-center"
                    @update:selected-member-id="handleMemberClicked"
                />
            </div>
        </div>

        <slot name="actions" />
    </Form>
</template>
