<script lang="ts" setup>
useHead({
    link: [
        {
            rel: 'stylesheet',
            href: '/css/base.css',
        },
    ],
});
</script>

<template>
    <div class="w-full flex items-center flex-col">
        <div class="w-full max-w-[920px] pt-20 px-6">
            <header class="flex gap-8 items-center pb-8">
                <NuxtLink to="/">
                    <h1 class="text-2xl">🎁 TipWish</h1>
                </NuxtLink>
                <Navigation />
            </header>

            <slot />
        </div>

        <footer class="w-full bottom-0 fixed flex justify-center py-12">
            <div class="w-full max-w-[920px] flex items-center px-6">
                <div>© sverr.es | 2022</div>
            </div>
        </footer>
    </div>
</template>
