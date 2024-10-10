<script setup lang="ts">
import { type Wish } from '@prisma-app/client';

interface Props {
    groupId: string;
}

const props = defineProps<Props>();

const { data: currentUserWishes } = await useWishes();
const { data: groupWishes } = await useGroupWishes(props.groupId);

const wishSharedWithGroup = (wish: Wish) => {
    return groupWishes.value?.some((gw) => gw.Id === wish.Id);
};

const handleAddWishToGroup = async (wish: Wish) => {
    await addWishToGroup(wish.Id, props.groupId);
};

const handleRemoveWishFromGroup = async (wish: Wish) => {
    await removeWishFromGroup(wish.Id, props.groupId);
};
</script>

<template>
    <ListItem v-for="wish in currentUserWishes" :key="wish.Id">
        <WishListItem
            :class="{ 'grow transition-opacity': true, 'opacity-40': !wishSharedWithGroup(wish) }"
            :entry="wish"
        />

        <Button round v-if="!wishSharedWithGroup(wish)" @click="() => handleAddWishToGroup(wish)">
            <Icon font-size="24px" name="visibility_off" />
        </Button>

        <Button round v-else @click="() => handleRemoveWishFromGroup(wish)">
            <Icon font-size="24px" name="visibility" />
        </Button>
    </ListItem>
</template>
