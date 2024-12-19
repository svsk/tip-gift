<script setup lang="ts">
interface Props {
    modelValue: boolean;
    persistent?: boolean;
    withConfirm?: boolean;
    confirmText?: string;
    confirmColor?: string;
    disableConfirm?: boolean;
    disableCancel?: boolean;
    preload?: boolean;
}

interface Emits {
    (event: 'update:modelValue', value: boolean): void;
    (event: 'cancel'): void;
    (event: 'confirm'): void;
}

const props = withDefaults(defineProps<Props>(), { withConfirm: false, preload: false });
const emit = defineEmits<Emits>();

const { i18n } = await useI18n();

const dialogContainer = ref<HTMLElement | null>(null);

const handleCloseRequested = () => {
    if (props.persistent) {
        return;
    }

    emit('update:modelValue', false);
};

watch(
    () => props.modelValue,
    async () => {
        if (import.meta.server) {
            return;
        }

        if (props.modelValue) {
            await nextTick();
            dialogContainer.value?.focus();
        }
    }
);
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-if="modelValue || preload"
                v-show="modelValue"
                ref="dialogContainer"
                tabindex="1"
                class="fixed w-full h-full bg-opacity-30 bg-black top-0 left-0 flex flex-col items-center justify-center p-6 z-50"
                @click="handleCloseRequested"
                @keydown.escape="handleCloseRequested"
            >
                <Card class="w-full max-w-[450px] py-0 px-0" @click.stop>
                    <div v-if="$slots.title" class="p-4">
                        <h2 class="font-medium text-lg">
                            <slot name="title" />
                        </h2>
                    </div>

                    <hr v-if="$slots.title" class="opacity-40" />

                    <div class="p-4 py-4">
                        <slot />
                    </div>

                    <div v-if="withConfirm" class="w-full flex justify-end pb-4 px-4 gap-2">
                        <Button :disable="disableCancel" flat @click="emit('cancel')">
                            <Localized tkey="Cancel" />
                        </Button>
                        <Button :disable="disableConfirm" :color="confirmColor" @click="emit('confirm')">
                            {{ confirmText || i18n('Confirm') }}
                        </Button>
                    </div>
                </Card>
            </div>
        </Transition>
    </Teleport>
</template>
