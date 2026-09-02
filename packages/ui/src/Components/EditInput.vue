<template>
  <div v-if="!edit" class="text-center cursor-pointer" @click="edit = true">
    <div class="truncate">{{ originalValue }}</div>
    <small>{{ displayName.toUpperCase() }}</small>
  </div>
  <div v-else>
    <label :for="`form-input-${name}`">{{ displayName }}</label>
    <input
      :type="inputType"
      :id="`form-input-${name}`"
      v-model="model"
      @blur="edit = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
const model = defineModel();

const edit = ref(false);

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    default: 'text',
  },
  originalValue: {
    type: String,
    required: true,
  },
});

const displayName = computed(() => {
  const words: Array<String> = props.name.split(/(?=[A-Z])/);
  return words
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
});
</script>
