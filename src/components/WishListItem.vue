<script setup lang="ts">
import { type Wish } from '@prisma-app/client';

interface Props {
    entry: Partial<Wish>;
}

defineProps<Props>();
</script>

<template>
    <div class="flex justify-between items-center flex-nowrap text-lg gap-2">
        <div class="flex-grow flex items-center gap-3">
            <div class="self-start flex items-center justify-center">
                <WishImage :src="entry.ImageUrl" class="w-[75px] h-[75px]" />
            </div>

            <a class="cursor-pointer hover:underline flex flex-col gap-1" :href="entry.Link || '#'" target="_blank">
                <div class="flex items-center justify-between gap-1">
                    <div class="text-sm md:text-base line-clamp-3">
                        {{ entry.Name }}
                    </div>
                </div>

                <div class="text-xs max-w-[450px] md:line-clamp-3 hidden">
                    {{ entry.Description }}
                </div>

                <Badge v-if="entry.Price" class="md:hidden self-start mt-1">Kr. {{ entry.Price }},-</Badge>
            </a>
        </div>

        <Badge v-if="entry.Price" class="hidden md:inline-block">Kr. {{ entry.Price }},-</Badge>
    </div>
</template>
