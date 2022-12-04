<script lang="ts" setup>
import { WishUserGroup } from '.prisma/client';

const showDialog = ref(false);
const groupName = ref('');
const input = ref<any>(null);

const handleAddGroupClicked = async () => {
    groupName.value = '';
    showDialog.value = true;
    await nextTick();
    input.value?.focus();
};

const handleClose = async (confirm: boolean) => {
    showDialog.value = false;

    if (confirm) {
        const grp = { GroupName: groupName.value } as WishUserGroup;
        await addGroup(grp);
    }
};
</script>

<template>
    <Button @click="handleAddGroupClicked">Add Group</Button>

    <Dialog v-model="showDialog">
        <template #title> Add Group </template>

        <form @submit.prevent="() => handleClose(true)" class="flex flex-col gap-6 flex-nowrap">
            <Input ref="input" v-model="groupName" label="Group Name" class="w-full" />

            <div class="flex justify-end gap-2">
                <Button flat @click="() => handleClose(false)">Cancel</Button>
                <Button type="submit">Confirm</Button>
            </div>
        </form>
    </Dialog>
</template>
