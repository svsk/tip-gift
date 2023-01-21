<script setup lang="ts">
import { WishUserGroup } from '.prisma/client';

interface Props {
    group: WishUserGroup;
}

const props = defineProps<Props>();

const { data: groupMembers } = await useGroupUsers(props.group.Id);

const memberCount = computed(() => {
    return groupMembers.value?.length || 0;
});
</script>

<template>
    <div>
        <div>
            {{ group.GroupName }}
        </div>
        <div class="text-xs opacity-60">
            <span v-if="memberCount">{{ memberCount }} member{{ memberCount !== 1 ? 's' : '' }} • </span>
            <span v-if="group.CreatedByUserId">Owned by <User without-avatar :user-id="group.CreatedByUserId" /></span>
        </div>
    </div>
</template>
