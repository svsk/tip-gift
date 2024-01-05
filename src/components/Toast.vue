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
        <Transition :name="location === 'bottom' ? 'slideDown' : 'slideInLong'">
            <div
                v-if="showToast"
                :class="{
                    'bottom-3 justify-center': location === 'bottom',
                    'bottom-3 justify-end md:pr-6': location === 'top',
                    'left-0 z-50 fixed w-full p-1 flex shadow-md': true,
                }"
            >
                <Card class="border border-gray-700">
                    <slot />
                </Card>
            </div>
        </Transition>
    </Teleport>
</template>
