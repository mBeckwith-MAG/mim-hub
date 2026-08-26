<template>
  <small
    :class="[
      'badge',
      {
        'flex justify-between items-center': closable,
        'text-center': !closable,
      },
    ]"
  >
    <slot />
    <Icon
      icon="fontisto:close"
      v-if="closable"
      width="1em"
      @click="$emit('remove-badge')"
      class="cursor-pointer"
    />
  </small>
</template>
<script setup lang="ts">
import { Icon } from '@iconify/vue';

const props = withDefaults(
  defineProps<{
    closable?: boolean;
  }>(),
  {
    closable: false,
  }
);
</script>
