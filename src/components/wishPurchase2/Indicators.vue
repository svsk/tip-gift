<script setup lang="ts">
interface Props {
    wishId: string;
    groupId: string;
}

const props = defineProps<Props>();

const { data: groupWishes } = await useGroupWishes(props.groupId);
const { data: groupWishPurchases } = await useGroupWishPurchases(props.groupId);

const wish = computed(() => {
    return groupWishes.value?.find((gw) => gw.Id === props.wishId);
});

const wishPurchases = computed(() => {
    return groupWishPurchases.value?.filter((wp) => wp.WishId === props.wishId);
});
</script>

<template>
    <TransitionGroup name="grow" v-if="wish">
        <WishPurchaseDeleteButton
            v-for="wishPurchase in wishPurchases"
            :key="wishPurchase.Id"
            :wish-purchase="wishPurchase"
            :wish-title="wish.Name"
        >
            <div :class="{ 'relative select-none w-[36px]': true }">
                <div class="scale-[0.5]">
                    <User without-username :user-id="wishPurchase.UserId" />
                </div>
                <div class="absolute bottom-[4px] right-[-6px] scale-75">🎁</div>
            </div>
        </WishPurchaseDeleteButton>
    </TransitionGroup>
</template>
