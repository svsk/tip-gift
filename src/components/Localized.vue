<template>
    {{ (i18n(defaultLanguage) as any)[tkey] }}
</template>

<script setup lang="ts">
const defaultLanguage = SupportedLanguage.EnglishUK;

interface Props {
    tkey: string;
}

defineProps<Props>();
</script>
