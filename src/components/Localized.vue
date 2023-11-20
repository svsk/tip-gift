<script setup lang="ts">
interface Props {
    tkey: string;
    lowercase?: boolean;
}

defineProps<Props>();
</script>

<template>
    {{ lowercase ? i18n(tkey).toLowerCase() : i18n(tkey) }}
</template>
