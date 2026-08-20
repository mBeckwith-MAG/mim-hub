<template>
    <div clas="flex gap-2">
        <Icon icon="line-md:loading-loop" width="4em" />
        <div v-if="hasLabel">Loading</div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

withDefaults(defineProps<{
    hasLabel?: boolean
}>(), {
    hasLabel: false
})
</script>