<script lang="ts" setup>
import { WishUserGroup } from '.prisma/client';

const cookie = useRequestHeaders(['cookie']).cookie || '';
const { data: groups, refresh } = await useFetch('/api/groups/getall', { headers: { cookie } });

const handleDeleteGroup = async (group: WishUserGroup) => {
    await deleteGroup(group);
};
</script>

<template>
    <Button @click="refresh">Refresh</Button>

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
