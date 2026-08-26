<template>
  <div class="card">
    <div v-if="$slots.title" class="title">
      <slot name="title" />
    </div>
    <div v-if="$slots.body" class="body">
      <hr v-if="separated" class="opacity-10 my-3.5" />
      <slot name="body" />
    </div>
    <div v-if="$slots.footer" class="footer">
      <hr v-if="separated" class="opacity-10 my-3.5" />
      <slot name="footer" />
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  separated?: boolean
}>(), {
  separated: false
})
</script>