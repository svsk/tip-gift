<script setup lang="ts">
interface Props {
    src?: string | null;
}

defineProps<Props>();
</script>

<template>
    <div
        v-if="src"
        class="bg-cover bg-center rounded-lg overflow-hidden relative bg-white"
        :style="`background-image: url('${src}')`"
    ></div>
    <div v-else class="flex items-center justify-center text-4xl text-gray-400 select-none bg-white rounded-lg">?</div>
</template>
