<script setup lang="ts">
interface Props {
    modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), { modelValue: false });

const showToast = ref(props.modelValue);

const show = (duration = 3000) => {
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, duration);
};

defineExpose({
    show,
});
</script>

<template>
    <Teleport to="body">
        <Transition name="slideDown">
            <div v-if="showToast" class="bottom-0 left-0 z-50 fixed w-full p-1 flex justify-center">
                <Card class="border border-gray-700 w-full max-w-[920px]">
                    <slot />
                </Card>
            </div>
        </Transition>
    </Teleport>
</template>
