<script setup lang="ts">
interface Props {
    inviteCode?: string | null;
}

interface Emits {
    (event: 'update:inviteCode', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const inviteCodeInput = ref('');

watch(
    () => props.inviteCode,
    () => (inviteCodeInput.value = props.inviteCode || inviteCodeInput.value),
    { immediate: true }
);

watch(
    () => inviteCodeInput.value,
    () => {
        const inviteCode = inviteCodeInput.value.split('/join/').at(-1);
        if (inviteCode) {
            emit('update:inviteCode', inviteCode);
        }
    }
);
</script>

<template>
    <div class="flex flex-col gap-3">
        <Localized class="text-sm opacity-60" tkey="JoinGroupExplanation" />
        <Input :label="i18n('InviteCode')" v-model="inviteCodeInput" />
    </div>
</template>
