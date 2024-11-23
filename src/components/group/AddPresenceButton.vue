<script setup lang="ts">
import { type WishUser } from '@prisma-app/client';

interface Props {
    groupId: string;
}

const props = defineProps<Props>();

const groups = await useGroups();

const group = computed(() => groups.value?.find((g) => g.Id === props.groupId));

const showAddUserDialog = ref(false);

const canEdit = computed(() => isGroupAdmin(group.value));

const handleAddUserClicked = () => {
    showAddUserDialog.value = true;
};

const handleUserAdded = (user: WishUser) => {
    addUserToGroup(props.groupId, user.Id);
    showAddUserDialog.value = false;
};
</script>

<template>
    <div>
        <button
            v-if="canEdit"
            v-ripple
            class="ml-3 relative rounded-full min-h-[42px] min-w-[42px] bg-slate-700 text-white flex items-center justify-center"
            @click="handleAddUserClicked"
        >
            <Icon font-size="24px" name="add" />
        </button>

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
    </div>
</template>
