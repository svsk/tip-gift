<script lang="ts" setup>
import { Wish } from '@prisma/client';

const { uniqueKey } = useRoute().params;

const { data: shareData } = await useFetch('/api/wishes/get-shared-by-key', {
    query: { uniqueKey },
    key: uniqueKey.toString(),
});

usePageTitle(shareData?.value?.share?.Name);

const showToast = ref(false);
const boughtItemName = ref<string | null>(null);

const handleBuyClicked = (wish: Wish) => {
    boughtItemName.value = wish.Name;

    if (!useAuth().value) {
        showToast.value = true;
    }
};
</script>

<template>
    <Card>
        <div v-if="shareData">
            <h1 class="text-xl mb-6">{{ shareData.share.Name }}</h1>
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
        <div class="pb-4 text-lg">🎁 Excellent!</div>

        Sign in to tell others that you've bought {{ boughtItemName }}!

        <div class="pt-4 flex w-full justify-between">
            <div>😸 Logging in is super easy!</div>

            <NuxtLink to="/login">
                <Button>Log In</Button>
            </NuxtLink>
        </div>
    </Toast>
</template>
