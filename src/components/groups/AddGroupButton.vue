<script lang="ts" setup>
import { WishUserGroup } from '.prisma/client';

const showDialog = ref(false);
const groupName = ref('');
const { refresh } = await useGroups();

const handleClose = async (confirm: boolean) => {
    showDialog.value = false;

    if (confirm) {
        const grp = { GroupName: groupName.value } as WishUserGroup;
        await addGroup(grp);
        refresh();
    }
};
</script>

<template>
    <Button @click="() => (showDialog = true)">Add Group</Button>

    <Dialog v-model="showDialog">
        <template #title> Add Group </template>
        <div class="flex flex-col gap-6 flex-nowrap">
            <Input v-model="groupName" label="Group Name" class="w-full" />
            <div class="flex justify-end">
                <Button @click="() => handleClose(true)">Confirm</Button>
            </div>
        </div>
    </Dialog>
</template>
