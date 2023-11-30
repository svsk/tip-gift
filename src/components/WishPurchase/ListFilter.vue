<script setup lang="ts">
interface Props {
    filterGiven: boolean;
}

interface Emits {
    (event: 'update:filterGiven', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const filterGivenModel = ref(props.filterGiven);

watch(
    () => props.filterGiven,
    (value) => {
        filterGivenModel.value = value;
    }
);

watch(
    () => filterGivenModel.value,
    (value) => {
        emit('update:filterGiven', value);
    }
);
</script>

<template>
    <div>
        <div class="flex flex-nowrap items-center gap-2">
            <Localized tkey="FilterGiven" />
            <ButtonToggle
                v-model="filterGivenModel"
                :options="[
                    { label: i18n('Yes'), value: true },
                    { label: i18n('No'), value: false },
                ]"
            />
        </div>
    </div>
</template>
