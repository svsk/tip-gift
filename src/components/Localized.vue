<script setup lang="ts">
interface Props {
    tkey: keyof LanguageStrings;
    lowercase?: boolean;
}

defineProps<Props>();

const { i18n } = await useI18n();
</script>

<template>
    <span>{{ lowercase ? i18n(tkey).toLowerCase() : i18n(tkey) }}</span>
</template>
