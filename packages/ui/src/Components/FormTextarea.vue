<template>
  <div class="relative mt-6">
    <textarea
      :id="`${name}-form-notes`"
      :disabled="!canEdit"
      v-model="model"
      rows="4"
      class="peer w-full pt-2x pb-2 px-sm border-b border-brdr text-txt placeholder-transparent focus:outline-none focus:border-sky-500 resize-none overflow-y-auto scrollbar-thin scrollbar-track-light scrollbar-thumb-mid hover:scrollbar-thumb-dark [&::-webkit-scrollbar-corner]:bg-transparent disabled:text-dark dark:disabled:text-faint text-xs"
    ></textarea>
    <label
      :for="`${name}-form-notes`"
      class="absolute left-0 top-0 text-txt text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-txt peer-placeholder-shown:top-0 peer-focus:top-0 peer-focus:text-sky-500 peer-focus:text-sm peer-focus:translate-x-4 pointer-events-none"
    >
      <slot />
    </label>
  </div>
</template>
<script setup lang="ts">
const model = defineModel<string>();

withDefaults(
  defineProps<{
    name: string;
    canEdit?: boolean;
  }>(),
  {
    canEdit: false,
  }
);
</script>
