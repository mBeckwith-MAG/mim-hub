<template>
  <div
    class="flex flex-col bg-light border-t border-l border-mid rounded-2xl p-4 shadowed h-full w-full"
  >
    <div
      v-if="$slots.title"
      class="flex justify-between items-center mb-4 w-full"
    >
      <slot name="title" />
    </div>

    <div v-if="$slots.body" class="flex-grow">
      <hr v-if="separated" class="opacity-10 my-3.5" />
      <slot name="body" />
    </div>

    <div v-if="$slots.footer" class="w-full mt-auto">
      <hr v-if="separated" class="opacity-10 my-3.5" />
      <div class="flex justify-between gap-lg">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  separated?: boolean;
}

withDefaults(defineProps<Props>(), {
  separated: false,
});
</script>
