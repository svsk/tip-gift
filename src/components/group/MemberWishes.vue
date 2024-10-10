<script setup lang="ts">
interface Props {
    groupId: string;
    groupMemberId: string;
}

defineProps<Props>();

const showGivers = ref(false);

const currentUserId = useAuth()?.value?.id;
</script>

<template>
    <div>
        <div class="flex flex-col">
            <div v-if="groupMemberId === currentUserId" class="flex flex-col gap-2">
                <GroupCurrentUserWishes :group-id="groupId" />
            </div>
            <div v-else>
                <div class="flex items-center justify-end w-full flex-nowrap gap-3 pb-2">
                    <label for="showGivers">
                        <Localized tkey="ShowGivers" />
                    </label>
                    <ButtonToggle
                        id="showGivers"
                        v-model="showGivers"
                        :options="[
                            { label: i18n('No'), value: false },
                            { label: i18n('Yes'), value: true },
                        ]"
                    />
                </div>

                <GroupOtherMemberWishes
                    :group-member-id="groupMemberId"
                    :group-id="groupId"
                    :show-givers="showGivers"
                />
            </div>
        </div>
    </div>
</template>
