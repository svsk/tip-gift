<script setup lang="ts">
interface Props {
    groupId: string;
}

const props = defineProps<Props>();

const handleAddClicked = () => {
    createGroupCollaboration(props.groupId, 'Fat collab 2024');
};
</script>

<template>
    <Button @click="handleAddClicked"> Add collaboration </Button>
</template>
