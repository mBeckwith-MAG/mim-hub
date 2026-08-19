<template>
  <a :href="attachment" class="grid gap-sm border border-border rounded-2xl p-lg text-center">
    <Icon icon="meteor-icons:file" width="2em" />
    <small>{{ label }}</small>
  </a>
</template>
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = defineProps<{
  attachment: string
}>()

const label = computed(() => {
  console.log('attach', props.attachment)
  return props.attachment.split('/').pop()
})
</script>