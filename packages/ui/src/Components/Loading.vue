<template>
  <div clas="flex justify-center gap-sm w-full">
    <Icon icon="line-md:loading-loop" width="4em" />
    <div v-if="hasLabel">Loading</div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

withDefaults(
  defineProps<{
    hasLabel?: boolean;
  }>(),
  {
    hasLabel: false,
  }
);
</script>
