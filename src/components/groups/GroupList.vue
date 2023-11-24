<script lang="ts" setup>
import { type WishUserGroup } from '@prisma-app/client';

const { data: groups } = await useGroups();

const deletingGroup = ref<WishUserGroup | null>(null);

const handleDeleteGroup = async (group: WishUserGroup) => {
    deletingGroup.value = group;
};

const handleDeleteConfirmed = async () => {
    if (!deletingGroup.value) return;

    await deleteGroup(deletingGroup.value);
    deletingGroup.value = null;
};
</script>

<template>
    <div class="flex flex-col">
        <EmptyState v-if="!groups?.length" class="text-center text-base flex flex-col gap-2">
            <Localized tkey="NoGroupsYet" />...
        </EmptyState>

        <div
            v-for="group in groups"
            :key="group.Id"
            class="py-2 flex justify-between items-center border-slate-600 border-b last:border-b-0"
        >
            <NuxtLink :to="`/my/group/${group.Id}`" class="flex items-center gap-2 flex-nowrap">
                <GroupsGroupAvatar :group="group" />
                <GroupsGroupListItem :group="group" />
            </NuxtLink>

            <Button v-if="isGroupAdmin(() => group)" round @click="handleDeleteGroup(group)">
                <Icon font-size="20px" name="delete" />
            </Button>
        </div>

        <Dialog :model-value="!!deletingGroup">
            <template #title> <Localized tkey="DeleteGroup" />? </template>

            <div class="flex flex-col gap-4">
                {{ i18n('GroupDeleteConfirmation', deletingGroup!.GroupName) }}

                <div class="flex justify-end items-center gap-2">
                    <Button @click="() => (deletingGroup = null)" flat>
                        <Localized tkey="Cancel" />
                    </Button>
                    <Button color="bg-red-500" @click="handleDeleteConfirmed">
                        <Localized tkey="Delete" />
                    </Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>
