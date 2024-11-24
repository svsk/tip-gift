<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    groupId: string;
    collaborationId: string;
}

const props = defineProps<Props>();

const collaborations = await getGroupCollaborations(props.groupId);
const members = await useCollaborationMembers(props.groupId, props.collaborationId);
const { i18n } = await useI18n();
const user = useAuth();

const tab = ref('view');
const showGivers = ref(false);

const title = computed(() => {
    return collaborations.value?.find((c) => c.Id === props.collaborationId)?.Title;
});

const isGroupMember = computed(() => members.value?.some((m) => m.UserId === user.value?.id));
</script>

<template>
    <div>
        <Tabs v-if="isGroupMember" v-model="tab" class="mb-4">
            <Tab name="view">
                <Localized tkey="Wishes" />
            </Tab>
            <Tab name="edit">
                <Localized tkey="Edit" />
            </Tab>
        </Tabs>

        <TabPanels v-model="tab">
            <TabPanel name="view">
                <div v-if="!isGroupMember" class="flex items-center justify-end pb-4 gap-3">
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
                    :group-id="groupId"
                    :collaboration-id="collaborationId"
                    :show-givers="isGroupMember ? false : showGivers === true"
                />
            </TabPanel>
            <TabPanel v-if="isGroupMember" name="edit" class="p-3">
                <div class="flex items-center justify-end pb-4">
                    <GroupCollaborationDeleteButton :group-id="groupId" :collaboration-id="collaborationId" />
                </div>

                <div class="flex flex-col gap-2">
                    <GroupCurrentUserWishes :group-id="groupId" :collaboration-id="collaborationId" />
                </div>
            </TabPanel>
        </TabPanels>
    </div>
</template>
