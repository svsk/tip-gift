<script setup lang="ts">
interface Props {
    selected?: boolean;
}

defineProps<Props>();
</script>

<template>
    <button
        v-ripple
        :class="{
            'relative flex items-center justify-center p-4 flex-col gap-2 rounded min-w-[90px] max-w-[110px] ': true,
            'bg-white bg-opacity-20': selected,
        }"
    >
        <div class="flex flex-col items-center justify-center gap-1 text-sm font-semibold tracking-wide w-full">
            <slot name="avatar"></slot>

            <span class="overflow-hidden break-words overflow-ellipsis w-full line-clamp-2">
                <slot name="label"></slot>
            </span>
        </div>
    </button>
</template>
