<script setup lang="ts">
import { type WishUser, type WishUserGroup } from '@prisma-app/client';

const { data: groups } = await useGroups();

const groupId = useRoute().params.groupId.toString();
const group = computed(() => groups.value?.find((g) => g.Id === groupId));
const currentUserId = useAuth()?.value?.id || '';

const groupMemberId = ref<string | null>(currentUserId);
const collaborationId = ref<string | null>(null);

const showEditDialog = ref(false);
const showAddUserDialog = ref(false);

const canEdit = computed(() => {
    return !!group.value && isGroupAdmin(group.value);
});

const handleGroupEdited = (updatedGroup: WishUserGroup) => {
    updateGroup(updatedGroup);
};

const handleAddUserClicked = () => {
    showAddUserDialog.value = true;
};

const handleUserAdded = (user: WishUser) => {
    addUserToGroup(groupId, user.Id);
    showAddUserDialog.value = false;
};

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
                <Button v-if="canEdit" round @click="() => (showEditDialog = true)">
                    <Icon name="edit" font-size="24px" />
                </Button>
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

            <button
                v-if="canEdit"
                v-ripple
                class="ml-3 relative rounded-full min-h-[42px] min-w-[42px] bg-slate-700 text-white flex items-center justify-center"
                @click="handleAddUserClicked"
            >
                <Icon font-size="24px" name="add" />
            </button>
        </div>

        <GroupMemberWishes v-if="groupMemberId" :group-id="groupId" :group-member-id="groupMemberId" />
        <GroupCollaborationWishes v-if="collaborationId" :group-id="groupId" :collaboration-id="collaborationId" />
    </Card>

    <GroupEditDialog v-model="showEditDialog" :group="group" @confirm="handleGroupEdited" />

    <Dialog v-model="showAddUserDialog">
        <template #title>
            <Localized tkey="InviteUser" />
        </template>

        <AddUserForm :group-id="groupId" @confirm="handleUserAdded" />

        <div class="flex justify-end gap-2 pt-3">
            <Button flat @click="showAddUserDialog = false">
                <Localized tkey="Close" />
            </Button>
        </div>
    </Dialog>
</template>
