<script setup lang="ts">
import type { WishPurchaseWish } from '~/prisma/customTypes';

interface Props {
    wishPurchase: WishPurchaseWish;
}

const props = defineProps<Props>();

const item = computed(() => props.wishPurchase);

const className = computed(
    () => 'absolute text-[140px] leading-[1em] h-[140px] w-[140px] flex items-center justify-center'
);
</script>

<template>
    <div class="w-full relative h-[170px] flex flex-col justify-end items-center">
        <div class="absolute z-10 w-full flex items-center justify-center top-[60px]">
            <TransitionGroup name="slidePast">
                <div key="5" v-if="item.GivenDate" :class="className">❣️</div>
                <div key="4" v-if="item.WrappedDate && !item.GivenDate" :class="className">🎁</div>
                <div key="3" v-if="item.ShipmentReceivedDate && !item.WrappedDate" :class="className">
                    <img
                        v-if="item.ImageUrl"
                        alt="🚲"
                        class="absolute z-10 w-full h-full object-cover"
                        :src="item?.ImageUrl"
                    />
                    <span v-else>🚲</span>
                </div>
                <div key="2" v-if="item.PurchasedDate && !item.ShipmentReceivedDate" :class="className">📦</div>
                <div key="1" v-if="!item.PurchasedDate" :class="className">🛍️</div>
            </TransitionGroup>
        </div>

        <!-- make sure the svg doesn't go outside the page -->
        <div class="w-full flex items-center justify-center">
            <svg style="width: 100%; opacity: 0.4; max-width: 400px; height: 75px">
                <!-- create oval ellipse that doesn't stretch beyond the size of the parent svg -->
                <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="gray" />
            </svg>
        </div>
    </div>
</template>
