<script setup lang="ts">
const show = ref(false);
const parentElement = ref<HTMLElement | null>(null);
const position = ref({ top: 0, left: 0 });
const menuElement = ref<HTMLElement | null>(null);

const getParentPosition = () => {
    if (!parentElement.value) {
        return { top: 0, left: 0 };
    }

    const rect = parentElement.value.getBoundingClientRect();
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const result = {
        top: rect.top + scrollTop + rect.height + 5,
        left: rect.left + scrollLeft,
    };

    return result;
};

const toggleVisibility = async (click: MouseEvent) => {
    if (!parentElement.value) {
        return;
    }

    click.stopPropagation();

    position.value = getParentPosition();
    show.value = !show.value;
};

onMounted(() => {
    const parentComponent = getCurrentInstance()?.parent;
    parentElement.value = parentComponent?.vnode?.el as HTMLElement;

    if (!parentElement.value) {
        console.warn('Failed to set up menu. No parent element found.');
        return;
    }

    parentElement.value.addEventListener('click', toggleVisibility);
    window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    parentElement.value?.removeEventListener('click', toggleVisibility);
});

const handleClickOutside = (click: MouseEvent) => {
    // Check if the click was outside the menu
    if (show.value === true && menuElement.value && !menuElement.value.contains(click.target as Node)) {
        show.value = false;
    }
};
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-show="show"
                ref="menuElement"
                class="absolute"
                :style="`top: ${position.top}px; left: ${position.left}px; z-index: 1000;`"
            >
                <slot />
            </div>
        </Transition>
    </Teleport>
</template>
