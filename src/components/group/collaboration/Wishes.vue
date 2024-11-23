<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    groupId: string;
    collaborationId: string;
    showGivers?: boolean;
}

const props = defineProps<Props>();

const collaborations = await getGroupCollaborations(props.groupId);

const tab = ref('view');

const title = computed(() => {
    return collaborations.value?.find((c) => c.Id === props.collaborationId)?.Title;
});

const isMember = true;
</script>

<template>
    <div>
        <Tabs v-model="tab">
            <Tab name="edit">
                <Localized tkey="Edit" />
            </Tab>
            <Tab name="view">
                <Localized tkey="Wishes" />
            </Tab>
        </Tabs>

        <TabPanels v-model="tab">
            <TabPanel name="edit" class="p-3">
                <GroupCurrentUserWishes :group-id="groupId" :collaboration-id="collaborationId" />
            </TabPanel>
            <TabPanel name="view" class="p-3">
                <GroupOtherMemberWishes
                    :group-id="groupId"
                    :collaboration-id="collaborationId"
                    :show-givers="isMember ? false : showGivers === true"
                />
            </TabPanel>
        </TabPanels>
    </div>
</template>
