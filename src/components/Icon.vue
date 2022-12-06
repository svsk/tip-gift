<script setup lang="ts">
interface Props {
    name: string;
    className?: string;
    fontSize?: string;
}

const props = withDefaults(defineProps<Props>(), {
    className: '',
    fontSize: '1em',
});
</script>

<template>
    <span
        v-if="props.name"
        :style="`font-size: ${props.fontSize} !important;`"
        :class="{ 'material-icons select-none': true, [props.className]: true }"
        >{{ props.name }}</span
    >
</template>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Round|Material+Icons+Outlined');
</style>
