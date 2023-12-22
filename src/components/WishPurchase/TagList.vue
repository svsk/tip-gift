<script setup lang="ts">
import type { WishPurchaseWish } from '~/prisma/customTypes';

interface Props {
    wishPurchases: WishPurchaseWish[];
}

const props = defineProps<Props>();
</script>

<template>
    <div class="flex items-center gap-6">
        <div v-for="item in props.wishPurchases" :key="item.Id">
            <WishPurchaseTag :wish-purchase="item" disallow-editing />
        </div>
    </div>
</template>
