<script setup lang="ts">
interface Props {
    groupId: string;
    selectedCollaborationId: string | null;
}

interface Emits {
    (event: 'update:selectedCollaborationId', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const collaborations = await getGroupCollaborations(props.groupId);

const handleCollaborationClicked = (collaborationId: string) => {
    emit('update:selectedCollaborationId', collaborationId);
};
</script>

<template>
    <div>
        <SelectionButton
            v-for="collaboration in collaborations"
            :key="collaboration.Id"
            :selected="selectedCollaborationId === collaboration.Id"
            @click="() => handleCollaborationClicked(collaboration.Id)"
        >
            <template #avatar>
                <EmojiAvatar :color="collaboration.AvatarColour || '#339DD7'">
                    {{ collaboration.AvatarEmoji || '🤝' }}
                </EmojiAvatar>
            </template>

            <template #label>
                {{ collaboration.Title }}
            </template>
        </SelectionButton>
    </div>
</template>
