<script setup lang="ts">
import { type Wish } from '@prisma-app/client';
import Input from './Input.vue';

interface Props {
    modelValue: Partial<Wish>;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const { i18n } = await useI18n();
const model = ref<Partial<Wish>>(props.modelValue);
const possibleImages = ref<string[]>([]);
const busy = ref(false);
const fetchingInfo = ref(false);
const refreshingImages = ref(false);

const linkAvailable = computed(() => {
    return model.value.Link?.startsWith('http');
});

watch(props.modelValue, () => (model.value = props.modelValue));

const urlInput = ref<InstanceType<typeof Input> | null>();

onMounted(() => {
    urlInput.value?.focus();
    possibleImages.value = model.value.ImageUrl ? [model.value.ImageUrl] : [];
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
                return result.value;
            }

            throw new Error('Failed to fetch metadata: ' + error.value);
        } finally {
            busy.value = false;
        }
    }
};

const required = (val: any) => {
    if (val instanceof Number) {
        return true;
    }

    return !!val ? true : i18n('Required');
};

const shouldBeUrl = (val: any) => {
    return val?.toString()?.startsWith('http') ? true : 'Must be a URL';
};

const handleFetchInfoClicked = async () => {
    fetchingInfo.value = true;

    try {
        const metadata = await getMetadata();

        model.value.Name = metadata?.title || '';
        model.value.Description = metadata?.description || '';
        model.value.Price = parseInt(metadata?.price || '0') || model.value.Price;
        model.value.ImageUrl = metadata?.possibleImages?.[0] || '';
        possibleImages.value = (metadata?.possibleImages.filter((img) => !!img) as string[]) || [];

        emit('update:modelValue', props.modelValue);
    } finally {
        fetchingInfo.value = false;
    }
};

const handleRefreshImagesClicked = async () => {
    refreshingImages.value = true;

    try {
        const metadata = await getMetadata();
        possibleImages.value = (metadata?.possibleImages.filter((img) => !!img) as string[]) || [];
    } finally {
        refreshingImages.value = false;
    }
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
                :label="`${i18n('Link')} *`"
            />

            <Button :disable="!linkAvailable || busy" @click="handleFetchInfoClicked">
                <Spinner v-if="fetchingInfo" class="text-xs" />
                <span v-else>
                    <Localized tkey="FetchInfo" />
                </span>
            </Button>
        </div>

        <Transition name="slideIn">
            <div class="flex items-center gap-4 overflow-x-auto">
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

                <Button v-if="model.Link && model.Id" :disable="busy" round flat @click="handleRefreshImagesClicked">
                    <Spinner v-if="refreshingImages" class="text-xs" />
                    <Icon v-else font-size="28px" name="refresh" />
                </Button>
            </div>
        </Transition>

        <Input :readonly="busy" :rules="[required]" v-model="model.Name" :label="`${i18n('Title')} *`" class="w-full" />
        <Input :readonly="busy" v-model="model.Description" :label="i18n('Description')" class="w-full" />
        <Input
            :readonly="busy"
            :rules="[required]"
            type="number"
            v-model="model.Price"
            :label="`${i18n('Price')} *`"
            class="w-full"
        />
    </div>
</template>
