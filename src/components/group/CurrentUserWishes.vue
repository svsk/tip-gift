<script setup lang="ts">
import { type Wish } from '@prisma-app/client';

interface Props {
    groupId: string;
    collaborationId?: string;
}

const props = defineProps<Props>();

const busy = ref(false);

const { data: wishes } = await useWishes();
const { data: groupWishes } = await useGroupWishes(props.groupId);

const wishShared = (wish: Wish) => {
    return groupWishes.value?.find(
        (gw) => gw.Id === wish.Id && gw.Shares.some((s) => s.WishGroupCollaborationId == props.collaborationId)
    );
};

const handleShareClicked = async (wish: Wish) => {
    busy.value = true;
    try {
        await addWishToGroup(wish.Id, props.groupId, props.collaborationId);
    } finally {
        busy.value = false;
    }
};

const handleHideClicked = async (wish: Wish) => {
    const wishShareId = groupWishes.value
        ?.find((gw) => gw.Id === wish.Id)
        ?.Shares.find((s) => s.WishGroupCollaborationId == props.collaborationId)?.Id;

    if (!wishShareId) {
        console.warn('Wish share not found');
        return;
    }

    busy.value = true;
    try {
        await removeWishFromGroup(wishShareId, props.groupId);
    } finally {
        busy.value = false;
    }
};
</script>

<template>
    <ListItem v-for="wish in wishes" :key="wish.Id">
        <WishListItem :class="{ 'grow transition-opacity': true, 'opacity-40': !wishShared(wish) }" :entry="wish" />

        <Button :disable="busy" round v-if="!wishShared(wish)" @click="() => handleShareClicked(wish)">
            <Icon font-size="24px" name="visibility_off" />
        </Button>

        <Button :disable="busy" round v-else @click="() => handleHideClicked(wish)">
            <Icon font-size="24px" name="visibility" />
        </Button>
    </ListItem>
</template>
