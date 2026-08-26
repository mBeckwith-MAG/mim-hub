<template>
  <div :class="['grid gap-md p-sm', styles, { 'md:grid-cols-2': cols > 1 }]">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    cols?: number;
    rows?: number;
  }>(),
  {
    cols: 1,
    rows: 1,
  }
);

const styles = computed(() => {
  return `lg:grid-cols-${props.cols} lg:grid-rows-${props.rows}`;
});
</script>
