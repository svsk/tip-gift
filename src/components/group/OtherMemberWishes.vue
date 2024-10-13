<script setup lang="ts">
import { type Wish } from '@prisma-app/client';

interface Props {
    groupId: string;
    groupMemberId: string;
    showGivers: boolean;
}

const props = defineProps<Props>();

const { data: groupWishes } = await useGroupWishes(props.groupId, true);
const { data: givenGifts } = await useGroupWishPurchases(props.groupId, true);

const boughtItem = ref<Wish | null>(null);
const showBoughtItemDialog = ref<boolean>(false);

const currentUserLastVisit = computed(() => {
    return new Date();
});

const groupMemberWishes = computed(() => {
    return groupWishes.value
        ?.filter((gw) => gw.UserId === props.groupMemberId)
        .sort((a, b) => (a.Order || 0) - (b.Order || 1));
});

const handleBuyClicked = (wish: Wish) => {
    boughtItem.value = wish;
    showBoughtItemDialog.value = true;
};

const findGivers = (wish: Wish) => {
    if (!props.showGivers || !givenGifts.value) {
        return [];
    }

    return givenGifts.value?.filter((gg) => gg.WishId === wish.Id);
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

            <div class="flex no-wrap items-center">
                <TransitionGroup name="grow">
                    <BoughtIndicator
                        v-for="buyer in findGivers(wish)"
                        :key="buyer.Id"
                        :wish-purchase="buyer"
                        :wish-title="wish.Name"
                    />
                </TransitionGroup>

                <Button v-if="showGivers" round @click="() => handleBuyClicked(wish)">
                    <Icon font-size="24px" name="shopping_cart" />
                </Button>
            </div>
        </ListItem>
    </div>

    <Dialog v-model="showBoughtItemDialog">
        <BoughtItemForm
            @close="(_) => (showBoughtItemDialog = false)"
            v-if="boughtItem"
            :item="boughtItem"
            :group-id="groupId"
        />
    </Dialog>
</template>
