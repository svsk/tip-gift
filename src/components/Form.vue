<script setup lang="ts">
const emit = defineEmits(['submit']);
const childValidators: (() => boolean)[] = [];
provide('formValidators', childValidators);

const handleSubmit = () => {
    if (validate()) {
        emit('submit');
    }
};

const validate = () => {
    const validationResults = childValidators.map((validate) => validate());
    return !validationResults.some((result) => result === false);
};

defineExpose({
    validate,
});
</script>

<template>
    <form @submit.prevent="handleSubmit" novalidate>
        <slot />
    </form>
</template>
