<script setup lang="ts">
import { type WishUserGroup } from '@prisma-app/client';
import { getGroupByInviteCode } from '~/composables/useGroups';

const { inviteCode } = useRoute().params;
const group = ref<WishUserGroup | null>(null);
const busyJoining = ref(false);
const currentUser = await useCurrentUser();

if (typeof inviteCode === 'string') {
    group.value = await getGroupByInviteCode(inviteCode);
}

const handleJoinClicked = async () => {
    const userId = currentUser?.value?.Id;

    if (!group.value || !userId) {
        return;
    }

    try {
        busyJoining.value = true;
        await addUserToGroup(group.value.Id, userId);
        await useRouter().push('/');
    } finally {
        busyJoining.value = false;
    }
};
</script>

<template>
    <Card v-if="group" class="flex flex-col items-center gap-4 py-12">
        <div>
            <GroupAvatar :group="group" style="height: 80px; width: 80px; font-size: 40px" />
        </div>

        <div class="text-center">
            <GroupListItem :group="group" />
        </div>

        <Button :disable="busyJoining" @click="handleJoinClicked">
            <Localized tkey="Join" />
        </Button>
    </Card>
</template>
