<script setup lang="ts">
interface Props {
    backTo?: string;
}

defineProps<Props>();
</script>

<template>
    <div class="w-full flex justify-between items-center gap-4">
        <div class="flex justify-between items-center gap-2">
            <NuxtLink v-if="backTo" :to="backTo">
                <Button round>
                    <Icon font-size="24px" name="arrow_back" />
                </Button>
            </NuxtLink>
            <h1 class="font-medium text-lg">
                <slot />
            </h1>
        </div>

        <slot name="side" />
    </div>
</template>
