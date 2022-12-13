<script lang="ts" setup>
import { WishUserGroup } from '.prisma/client';

const { data: groups } = await useGroups();

const handleDeleteGroup = async (group: WishUserGroup) => {
    await deleteGroup(group);
};
</script>

<template>
    <div class="flex flex-col">
        <EmptyState v-if="!groups?.length"> Nothing here yet... </EmptyState>

        <div v-for="group in groups" :key="group.Id" class="py-2 flex justify-between items-center">
            <NuxtLink :to="`/my/group/${group.Id}`">
                {{ group.GroupName }}
            </NuxtLink>
            <div>
                <Button round @click="handleDeleteGroup(group)"> 🗑️ </Button>
            </div>
        </div>
    </div>
</template>
