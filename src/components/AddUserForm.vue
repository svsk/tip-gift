<script setup lang="ts">
import { type WishUser } from '@prisma-app/client';

interface Props {
    groupId: string;
}

const props = defineProps<Props>();

const { data: groupUsers } = await useGroupUsers(props.groupId);

const emit = defineEmits(['confirm', 'cancel']);

const selectedUser = ref<WishUser | null>(null);

const handleSubmit = (confirm: boolean) => {
    if (confirm) {
        emit('confirm', selectedUser.value);
    } else {
        emit('cancel');
    }
};

const mustHaveSelectedUser = () => {
    if (!selectedUser.value) {
        return i18n('Required');
    }

    return true;
};

const mustNotAlreadyBeInGroup = () => {
    if (groupUsers.value?.some((gu) => gu.UserId === selectedUser.value?.Id)) {
        return 'Already a member';
    }

    return true;
};
</script>

<template>
    <Form @submit="() => handleSubmit(true)" class="flex flex-col gap-6 flex-nowrap">
        <UserLookup :rules="[mustHaveSelectedUser, mustNotAlreadyBeInGroup]" class="w-full" v-model="selectedUser" />

        <div class="flex justify-end gap-2">
            <Button flat @click="() => handleSubmit(false)">
                <Localized tkey="Cancel" />
            </Button>
            <Button type="submit">
                <Localized tkey="Confirm" />
            </Button>
        </div>
    </Form>
</template>
