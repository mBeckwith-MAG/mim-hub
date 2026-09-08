<template>
  <div
    class="justify-center text-center truncate border border-brdr rounded-2xl hover:border-mid p-sm"
  >
    <a :href="attachment">
      <Icon icon="meteor-icons:file" width="2em" class="w-full" />
      <small>{{ label }}</small>
    </a>
  </div>
</template>
<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

const props = defineProps<{
  attachment: string;
}>();

const label = computed(() => {
  return props.attachment.split('/').pop();
});
</script>
