<script setup lang="ts">
import { type WishUser } from '@prisma-app/client';

interface Props {
    modelValue: WishUser | null;
    rules?: ((val: any) => string | boolean)[];
}

const emit = defineEmits(['update:modelValue']);

const props = defineProps<Props>();

const searchContent = ref('');
const result = ref<WishUser[]>([]);
const selectedUser = ref<WishUser | null>(props.modelValue);

const handleSearchInput = async (value: string) => {
    result.value = (await searchUsers(value)) || [];
};

const handleUserSelected = (user: WishUser) => {
    searchContent.value = user.Name || user.Email;
    selectedUser.value = user;
    result.value = [];
    emit('update:modelValue', selectedUser.value);
};
</script>

<template>
    <div class="relative">
        <Input
            :rules="rules"
            v-model="searchContent"
            @update:model-value="handleSearchInput"
            :debounce="600"
            :label="i18n('User')"
        >
            <template #suffix>
                <User class="scale-75" v-if="selectedUser" without-username :user-id="selectedUser.Id" />
            </template>
        </Input>

        <Card v-if="result.length" class="flex flex-col gap-2 absolute w-full shadow-md z-50 p-0 overflow-hidden">
            <User
                v-for="user in result"
                :key="user.Id"
                v-ripple
                avatar-class="scale-[0.85]"
                class="py-2 px-4 flex gap-2 items-center cursor-pointer hover:bg-white hover:bg-opacity-10 relative"
                :user-id="user.Id"
                @click="() => handleUserSelected(user)"
            />
        </Card>
    </div>
</template>
