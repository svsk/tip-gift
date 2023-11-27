<script setup lang="ts">
definePageMeta({
    pageTransition: {
        name: 'slideLeft',
        mode: 'out-in',
        duration: 1000,
    },
});
</script>

<template>
    <Card class="flex flex-col gap-4">
        <PageHeader back-to="/my/groups">
            <Localized tkey="MyChecklist" />
        </PageHeader>

        <div class="text-sm opacity-60">
            <Localized tkey="ChecklistExplanation" />
        </div>

        <div class="h-[1px] bg-slate-600 w-full" />

        <div class="overflow-x-auto"></div>

        <ChecklistGiftPurchaseList />
    </Card>
</template>
