<template>
  <div class="grid grid-rows-2 gap-md p-md">
    <div
      :class="['grid lg:grid-cols-2 gap-md', { 'lg:grid-cols-3': showPayoff }]"
    >
      <slot name="top-row" />
    </div>
    <div class="grid lg:grid-cols-2 gap-md">
      <slot name="bottom-row" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  showPayoff: {
    type: Boolean,
    default: false,
  },
});
</script>
