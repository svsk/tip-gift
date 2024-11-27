<script setup lang="ts">
import * as QRCode from 'qrcode';
import type { WishPurchaseWish, WishTag } from '~/prisma/customTypes';

interface Props {
    wishPurchase: WishPurchaseWish;
    disallowEditing?: boolean;
    hidePreview?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disallowEditing: false,
    hidePreview: false,
});

const tagDataUrl = ref<string | null>(null);
const { data: tag, refresh: refreshTag } = await useWishTag(props.wishPurchase.Id);
const saving = ref(false);
const { i18n } = await useI18n();

const tagData = reactive<Partial<WishTag>>({
    toText: null,
    fromText: null,
});

const baseUrl = computed(() => {
    return import.meta.client ? window.location.origin : '';
});

const url = computed(() => {
    return `${baseUrl.value}/gift-tag/${props.wishPurchase.Id}`;
});

watch(
    () => props.wishPurchase?.Id,
    async () => {
        tagDataUrl.value = await QRCode.toDataURL(url.value, { width: 200, color: { dark: '#fff', light: '#1e2a36' } });
    },
    { immediate: true }
);

watch(
    () => tag.value,
    () => {
        tagData.toText = tag.value?.toText || null;
        tagData.fromText = tag.value?.fromText || null;
    },
    { deep: true, immediate: true }
);

const handleSaveTag = async () => {
    saving.value = true;
    try {
        await updateWishTag(props.wishPurchase.Id, tagData);
        refreshTag();
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col gap-3">
        <div class="text-xl flex flex-col items-center justify-center text-center">
            <div class="line-clamp-1">{{ wishPurchase.Name }}</div>
            <div v-if="tag"><Localized tkey="To" lowercase /> {{ tag.toText }}</div>
        </div>

        <ClientOnly>
            <img v-if="tagDataUrl" :src="tagDataUrl" />
        </ClientOnly>

        <a v-if="!hidePreview" :href="url" target="_blank">
            <Button class="flex items-center gap-2">
                <Icon name="open_in_new" />
                <Localized tkey="Preview" />
            </Button>
        </a>

        <div v-if="!disallowEditing" class="flex flex-col gap-3 w-full">
            <Input v-model="tagData.toText" :label="i18n('To')" />
            <Input v-model="tagData.fromText" :label="i18n('From')" />

            <div class="flex items-end justify-end">
                <Button :disable="saving" @click="handleSaveTag">
                    <Localized tkey="Confirm" />
                </Button>
            </div>
        </div>
    </div>
</template>
