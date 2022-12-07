<script lang="ts" setup>
const { uniqueKey } = useRoute().params;

const { data: shareData } = await useFetch('/api/wishes/get-shared', {
    query: { uniqueKey },
    key: uniqueKey.toString(),
});

usePageTitle(shareData?.value?.share?.Name);
</script>

<template>
    <Card>
        <div v-if="shareData">
            <h1 class="text-xl mb-6">{{ shareData.share.Name }}</h1>
            <WishList :items="shareData.wishes" readonly />
        </div>
        <div v-else>
            <EmptyState> Nothing could be found... </EmptyState>
        </div>
    </Card>
</template>
