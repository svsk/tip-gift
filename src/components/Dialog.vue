<script setup lang="ts">
interface Props {
    modelValue: boolean;
}

defineProps<Props>();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                @click="() => emit('update:modelValue', false)"
                v-if="modelValue"
                class="fixed w-full h-full bg-opacity-30 bg-black top-0 left-0 flex flex-col items-center justify-center p-6 z-50"
            >
                <Card @click.stop class="w-full max-w-[450px] p-0">
                    <div v-if="$slots.title" class="p-4">
                        <h2 class="font-medium text-lg">
                            <slot name="title" />
                        </h2>
                    </div>

                    <hr v-if="$slots.title" class="opacity-40" />

                    <div class="p-4 py-6">
                        <slot />
                    </div>
                </Card>
            </div>
        </Transition>
    </Teleport>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.1s linear;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
