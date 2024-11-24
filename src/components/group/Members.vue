<script setup lang="ts">
interface Props {
    groupId: string;
    excludeSelf?: boolean;
    selectedMemberId?: string | null;
    selectedMemberIds?: string[] | null;
}

const props = defineProps<Props>();

const self = useAuth();

const groupUserResult = await useGroupUsers(props.groupId);

const members = computed(() => {
    const groupUsers = groupUserResult?.data?.value || [];
    return props.excludeSelf ? groupUsers.filter((user) => user.UserId !== self.value?.id) : groupUsers;
});

const emit = defineEmits(['update:selectedMemberId']);

const handleMemberClicked = (userId: string) => {
    emit('update:selectedMemberId', userId);
};
</script>

<template>
    <div>
        <SelectionButton
            v-for="member in members"
            :key="member.Id"
            :selected="selectedMemberId === member.UserId || selectedMemberIds?.includes(member.UserId)"
            @click="() => handleMemberClicked(member.UserId)"
        >
            <template #avatar>
                <User :user-id="member.UserId" without-username />
            </template>

            <template #label>
                <User :user-id="member.UserId" without-avatar />
            </template>
        </SelectionButton>
    </div>
</template>
