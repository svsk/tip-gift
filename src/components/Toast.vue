<script setup lang="ts">
interface Props {
    modelValue?: boolean;
    location?: 'bottom' | 'top';
}

const props = withDefaults(defineProps<Props>(), { modelValue: false, location: 'bottom' });

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
        <Transition :name="location === 'bottom' ? 'slideDown' : 'slideUp'">
            <div
                v-if="showToast"
                :class="{
                    'bottom-3': location === 'bottom',
                    'top-3': location === 'top',
                    'left-0 z-50 fixed w-full p-1 flex justify-center shadow-md': true,
                }"
            >
                <Card class="border border-gray-700 w-full max-w-[920px]">
                    <slot />
                </Card>
            </div>
        </Transition>
    </Teleport>
</template>
