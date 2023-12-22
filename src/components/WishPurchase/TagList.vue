<script setup lang="ts">
import type { WishPurchaseWish } from '~/prisma/customTypes';

interface Props {
    wishPurchases: WishPurchaseWish[];
}

const props = defineProps<Props>();
</script>

<template>
    <div class="flex items-center gap-6 flex-wrap">
        <div v-for="item in props.wishPurchases" :key="item.Id" class="w-[200px] min-w-[200px]">
            <WishPurchaseTag :wish-purchase="item" disallow-editing hide-preview />
        </div>
    </div>
</template>
