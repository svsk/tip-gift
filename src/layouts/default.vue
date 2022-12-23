<script setup lang="ts">
useHead({
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
});

usePageTitle();
</script>

<template>
    <div class="w-full flex items-center flex-col">
        <div class="w-full max-w-[920px] pt-20 px-2 min-h-[calc(100vh-125px)]">
            <header class="flex gap-8 items-center pb-8">
                <NuxtLink to="/">
                    <h1 class="text-2xl">🎁 TipGift</h1>
                </NuxtLink>
                <Navigation />
            </header>

            <slot />
        </div>

        <footer class="w-full bottom-0 flex justify-center py-12">
            <div class="w-full max-w-[920px] flex items-center px-6">
                <div>© sverr.es | {{ new Date().getFullYear() }}</div>
            </div>
        </footer>
    </div>
</template>
