<script setup lang="ts">
const { wishPurchaseId } = useRoute().params;

const { data: tag } = await useWishTag(wishPurchaseId as string);

const showTag = ref(false);

onMounted(() => {
    setTimeout(() => {
        showTag.value = true;
    }, 100);
});
</script>

<template>
    <div class="flex justify-center pt-[25vh]">
        <Transition name="tagSlide">
            <div v-if="tag && showTag" class="relative">
                <div class="flex rotate-45 relative">
                    <div
                        class="rounded-full bg-transparent border-4 border-orange-800 h-[1000px] w-[1000px] absolute z-10"
                        style="top: -480px; left: -976px"
                    />

                    <div class="arrow-left border-r-orange-200 translate-x-[1px]"></div>
                    <div class="arrow-hider border-r-orange-200 absolute" />

                    <div
                        class="hole rounded-full w-[11px] h-[11px] absolute"
                        style="top: calc(50% - 5px); left: 15px"
                    />

                    <div
                        class="px-6 py-3 bg-orange-200 text-black flex flex-col justify-center rounded-r-md shadow-lg shadow-black min-w-[250px]"
                    >
                        <div :class="{ 'handwritten font-semibold text-2xl': true, 'blur-sm': tag.locked }">
                            To {{ tag.toName || 'Giftreceiver' }}
                        </div>
                        <div :class="{ 'handwritten font-semibold text-2xl': true, 'blur-sm': tag.locked }">
                            From {{ tag.fromName || 'Giftgiver' }}
                        </div>

                        <div class="absolute right-2 bottom-1">
                            <a target="_parent" class="text-xs text-gray-800 hover:underline">Powered by 🎁TipGift</a>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.hole {
    background-color: var(--background);
}

.arrow-hider {
    z-index: 20;
    width: 0;
    height: 0;
    border-top: 3px solid transparent;
    border-bottom: 38px solid transparent;

    border-right-width: 45px;
    border-right-style: solid;
    transform: rotate(9deg) translate(3px, 0px);
    top: 57px;
}

.arrow-left {
    width: 0;
    height: 0;
    border-top: 52px solid transparent;
    border-bottom: 52px solid transparent;

    border-right-width: 45px;
    border-right-style: solid;
}
</style>

<style lang="scss">
.tagSlide-enter-active,
.tagSlide-leave-active {
    transition: all 1.5s ease-in-out;
}

.tagSlide-enter-from,
.tagSlide-leave-to {
    transform: translate(-800px, -1000px) rotate3d(0, -250, -45, 180deg);
}
</style>
