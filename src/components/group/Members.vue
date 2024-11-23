<script setup lang="ts">
interface Props {
    groupId: string;
    selectedMemberId: string | null;
}

const props = defineProps<Props>();

const { data: members } = await useGroupUsers(props.groupId);

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
            :selected="selectedMemberId === member.UserId"
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
