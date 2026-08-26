<template>
  <div class="grid gap-2">
    <label :for="`${name}-list`">
      <slot />
    </label>
    <select
      :name="`selected-${name}`"
      :id="`${name}-list`"
      v-model="model"
    >
      <option v-for="(option, index) in options" :key="`${name}-option-${index}`">
        {{ option }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
const model = defineModel()

defineProps<{
    options: Array<string> | Set<string>
    name: string
}>()
</script>