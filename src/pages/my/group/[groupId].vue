<script setup lang="ts">
import { type WishUserGroup } from '@prisma-app/client';

const { data: groups } = await useGroups();

const groupId = useRoute().params.groupId.toString();
const group = computed(() => groups.value?.find((g) => g.Id === groupId));
const currentUserId = useAuth()?.value?.id || '';

const groupMemberId = ref<string | null>(currentUserId);
const collaborationId = ref<string | null>(null);

const showEditDialog = ref(false);

const canEdit = computed(() => isGroupAdmin(group.value));

const handleGroupEdited = (updatedGroup: WishUserGroup) => updateGroup(updatedGroup);

watch(
    () => groupMemberId.value,
    () => {
        if (groupMemberId.value) {
            collaborationId.value = null;
        }
    }
);

watch(
    () => collaborationId.value,
    () => {
        if (collaborationId.value) {
            groupMemberId.value = null;
        }
    }
);
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
                <div class="flex gap-3 items-center">
                    <Button v-if="canEdit" round @click="() => (showEditDialog = true)">
                        <Icon name="edit" font-size="24px" />
                    </Button>
                    <GroupLeaveButton :group-id="groupId" />
                </div>
            </template>
        </PageHeader>

        <div class="text-sm opacity-60">
            <Localized tkey="GroupWishesExplanation" />
        </div>

        <div class="h-[1px] bg-slate-600 w-full" />

        <div class="overflow-x-auto flex items-center gap-2">
            <GroupMembers
                v-model:selectedMemberId="groupMemberId"
                :group-id="groupId"
                class="flex gap-2 items-center"
            />

            <GroupCollaborationList
                v-model:selectedCollaborationId="collaborationId"
                :group-id="groupId"
                class="flex gap-2 items-center"
            />

            <GroupAddPresenceButton :group-id="groupId" />
        </div>

        <GroupMemberWishes
            v-if="groupMemberId"
            :key="groupMemberId"
            :group-id="groupId"
            :group-member-id="groupMemberId"
        />
        <GroupCollaborationWishes
            v-if="collaborationId"
            :key="collaborationId"
            :group-id="groupId"
            :collaboration-id="collaborationId"
        />
    </Card>

    <GroupEditDialog v-model="showEditDialog" :group="group" @confirm="handleGroupEdited" />
</template>
