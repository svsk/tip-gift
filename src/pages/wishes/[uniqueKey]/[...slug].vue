<script lang="ts" setup>
import { Wish } from '@prisma/client';

const embedded = useRoute().query.embedded === 'true';
const { uniqueKey } = useRoute().params;

const { data: shareData } = await useFetch('/api/wishes/get-shared-by-key', {
    query: { uniqueKey },
    key: uniqueKey.toString(),
});

usePageTitle(shareData?.value?.share?.Name);

const showToast = ref(false);
const boughtItemName = ref<string | null>(null);
const currentLocation = ref('/');

const handleBuyClicked = (wish: Wish) => {
    boughtItemName.value = wish.Name;
    currentLocation.value = window.location.origin + window.location.pathname;

    if (!useAuth().value) {
        showToast.value = true;
    }
};
</script>

<template>
    <Card>
        <div v-if="shareData">
            <h1 class="text-xl mb-6 flex items-center gap-2 flex-wrap">
                {{ shareData.share.Name }}
                <a
                    :href="currentLocation"
                    v-if="embedded"
                    target="_parent"
                    class="text-xs text-gray-400 hover:underline"
                    >Powered by 🎁TipGift</a
                >
            </h1>
            <div class="flex flex-col">
                <div
                    v-for="wish in shareData.wishes"
                    :key="wish.Id"
                    class="flex items-center justify-between border-b border-1 border-slate-600 last:border-0 py-3 gap-4 w-full overflow-hidden"
                >
                    <WishListItem class="grow" :entry="wish" />
                    <Button round @click="() => handleBuyClicked(wish)">
                        <Icon font-size="24px" name="shopping_cart" />
                    </Button>
                </div>
            </div>
        </div>
        <div v-else>
            <EmptyState> Nothing could be found... </EmptyState>
        </div>
    </Card>

    <Toast v-model="showToast">
        <BoughtToast v-if="!embedded && boughtItemName" :bought-item-name="boughtItemName" />
        <EmbeddedBoughtToast v-else-if="boughtItemName" :bought-item-name="boughtItemName" />
    </Toast>
</template>
