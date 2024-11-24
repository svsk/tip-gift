<script setup lang="ts">
import { type WishUser } from '@prisma-app/client';

interface Props {
    groupId: string;
}

const props = defineProps<Props>();

const groups = await useGroups();

const tab = ref('user');

const group = computed(() => groups.value?.find((g) => g.Id === props.groupId));

const showAddUserDialog = ref(false);

const isAdmin = computed(() => isGroupAdmin(group.value));

const handleAddUserClicked = () => {
    showAddUserDialog.value = true;
};

watch(
    () => isAdmin.value,
    () => {
        if (!isAdmin.value) {
            tab.value = 'collaboration';
        }
    },
    { immediate: true }
);
</script>

<template>
    <div>
        <button
            v-ripple
            class="ml-3 relative rounded-full min-h-[42px] min-w-[42px] bg-slate-700 text-white flex items-center justify-center"
            @click="handleAddUserClicked"
        >
            <Icon font-size="24px" name="add" />
        </button>

        <Dialog v-model="showAddUserDialog">
            <template #title>
                <Localized tkey="AddNew" />
            </template>

            <Tabs v-model="tab">
                <Tab v-if="isAdmin" name="user">
                    <Localized tkey="User" />
                </Tab>

                <Tab name="collaboration">
                    <Localized tkey="Collaboration" />
                </Tab>
            </Tabs>

            <div class="pt-4">
                <TabPanels v-model="tab">
                    <TabPanel name="user">
                        <AddUserForm :group-id="groupId" />

                        <div class="flex justify-end gap-2 pt-3">
                            <Button flat @click="showAddUserDialog = false">
                                <Localized tkey="Close" />
                            </Button>
                        </div>
                    </TabPanel>

                    <TabPanel name="collaboration">
                        <GroupCollaborationAddForm :group-id="groupId" @confirmed="showAddUserDialog = false">
                            <template #actions>
                                <div class="flex justify-end gap-2 pt-3">
                                    <Button flat @click="showAddUserDialog = false">
                                        <Localized tkey="Close" />
                                    </Button>

                                    <Button type="submit">
                                        <Localized tkey="Confirm" />
                                    </Button>
                                </div>
                            </template>
                        </GroupCollaborationAddForm>
                    </TabPanel>
                </TabPanels>
            </div>
        </Dialog>
    </div>
</template>
