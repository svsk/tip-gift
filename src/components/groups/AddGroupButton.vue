<script lang="ts" setup>
import { WishUserGroup } from '@prisma/client';

const showDialog = ref(false);
const groupName = ref('');
const input = ref<any>(null);

const handleAddGroupClicked = async () => {
    groupName.value = '';
    showDialog.value = true;
    await nextTick();
    input.value?.focus();
};

const handleConfirm = async (grp: WishUserGroup) => {
    showDialog.value = false;
    await addGroup(grp);
};
</script>

<template>
    <Button @click="handleAddGroupClicked" class="whitespace-nowrap">Add Group</Button>
    <EditGroupDialog v-model="showDialog" @confirm="handleConfirm" />
</template>
