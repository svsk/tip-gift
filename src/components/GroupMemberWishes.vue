<script setup lang="ts">
import { type Wish } from '@prisma-app/client';

interface Props {
    groupId: string;
    groupMemberId: string;
}

const props = defineProps<Props>();

const { data: groupWishes } = await useGroupWishes(props.groupId);
const { data: currentUserWishes } = await useWishes();
const { data: givenGifts } = await useGroupGivenGifts(props.groupId);

const currentUserId = useAuth()?.value?.id;

const boughtItem = ref<Wish | null>(null);
const showBoughtItemDialog = ref<boolean>(false);
const showGivers = ref(false);

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
    return groupWishes.value
        ?.filter((gw) => gw.UserId === props.groupMemberId)
        .sort((a, b) => (a.Order || 0) - (b.Order || 1));
});

const handleBuyClicked = (wish: Wish) => {
    boughtItem.value = wish;
    showBoughtItemDialog.value = true;
};

const findGivers = (wish: Wish) => {
    if (!showGivers.value) {
        return [];
    }

    return givenGifts.value?.filter((gg) => gg.WishId === wish.Id);
};
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
                <div class="flex items-center justify-end w-full flex-nowrap gap-3 pb-2">
                    <label for="showGivers">
                        <Localized tkey="ShowGivers" />
                    </label>
                    <ButtonToggle
                        id="showGivers"
                        v-model="showGivers"
                        :options="[
                            { label: i18n('No'), value: false },
                            { label: i18n('Yes'), value: true },
                        ]"
                    />
                </div>

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
                    </div>
                </span>
            </div>
        </div>
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
