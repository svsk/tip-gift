<script lang="ts" setup>
import { type WishUserGroup } from '@prisma-app/client';

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
    <Button @click="handleAddGroupClicked" class="whitespace-nowrap">
        <Localized tkey="AddGroup" />
    </Button>
    <EditGroupDialog v-model="showDialog" @confirm="handleConfirm" />
</template>
