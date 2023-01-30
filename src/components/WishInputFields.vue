<script setup lang="ts">
import { Wish } from '@prisma/client';
import Input from './Input.vue';

interface Props {
    modelValue: Partial<Wish>;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const model = ref<Partial<Wish>>(props.modelValue);
const possibleImages = ref<string[]>([]);

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
            model.value.ImageUrl = result.value?.possibleImages?.[0] || '';
            possibleImages.value = (result.value?.possibleImages.filter((img) => !!img) as string[]) || [];

            emit('update:modelValue', props.modelValue);
        }
    }
};

const required = (val: any) => {
    if (val instanceof Number) {
        return true;
    }

    return !!val ? true : 'Required';
};

const shouldBeUrl = (val: any) => {
    return val?.toString()?.startsWith('http') ? true : 'Must be a URL';
};
</script>

<template>
    <div class="flex items-center gap-4 flex-wrap justify-center">
        <Input
            :rules="[required, shouldBeUrl]"
            ref="urlInput"
            @update:model-value="getMetadata"
            class="w-full"
            v-model="model.Link"
            label="Link *"
        />

        <Transition name="slideIn">
            <div v-if="possibleImages.length" class="flex items-center gap-4">
                <img
                    :class="{
                        'rounded max-h-20 cursor-pointer border-4 ': true,
                        'border-white': image !== model.ImageUrl,
                        'border-blue-500': image === model.ImageUrl,
                    }"
                    v-for="image in possibleImages"
                    :src="image"
                    @click="model.ImageUrl = image"
                />
            </div>
        </Transition>

        <Input :rules="[required]" v-model="model.Name" label="Title *" class="w-full" />
        <Input v-model="model.Description" label="Description" class="w-full" />
        <Input :rules="[required]" type="number" v-model="model.Price" label="Price *" class="w-full" />
    </div>
</template>
