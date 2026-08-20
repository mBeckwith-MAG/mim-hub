<template>
    <div class="text-center">
        <div class="truncate">{{ value }}</div>
        <small>{{ label.toUpperCase() }}</small>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
    k: string
    value: string
}>()

const label = computed(() => {
    return props.k.split('_').join(' ')
})
</script>