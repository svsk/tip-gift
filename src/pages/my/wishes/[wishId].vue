<script setup lang="ts">
definePageMeta({
    pageTransition: {
        name: 'slideLeft',
        mode: 'out-in',
        duration: 1000,
    },
});

const wishId = useRoute().params.wishId.toString();

const { data: wishes } = await useWishes();

const wish = computed(() => {
    return wishes.value?.find((w) => w.Id === wishId);
});
</script>

<template>
    <Card v-if="wish" class="flex flex-col gap-4">
        <PageHeader back-to="/my/wishes">
            <div class="flex items-center gap-2">
                {{ wish.Name }}

                <Button round>
                    <Icon font-size="24px" name="edit" />
                </Button>
            </div>
        </PageHeader>

        <div class="flex flex-col gap-8">
            <div class="w-full flex flex-wrap-reverse gap-6 justify-end">
                <div class="flex-grow" style="min-width: min(100%, 400px)">
                    <Input v-model="wish.Description" :label="i18n('Description')" type="textarea" class="h-48" />
                </div>

                <div class="rounded-lg overflow-hidden cursor-pointer relative h-48 w-48">
                    <div
                        class="opacity-0 h-full w-full hover:opacity-50 bg-black absolute top-0 left-0 transition-opacity"
                    ></div>
                    <img v-if="wish.ImageUrl" :src="wish.ImageUrl" class="rounded-lg" />
                </div>
            </div>

            <div>
                <h2 class="text-md font-semibold mb-3">
                    <Localized tkey="ShareNewWish" />
                </h2>

                <GroupList disable-navigation>
                    <template #actions="{ group }">
                        <Checkbox :model-value="true" />
                    </template>
                </GroupList>
            </div>
        </div>
    </Card>
</template>
