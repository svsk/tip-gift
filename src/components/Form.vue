<script setup lang="ts">
interface Emits {
    (event: 'submit'): void;
}

const emit = defineEmits<Emits>();

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
        <input type="submit" hidden />
    </form>
</template>
