<script setup lang="ts">
interface Props {
    modelValue: boolean;
    persistent?: boolean;
    withConfirm?: boolean;
    preload?: boolean;
}

interface Emits {
    (event: 'update:modelValue', value: boolean): void;
    (event: 'cancel'): void;
    (event: 'confirm'): void;
}

const props = withDefaults(defineProps<Props>(), { withConfirm: false, preload: false });

const emit = defineEmits<Emits>();

const handleClickOutside = () => {
    if (props.persistent) {
        return;
    }

    emit('update:modelValue', false);
};
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                @click="handleClickOutside"
                v-if="modelValue || preload"
                v-show="modelValue"
                class="fixed w-full h-full bg-opacity-30 bg-black top-0 left-0 flex flex-col items-center justify-center p-6 z-50"
            >
                <Card @click.stop class="w-full max-w-[450px] py-0 px-0">
                    <div v-if="$slots.title" class="p-4">
                        <h2 class="font-medium text-lg">
                            <slot name="title" />
                        </h2>
                    </div>

                    <hr v-if="$slots.title" class="opacity-40" />

                    <div class="p-4 py-6">
                        <slot />
                    </div>

                    <div v-if="withConfirm" class="w-full flex justify-end pb-4 px-4 gap-2">
                        <Button flat @click="emit('cancel')">
                            <Localized tkey="Cancel" />
                        </Button>
                        <Button @click="emit('confirm')">
                            <Localized tkey="Confirm" />
                        </Button>
                    </div>
                </Card>
            </div>
        </Transition>
    </Teleport>
</template>
