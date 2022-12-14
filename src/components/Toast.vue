<script setup lang="ts">
interface Props {
    modelValue: boolean;
}

defineProps<Props>();
</script>

<template>
    <Teleport to="body">
        <Transition name="slideDown">
            <div v-if="modelValue" class="bottom-0 left-0 z-50 fixed w-full p-1 flex justify-center">
                <Card class="border border-gray-700 w-full max-w-[920px]">
                    <slot />
                </Card>
            </div>
        </Transition>
    </Teleport>
</template>
