<script lang="ts" setup>
import { WishUserGroup } from '.prisma/client';

const { data: groups } = await useGroups();

const handleDeleteGroup = async (group: WishUserGroup) => {
    await deleteGroup(group);
};
</script>

<template>
    <div class="flex flex-col">
        <EmptyState v-if="!groups?.length" class="text-center text-base flex flex-col gap-2">
            No groups created or joined yet...
        </EmptyState>

        <div
            v-for="group in groups"
            :key="group.Id"
            class="py-2 flex justify-between items-center border-slate-600 border-b last:border-b-0"
        >
            <NuxtLink :to="`/my/group/${group.Id}`" class="flex items-center gap-2 flex-nowrap">
                <EmojiAvatar />

                <div>
                    <div>
                        {{ group.GroupName }}
                    </div>
                    <div class="text-xs opacity-60">14 members • Owned by Sverre S.</div>
                </div>
            </NuxtLink>

            <Button round @click="handleDeleteGroup(group)">
                <Icon font-size="20px" name="delete" />
            </Button>
        </div>
    </div>
</template>
