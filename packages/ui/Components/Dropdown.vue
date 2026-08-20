<template>
  <div class="grid gap-2">
    <label for="inventory-store-list">Choose a Store</label>
    <select
      name="selected-store"
      id="inventory-store-list"
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
    options: Array<string>
    name: string
}>()
</script>