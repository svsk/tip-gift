<script setup lang="ts">
import { Wish } from '@prisma/client';

interface Props {
    entry: Partial<Wish>;
}

defineProps<Props>();
</script>

<template>
    <div class="flex justify-between items-center flex-nowrap text-lg gap-2">
        <div class="flex-grow flex items-center gap-3">
            <div class="self-start flex items-center justify-center w-[75px] h-[75px] rounded bg-white">
                <img v-if="entry.ImageUrl" class="rounded max-w-[75px] max-h-[75px]" :src="entry.ImageUrl" />
                <div v-else class="flex items-center justify-center text-4xl text-gray-400 select-none">?</div>
            </div>

            <div>
                <div class="text-base line-clamp-2">
                    {{ entry.Name }}
                </div>
                <div class="text-xs max-w-[450px] line-clamp-3">
                    {{ entry.Description }}
                </div>
            </div>
        </div>
    </div>
</template>
