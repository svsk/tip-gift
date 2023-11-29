<script setup lang="ts">
definePageMeta({
    pageTransition: {
        name: 'slideIn',
        mode: 'out-in',
        duration: 1000,
    },
});

const wishPurchaseId = useRoute().params.wishPurchaseId.toString();

const { data: purchases } = await useMyWishPurchases();

const item = computed(() => purchases.value?.find((p) => p.Id === wishPurchaseId));
</script>

<template>
    <Card class="relative" v-if="item">
        <PageHeader back-to="/my/checklist">
            {{ item?.Name }}
        </PageHeader>

        <div v-if="item?.WishOwnerId" class="w-full text-center pt-4 text-sm">
            <Localized tkey="GiftFor" /><br />
            <User :user-id="item?.WishOwnerId" without-avatar class="text-xl" />
        </div>

        <WishPurchaseSpotlight :wish-purchase="item" />

        <div class="w-full flex items-center justify-center min-h-[50px]">
            <WishPurchaseStateButtons :wish-purchase="item" />
        </div>
    </Card>
</template>
