<script lang="ts" setup>
import { type WishUserGroup } from '@prisma-app/client';

const { data: groups } = await useGroups();

interface Props {
    allowAdding?: boolean;
    disableNavigation?: boolean;
}

interface Emits {
    (event: 'group-clicked', group: WishUserGroup): void;
}

withDefaults(defineProps<Props>(), { allowAdding: false, disableNavigation: false });
const emit = defineEmits<Emits>();
</script>

<template>
    <div class="flex flex-col gap-2">
        <EmptyState v-if="!groups?.length" class="text-center text-base flex flex-col gap-2">
            <Localized tkey="NoGroupsYet" />...
        </EmptyState>

        <GroupAddButton v-if="allowAdding">
            <template #="{ handleAddClicked }">
                <ListItem clickable class="w-full mb-3" @click="handleAddClicked">
                    <div class="flex items-center gap-2 flex-nowrap">
                        <div
                            class="rounded-full min-h-[48px] min-w-[48px] bg-slate-700 text-white flex items-center justify-center"
                        >
                            <Icon font-size="32px" name="add" />
                        </div>

                        <div class="flex flex-col items-start">
                            <Localized tkey="NewGroup" />
                            <div class="text-xs opacity-60">
                                <Localized tkey="JoinOrAddNewGroup" />
                            </div>
                        </div>
                    </div>
                </ListItem>
            </template>
        </GroupAddButton>

        <NuxtLink
            :to="disableNavigation ? undefined : `/my/group/${group.Id}`"
            v-ripple
            v-for="group in groups"
            :key="group.Id"
            @click="() => emit('group-clicked', group)"
        >
            <ListItem clickable class="flex justify-between">
                <div class="flex items-center gap-2 flex-nowrap">
                    <GroupAvatar :group="group" />
                    <GroupListItem :group="group" />
                </div>

                <slot name="actions" class="flex items-center" :group="group">
                    <Icon font-size="24px" name="chevron_right" />
                </slot>
            </ListItem>
        </NuxtLink>
    </div>
</template>
