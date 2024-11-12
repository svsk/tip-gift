<script setup lang="ts">
import type { WishUserGroup } from '@prisma-app/client';

interface Props {
    group: Partial<WishUserGroup>;
}

defineProps<Props>();
const { i18n } = await useI18n();

const required = (val: string) => {
    return !!val ? true : i18n('Required');
};
</script>

<template>
    <div>
        <div class="flex flex-nowrap gap-2 items-center">
            <GroupAvatar :group="group" />
            <Input
                ref="input"
                v-model="group.GroupName"
                :label="i18n('GroupName')"
                class="w-full"
                :rules="[required]"
            />
        </div>
        <div class="flex flex-nowrap gap-2 items-center">
            <ColorPicker v-model="group.AvatarColour" />
            <EmojiPicker v-model="group.AvatarEmoji" />
        </div>
    </div>
</template>
