<script setup lang="ts">
import { Wish } from '@prisma/client';

interface Props {
    groupId: string;
    groupMemberId: string;
}

const props = defineProps<Props>();

const { data: groupWishes } = await useGroupWishes(props.groupId);
const { data: currentUserWishes } = await useWishes();

const currentUserId = useAuth()?.value?.id;

const wishSharedWithGroup = (wish: Wish) => {
    return groupWishes.value?.some((gw) => gw.Id === wish.Id);
};

const handleAddWishToGroup = async (wish: Wish) => {
    await addWishToGroup(wish.Id, props.groupId);
};

const handleRemoveWishFromGroup = async (wish: Wish) => {
    await removeWishFromGroup(wish.Id, props.groupId);
};

const groupMemberWishes = computed(() => {
    return groupWishes.value?.filter((gw) => gw.UserId === props.groupMemberId);
});
</script>

<template>
    <div>
        <div class="flex flex-col">
            <div v-if="groupMemberId === currentUserId">
                <div
                    v-for="wish in currentUserWishes"
                    :key="wish.Id"
                    class="flex items-center justify-between border-b border-1 border-slate-600 last:border-0 py-3 gap-4 w-full overflow-hidden"
                >
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
                </div>
            </div>
            <div v-else>
                <EmptyState v-if="!groupMemberWishes?.length" class="text-center">
                    This person hasn't shared any wishes with this group yet.
                </EmptyState>
                <span v-else>
                    <div
                        v-for="wish in groupMemberWishes"
                        :key="wish.Id"
                        class="flex items-center justify-between border-b border-1 border-slate-600 last:border-0 py-3 gap-4 w-full overflow-hidden"
                    >
                        <WishListItem :class="{ grow: true }" :entry="wish" />
                    </div>
                </span>
            </div>
        </div>
    </div>
</template>
