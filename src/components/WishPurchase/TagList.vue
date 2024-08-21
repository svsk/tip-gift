<script setup lang="ts">
import type { WishPurchaseWish } from '~/prisma/customTypes';

interface Props {
    wishPurchases: WishPurchaseWish[];
}

const props = defineProps<Props>();

const notYetGivenWishPurchases = computed(() => props.wishPurchases.filter((wp) => !wp.GivenDate));
</script>

<template>
    <div class="flex items-center gap-6 flex-wrap">
        <div v-for="wishPurchase in notYetGivenWishPurchases" :key="wishPurchase.Id" class="w-[200px] min-w-[200px]">
            <WishPurchaseTag :wish-purchase="wishPurchase" disallow-editing hide-preview />
        </div>
    </div>
</template>
