<script setup lang="ts">
import { type WishUser } from '@prisma-app/client';

interface Props {
    groupId: string;
    selectedMemberId: string;
}

const props = defineProps<Props>();

const showAddUserDialog = ref(false);

const { data: members } = await useGroupUsers(props.groupId);
const { data: groups } = await useGroups();

const emit = defineEmits(['update:selectedMemberId']);

const handleMemberClicked = (userId: string) => {
    emit('update:selectedMemberId', userId);
};

const canAdd = computed(() => {
    const group = groups.value?.find((g) => g.Id === props.groupId);
    return !!group && isGroupAdmin(group);
});

const handleAddUserClicked = () => {
    showAddUserDialog.value = true;
};

const handleUserAdded = (user: WishUser) => {
    addUserToGroup(props.groupId, user.Id);
    showAddUserDialog.value = false;
};
</script>

<template>
    <div class="flex gap-2 items-center">
        <button
            v-ripple
            v-for="member in members"
            :key="member.Id"
            @click="() => handleMemberClicked(member.UserId)"
            :class="{
                'relative flex items-center justify-center p-4 flex-col gap-2 rounded min-w-[90px] w-[90px]': true,
                'bg-white bg-opacity-20': selectedMemberId === member.UserId,
            }"
        >
            <User
                class="flex flex-col items-center justify-center gap-1 text-sm font-semibold tracking-wide"
                :user-id="member.UserId"
            />
        </button>

        <button
            v-if="canAdd"
            v-ripple
            @click="handleAddUserClicked"
            class="ml-3 relative rounded-full min-h-[42px] min-w-[42px] bg-slate-700 text-white flex items-center justify-center"
        >
            <Icon font-size="24px" name="add" />
        </button>
    </div>

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
