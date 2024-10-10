<script setup lang="ts">
interface Props {
    createdDate: string | Date | undefined;
    lastVisitDate: string | Date | undefined;
}

const props = defineProps<Props>();

const isNew = computed(() => {
    if (!props.createdDate || !props.lastVisitDate) {
        return false;
    }

    const oneDay = 1000 * 60 * 60 * 24;
    const createdDate = new Date(props.createdDate);
    const cutOff = new Date(new Date(props.lastVisitDate).getTime() - oneDay);

    return createdDate > cutOff;
});
</script>

<template>
    <Transition name="grow">
        <Badge v-if="isNew">
            <Localized tkey="New" />
        </Badge>
    </Transition>
</template>
