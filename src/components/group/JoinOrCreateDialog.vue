<script setup lang="ts">
import { type WishUserGroup } from '@prisma-app/client';

interface Props {
    modelValue: boolean;
}

interface Emits {
    (event: 'update:modelValue', value: boolean): void;
    (event: 'add', group: Partial<WishUserGroup>): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showDialog = ref(props.modelValue);
const joinOrAdd = ref<'join' | 'add' | 'undecided'>('undecided');
const group = ref<Partial<WishUserGroup>>({});
const inviteCode = ref('');

const handleModelValueChanged = () => {
    const newModelValue = props.modelValue;

    if (newModelValue === true && showDialog.value === false) {
        joinOrAdd.value = 'undecided';
    }

    showDialog.value = newModelValue;
};

watch(
    () => props.modelValue,
    () => handleModelValueChanged()
);

const handleCancel = () => {
    emit('update:modelValue', false);
    joinOrAdd.value = 'add';
};

const handleJoin = () => {
    // Navigate to the join group page
    const url = `/group/join/${inviteCode.value}`;
    // Nuxt navigate
    useRouter().push(url);
};

const handleAdd = () => {
    emit('add', group.value);
    handleCancel();
};
</script>

<template>
    <Dialog v-model="showDialog">
        <template #title>
            <Localized tkey="NewGroup" />
        </template>

        <TransitionGroup name="slidePast">
            <div key="choice" v-if="joinOrAdd === 'undecided'" class="flex justify-center gap-2">
                <button
                    v-ripple
                    class="relative flex flex-col gap-3 items-center justify-center p-4 rounded border border-slate-600 min-h-[120px]"
                    @click="joinOrAdd = 'join'"
                >
                    <Icon name="diversity_1" font-size="32px" />
                    <Localized tkey="JoinGroup" />
                </button>

                <button
                    v-ripple
                    class="relative flex flex-col gap-3 items-center justify-center p-4 rounded border border-slate-600 min-h-[120px]"
                    @click="joinOrAdd = 'add'"
                >
                    <Icon name="group_add" font-size="32px" />
                    <Localized tkey="AddGroup" />
                </button>
            </div>

            <Form key="join" v-if="joinOrAdd === 'join'" @submit="handleJoin">
                <GroupJoinForm v-model:invite-code="inviteCode" class="mb-6" />

                <div class="flex justify-end gap-2">
                    <Button flat @click="handleCancel">
                        <Localized tkey="Cancel" />
                    </Button>
                    <Button type="submit">
                        <Localized tkey="Confirm" />
                    </Button>
                </div>
            </Form>

            <Form key="add" v-if="joinOrAdd === 'add'" @submit="handleAdd">
                <GroupEditForm :group="group" />

                <div class="flex justify-end gap-2">
                    <Button flat type="button" @click="handleCancel">
                        <Localized tkey="Cancel" />
                    </Button>
                    <Button type="submit">
                        <Localized tkey="Confirm" />
                    </Button>
                </div>
            </Form>
        </TransitionGroup>
    </Dialog>
</template>
