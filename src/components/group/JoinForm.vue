<script setup lang="ts"></script>

<template>
    <div class="flex flex-col gap-3">
        <Localized class="text-sm opacity-60" tkey="JoinGroupExplanation" />
        <Input :label="i18n('InviteCode')" />
    </div>
</template>
