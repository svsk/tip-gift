<script setup lang="ts">
interface Props {
    transition?: string;
}

withDefaults(defineProps<Props>(), {
    transition: 'fade',
});

const show = defineModel({ type: Boolean, required: false, default: false });
const parentElement = ref<HTMLElement | null>(null);
const position = ref({ top: 0, left: 0 });
const menuElement = ref<HTMLElement | null>(null);

const calculateMenuPosition = () => {
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

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const menuHeight = menuElement.value?.clientHeight || 0;
    const menuWidth = menuElement.value?.clientWidth || 0;

    if (result.top + menuHeight > viewportHeight) {
        result.top = rect.top - menuHeight - 5;
    }

    if (result.left + menuWidth > viewportWidth) {
        result.left = rect.left - menuWidth + rect.width;
    }

    if (result.left < 0) {
        result.left = 0;
    }

    if (result.top < 0) {
        result.top = 0;
    }

    return result;
};

const recalculatePosition = async () => {
    position.value = calculateMenuPosition();
};

const toggleVisibility = async (click: MouseEvent) => {
    if (!parentElement.value) {
        return;
    }

    click.stopPropagation();

    show.value = !show.value;

    recalculatePosition();
};

let disposePositionObservers: (() => void) | null = null;
const ensureWithinViewport = (elementToKeepInView: HTMLElement) => {
    if (disposePositionObservers) {
        // Already set up.
        return;
    }

    const observer = new ResizeObserver(() => recalculatePosition());
    const mutationObserver = new MutationObserver(() => recalculatePosition());

    observer.observe(window.document.body);
    mutationObserver.observe(elementToKeepInView, { childList: true, subtree: true, attributes: true });

    disposePositionObservers = () => {
        observer.disconnect();
        mutationObserver.disconnect();
        disposePositionObservers = null;
    };
};

watch(
    () => menuElement.value,
    () => {
        if (menuElement.value) {
            ensureWithinViewport(menuElement.value);
        }
    },
    { immediate: true }
);

onMounted(() => {
    const parentComponent = getCurrentInstance()?.parent;
    parentElement.value = parentComponent?.vnode?.el as HTMLElement;

    if (!parentElement.value) {
        console.warn('Failed to set up menu. No parent element found.');
        return;
    }

    parentElement.value.addEventListener('click', toggleVisibility);
    document.body.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    parentElement.value?.removeEventListener('click', toggleVisibility);
    document.body.removeEventListener('click', handleClickOutside);
    disposePositionObservers?.();
});

const handleClickOutside = (click: MouseEvent) => {
    // Check if the click was outside the menu
    if (show.value === true && menuElement.value && !menuElement.value.contains(click.target as Node)) {
        show.value = false;
    }
};
</script>

<template>
    <ClientOnly>
        <Teleport to="body">
            <Transition :name="transition">
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
    </ClientOnly>
</template>
