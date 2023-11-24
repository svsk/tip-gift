<script setup lang="ts">
import { type WishUserGroup } from '@prisma-app/client';

interface Props {
    modelValue: boolean;
    group?: WishUserGroup;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'confirm']);

const showDialog = ref(props.modelValue);
const group = ref<Partial<WishUserGroup>>(props.group ? { ...props.group } : {});

watch(
    () => props.modelValue,
    () => (showDialog.value = props.modelValue)
);

watch(
    () => props.group,
    () => (group.value = props.group ? { ...props.group } : group.value)
);

const handleDialogChange = (open: boolean) => {
    emit('update:modelValue', open);
};

const handleSubmit = (confirm: boolean) => {
    if (confirm) {
        emit('confirm', group.value);
    }

    emit('update:modelValue', false);
    group.value = {};
};
</script>

<template>
    <Dialog v-model="showDialog" @update:model-value="handleDialogChange">
        <template #title>
            <Localized v-if="!!group.Id" tkey="EditGroup" />
            <Localized v-else tkey="AddGroup" />
        </template>

        <form @submit.prevent="() => handleSubmit(true)" class="flex flex-col gap-6 flex-nowrap">
            <div class="flex flex-nowrap gap-2 items-center">
                <GroupsGroupAvatar :group="group" />
                <Input ref="input" v-model="group.GroupName" :label="i18n('GroupName')" class="w-full" />
            </div>
            <div class="flex flex-nowrap gap-2 items-center">
                <ColorPicker v-model="group.AvatarColour" />
                <EmojiPicker v-model="group.AvatarEmoji" />
            </div>

            <div class="flex justify-end gap-2">
                <Button flat @click="() => handleSubmit(false)">
                    <Localized tkey="Cancel" />
                </Button>
                <Button type="submit">
                    <Localized tkey="Confirm" />
                </Button>
            </div>
        </form>
    </Dialog>
</template>
