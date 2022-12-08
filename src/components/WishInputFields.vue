<script setup lang="ts">
import { Wish } from '@prisma/client';
import Input from './Input.vue';

interface Props {
    modelValue: Partial<Wish>;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const model = ref<Partial<Wish>>(props.modelValue);
watch(props.modelValue, () => (model.value = props.modelValue));

const urlInput = ref<InstanceType<typeof Input> | null>();

onMounted(() => {
    urlInput.value?.focus();
});

const getMetadata = async () => {
    await nextTick();

    if (model.value.Link?.startsWith('http')) {
        const { data: result, error } = await useFetch('/api/wishes/extract-metadata', {
            key: model.value.Link,
            method: 'POST',
            body: { url: model.value.Link },
            ...useAuthentication(),
        });

        if (!error.value) {
            model.value.Name = result.value?.title || '';
            model.value.Description = result.value?.description || '';
            model.value.Price = parseInt(result.value?.price || '0') || undefined;
            model.value.ImageUrl = result.value?.image || '';

            emit('update:modelValue', props.modelValue);
        }
    }
};
</script>

<template>
    <div class="flex items-center gap-4 flex-wrap justify-center">
        <Input ref="urlInput" @update:model-value="getMetadata" class="w-full" v-model="model.Link" label="Link" />

        <Transition name="slideIn">
            <img v-if="model.ImageUrl" class="rounded max-h-20" :src="model.ImageUrl" />
        </Transition>

        <Input v-model="model.Name" label="Title" class="w-full" />
        <Input v-model="model.Description" label="Description" class="w-full" />
        <Input type="number" v-model="model.Price" label="Price" class="w-full" />
    </div>
</template>

<style lang="scss" scoped>
.slideIn-enter-active,
.slideIn-leave-active {
    transition: all 0.1s linear;
}

.slideIn-enter-from,
.slideIn-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
