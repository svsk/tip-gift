<script setup lang="ts">
import { WishUserGroup } from '@prisma/client';

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
        <template #title> {{ !!group.Id ? 'Edit' : 'Add' }} Group </template>

        <form @submit.prevent="() => handleSubmit(true)" class="flex flex-col gap-6 flex-nowrap">
            <Input ref="input" v-model="group.GroupName" label="Group Name" class="w-full" />

            <div class="flex justify-end gap-2">
                <Button flat @click="() => handleSubmit(false)">Cancel</Button>
                <Button type="submit">Confirm</Button>
            </div>
        </form>
    </Dialog>
</template>
