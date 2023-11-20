<script setup lang="ts">
import { type WishUserGroup } from '@prisma-app/client';

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
            <span v-if="memberCount"
                >{{ memberCount }}
                <Localized lowercase v-if="memberCount === 1" tkey="Member" />
                <Localized lowercase v-else tkey="Members" /> •
            </span>
            <span v-if="group.CreatedByUserId">
                <Localized tkey="OwnedBy" /> <User without-avatar :user-id="group.CreatedByUserId"
            /></span>
        </div>
    </div>
</template>
