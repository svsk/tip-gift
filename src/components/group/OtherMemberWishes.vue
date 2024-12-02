<script setup lang="ts">
import { type Wish } from '@prisma-app/client';
import type { WishWithShareRefs } from '~/prisma/customTypes';

interface Props {
    groupId: string;
    groupMemberId?: string;
    collaborationId?: string;
    showGivers: boolean;
}

const props = defineProps<Props>();

const { data: groupWishes } = await useGroupWishes(props.groupId);

const boughtItem = ref<Wish | null>(null);
const showBoughtItemDialog = ref<boolean>(false);

const currentUserLastVisit = computed(() => {
    return new Date();
});

const ownedByGroupMember = (wish: WishWithShareRefs, groupMemberId?: string) => {
    if (!groupMemberId) {
        return false;
    }

    return wish.UserId === groupMemberId && wish.Shares.some((s) => !s.WishGroupCollaborationId);
};

const partOfCollaboration = (wish: WishWithShareRefs, collaborationId?: string) => {
    if (!collaborationId) {
        return false;
    }

    return wish.Shares.some((s) => s.WishGroupCollaborationId === collaborationId);
};

const groupMemberWishes = computed(() => {
    return groupWishes.value
        ?.filter((gw) => ownedByGroupMember(gw, props.groupMemberId) || partOfCollaboration(gw, props.collaborationId))
        .sort((a, b) => (a.Order || 0) - (b.Order || 1));
});

const handleBuyClicked = (wish: Wish) => {
    boughtItem.value = wish;
    showBoughtItemDialog.value = true;
};
</script>

<template>
    <EmptyState v-if="!groupMemberWishes?.length" class="text-center">
        <Localized tkey="NoSharedWishesInfoText" />
    </EmptyState>

    <div v-else class="flex flex-col gap-2">
        <ListItem v-for="wish in groupMemberWishes" :key="wish.Id">
            <WishListItem :class="{ grow: true }" :entry="wish">
                <template #indicator>
                    <WishNewBadge
                        class="absolute top-1 left-0 z-20"
                        :created-date="wish.CreatedDate"
                        :last-visit-date="currentUserLastVisit"
                    />
                </template>
            </WishListItem>

            <div v-if="showGivers" class="flex no-wrap items-center">
                <WishPurchaseIndicators :group-id="groupId" :wish-id="wish.Id" />
                <Button round @click="() => handleBuyClicked(wish)">
                    <Icon font-size="24px" name="shopping_cart" />
                </Button>
            </div>
        </ListItem>
    </div>

    <Dialog v-model="showBoughtItemDialog">
        <BoughtItemForm
            v-if="boughtItem"
            :item="boughtItem"
            :group-id="groupId"
            @close="(_) => (showBoughtItemDialog = false)"
        />
    </Dialog>
</template>
