<script setup lang="ts">
import type { WishPurchaseWish } from '~/prisma/customTypes';

const { data: purchases } = await useMyWishPurchases();
</script>

<template>
    <div class="flex flex-col w-full">
        <TransitionGroup name="growSlow">
            <NuxtLink
                v-for="purchase in purchases"
                v-ripple
                :key="purchase.Id"
                class="border-t first:border-t-0 py-2 flex flex-row items-center flex-nowrap gap-3 w-full justify-between relative rounded border-slate-600"
                :to="`/my/checklist/${purchase.Id}`"
            >
                <User :user-id="purchase.WishOwnerId" without-username class="ml-1" />

                <div class="flex flex-col flex-1 gap-1 text-sm">
                    <div class="line-clamp-2">
                        {{ purchase.Name }}
                    </div>

                    <WishPurchaseProgress :wish-purchase="purchase" />
                </div>

                <div>
                    <Button round flat>
                        <Icon font-size="24px" name="navigate_next" />
                    </Button>
                </div>
            </NuxtLink>
        </TransitionGroup>
    </div>
</template>
