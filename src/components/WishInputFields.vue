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
const busy = ref(false);

const linkAvailable = computed(() => {
    return model.value.Link?.startsWith('http');
});

watch(props.modelValue, () => (model.value = props.modelValue));

const urlInput = ref<InstanceType<typeof Input> | null>();

onMounted(() => {
    urlInput.value?.focus();
});

const getMetadata = async () => {
    await nextTick();

    if (model.value.Link?.startsWith('http')) {
        busy.value = true;

        try {
            const { data: result, error } = await useFetch('/api/wishes/extract-metadata', {
                key: model.value.Link,
                method: 'POST',
                body: { url: model.value.Link },
                ...useAuthentication(),
            });

            if (!error.value) {
                model.value.Name = result.value?.title || '';
                model.value.Description = result.value?.description || '';
                model.value.Price = parseInt(result.value?.price || '0') || model.value.Price;
                model.value.ImageUrl = result.value?.possibleImages?.[0] || '';
                possibleImages.value = (result.value?.possibleImages.filter((img) => !!img) as string[]) || [];

                emit('update:modelValue', props.modelValue);
            }
        } finally {
            busy.value = false;
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
        <div class="flex items-center w-full gap-2">
            <Input
                :readonly="busy"
                :rules="[required, shouldBeUrl]"
                ref="urlInput"
                class="grow"
                v-model="model.Link"
                label="Link *"
            />

            <Button :disable="!linkAvailable || busy" @click="getMetadata">
                <Spinner v-if="busy" class="text-xs" />
                <span v-else>Fetch Info</span>
            </Button>
        </div>

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

        <Input :readonly="busy" :rules="[required]" v-model="model.Name" label="Title *" class="w-full" />
        <Input :readonly="busy" v-model="model.Description" label="Description" class="w-full" />
        <Input
            :readonly="busy"
            :rules="[required]"
            type="number"
            v-model="model.Price"
            label="Price *"
            class="w-full"
        />
    </div>
</template>
