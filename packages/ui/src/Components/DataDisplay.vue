<template>
  <div class="text-center">
    <small>{{ label.toUpperCase() }}</small>
    <div class="truncate">{{ value }}</div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: string;
}>();
</script>
