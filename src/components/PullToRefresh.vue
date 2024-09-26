<script setup lang="ts">
let clientYWhenTopWasHit: null | number = null;
const maxPullSize = 100;

const pulledHeight = ref(0);
const reloading = ref(false);

const handleTouchMove = (e: TouchEvent) => {
    // Stop if we are not at the top of the page
    if (window.scrollY > 0 && clientYWhenTopWasHit === null) {
        pulledHeight.value = 0;
        return;
    }

    const currentFingerPosition = e.touches[0].clientY;
    clientYWhenTopWasHit = clientYWhenTopWasHit || currentFingerPosition;
    pulledHeight.value = Math.min(currentFingerPosition - clientYWhenTopWasHit, maxPullSize);
};

const handleTouchEnd = (e: TouchEvent) => {
    if (pulledHeight.value >= maxPullSize) {
        reloading.value = true;
        location.reload();
    }

    pulledHeight.value = 0;
    clientYWhenTopWasHit = null;
};

const iconSize = computed(() => {
    return (1 / maxPullSize) * pulledHeight.value;
});
</script>

<template>
    <div @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <div
            :class="{
                'w-full overflow-y-hidden flex items-center bg-blue-600': true,
            }"
            :style="`height: ${pulledHeight}px`"
        >
            <div
                class="w-full py-4 text-center"
                :style="`transform: rotate(${
                    260 + pulledHeight * 3
                }deg) scale(${iconSize}); transform-origin: 50% 50%;`"
            >
                <Icon font-size="24px" name="refresh" />
            </div>
        </div>
        <slot v-if="!reloading" />
    </div>
</template>

<style scoped lang="scss"></style>
