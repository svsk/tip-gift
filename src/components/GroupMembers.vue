<script setup lang="ts">
interface Props {
    groupId: string;
    selectedMemberId: string;
}

const props = defineProps<Props>();

const { data: members } = await useGroupUsers(props.groupId);

const emit = defineEmits(['update:selectedMemberId']);

const handleMemberClicked = (userId: string) => {
    emit('update:selectedMemberId', userId);
};
</script>

<template>
    <div class="flex gap-4">
        <button
            v-for="member in members"
            :key="member.Id"
            @click="() => handleMemberClicked(member.UserId)"
            :class="{
                'flex items-center justify-center p-4 flex-col gap-2 rounded w-[90px]': true,
                'bg-gray-600': selectedMemberId === member.UserId,
            }"
        >
            <User
                class="flex flex-col items-center justify-center gap-1 text-sm font-semibold tracking-wide"
                :user-id="member.UserId"
            />
        </button>
    </div>
</template>
