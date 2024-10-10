<script setup lang="ts">
import { type WishUserGroup } from '@prisma-app/client';

const { data: groups } = await useGroups();

const groupId = useRoute().params.groupId.toString();
const group = computed(() => groups.value?.find((g) => g.Id === groupId));
const currentUserId = useAuth()?.value?.id || '';

const groupMemberId = ref<string>(currentUserId);
const showEditDialog = ref(false);

const handleGroupEdited = (updatedGroup: WishUserGroup) => {
    updateGroup(updatedGroup);
};

const canEdit = computed(() => {
    return !!group.value && isGroupAdmin(group.value);
});
</script>

<template>
    <Card class="flex flex-col gap-4">
        <PageHeader back-to="/my/groups">
            <div class="flex gap-3 items-center">
                <GroupAvatar v-if="group" :group="group" />
                {{ group?.GroupName }}
            </div>

            <template #side>
                <!-- Buttons go here -->
                <Button v-if="canEdit" round @click="() => (showEditDialog = true)">
                    <Icon name="edit" font-size="24px" />
                </Button>
            </template>
        </PageHeader>

        <div class="text-sm opacity-60">
            <Localized tkey="GroupWishesExplanation" />
        </div>

        <div class="h-[1px] bg-slate-600 w-full" />

        <div class="overflow-x-auto">
            <GroupMembers v-model:selectedMemberId="groupMemberId" :group-id="groupId" />
        </div>
        <GroupMemberWishes :group-id="groupId.toString()" :group-member-id="groupMemberId" />
    </Card>

    <GroupEditDialog v-model="showEditDialog" :group="group" @confirm="handleGroupEdited" />
</template>
