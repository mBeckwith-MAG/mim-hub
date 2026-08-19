<template>
  <small :class="['badge', { 'flex justify-between': closable, 'text-center': !closable }]">
    <slot />
    <CloseIcon v-if="closable" width="1em" />
  </small>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    closable?: boolean
  }>(),
  {
    closable: false,
  },
)
</script>
