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
    <div class="flex flex-col">
        <EmptyState v-if="!groups?.length" class="text-center text-base flex flex-col gap-2">
            <Localized tkey="NoGroupsYet" />...
        </EmptyState>

        <GroupAddButton v-if="allowAdding">
            <template #="{ handleAddClicked }">
                <button
                    v-ripple
                    class="py-2 flex justify-between items-center border-slate-600 border-b last:border-b-0 w-full relative"
                    @click="handleAddClicked"
                >
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
                </button>
            </template>
        </GroupAddButton>

        <NuxtLink
            :to="disableNavigation ? undefined : `/my/group/${group.Id}`"
            v-ripple
            v-for="group in groups"
            :key="group.Id"
            class="py-2 flex justify-between items-center border-slate-600 border-b last:border-b-0 relative cursor-pointer"
            @click="() => emit('group-clicked', group)"
        >
            <div class="flex items-center gap-2 flex-nowrap">
                <GroupAvatar :group="group" />
                <GroupListItem :group="group" />
            </div>

            <slot name="actions" class="flex items-center" :group="group">
                <Icon font-size="24px" name="chevron_right" />
            </slot>
        </NuxtLink>
    </div>
</template>
