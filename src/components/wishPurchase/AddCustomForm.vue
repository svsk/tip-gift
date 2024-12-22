<script setup lang="ts">
interface Props {
    args: { customName: string; receiverName: string };
}

defineProps<Props>();

const { i18n } = await useI18n();

const required = (val: string) => !!val || i18n('Required');
</script>

<template>
    <div class="flex flex-col gap-4">
        <Input v-model="args.customName" :label="`${i18n('ProductName')} *`" :rules="[required]" />
        <Input v-model="args.receiverName" :label="`${i18n('ReceiverName')} *`" :rules="[required]" />
    </div>
</template>
