<script setup lang="ts">
import { type WishUserGroup } from '@prisma-app/client';

interface Props {
    modelValue: boolean;
}

interface Emits {
    (event: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showDialog = ref(props.modelValue);
const joinOrAdd = ref<'join' | 'add' | 'undecided'>('add');
const group = ref<Partial<WishUserGroup>>({});

watch(
    () => props.modelValue,
    () => (showDialog.value = props.modelValue)
);

const handleCancel = () => {
    emit('update:modelValue', false);
    joinOrAdd.value = 'undecided';
};

const handleJoin = () => {};

const handleAdd = () => {};
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
                <GroupJoinForm class="mb-6" />

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
