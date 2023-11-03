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

const canEdit = isGroupAdmin(() => group.value);
</script>

<template>
    <Card class="flex flex-col gap-4">
        <div class="w-full flex justify-between items-center gap-4">
            <div class="flex justify-between items-center gap-2">
                <NuxtLink to="/my/groups">
                    <Button round>
                        <Icon font-size="24px" name="arrow_back" />
                    </Button>
                </NuxtLink>
                <h1 class="font-medium text-lg">{{ group?.GroupName }}</h1>
            </div>

            <!-- Buttons go here -->
            <Button v-if="canEdit" round @click="() => (showEditDialog = true)">
                <Icon name="edit" font-size="24px" />
            </Button>
        </div>

        <div class="text-sm opacity-60">
            Click on members of the group to view their shared wishes. Click on yourself to manage what wishes to show
            to other members of the group.
        </div>

        <div class="h-[1px] bg-slate-600 w-full" />

        <div class="overflow-x-auto">
            <GroupMembers v-model:selectedMemberId="groupMemberId" :group-id="groupId" />
        </div>
        <GroupMemberWishes :group-id="groupId.toString()" :group-member-id="groupMemberId" />
    </Card>

    <EditGroupDialog v-model="showEditDialog" :group="group" @confirm="handleGroupEdited" />
</template>
