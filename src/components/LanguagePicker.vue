<script setup lang="ts">
interface Props {
    modelValue?: string | null | undefined;
}

interface Emits {
    (event: 'update:modelValue', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const preferredLanguage = ref(props.modelValue || 'en-GB');

const languages = computed(() => {
    return [
        { value: SupportedLanguage.EnglishUK, label: 'English' },
        { value: SupportedLanguage.NorwegianBokmal, label: 'Norsk' },
    ];
});

watch(
    () => preferredLanguage.value,
    () => emit('update:modelValue', preferredLanguage.value)
);
</script>

<template>
    <Select v-model="preferredLanguage" :label="i18n('Language')" :options="languages" />
</template>
