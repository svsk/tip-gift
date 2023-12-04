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

const handleAdd = async (grp: Partial<WishUserGroup>) => {
    showDialog.value = false;
    await addGroup(grp);
};
</script>

<template>
    <slot :handleAddClicked="handleAddGroupClicked">
        <Button @click="handleAddGroupClicked" class="whitespace-nowrap">
            <Localized tkey="AddGroup" />
        </Button>
    </slot>

    <GroupJoinOrCreateDialog v-model="showDialog" @add="handleAdd" />
</template>
