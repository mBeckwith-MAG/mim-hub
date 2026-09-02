<template>
  <div class="text-center">
    <div class="truncate">{{ value }}</div>
    <small>{{ label.toUpperCase() }}</small>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: string;
}>();
</script>
