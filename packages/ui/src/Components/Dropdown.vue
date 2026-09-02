<template>
  <div class="relative mt-6">
    <select
      :name="`selected-${name}`"
      :id="`${name}-list`"
      v-model="model"
      :required
      class="peer h-10 w-full border-b border-brdr text-txt bg-light focus:outline-none focus:border-sky-500 appearance-none p-sm"
    >
      <option value="" disabled selected hidden></option>
      <option
        v-for="(option, index) in options"
        :key="`${name}-option-${index}`"
      >
        {{ option }}
      </option>
    </select>

    <label
      :for="`${name}-list`"
      :class="[
        'absolute left-0 -top-2.5 text-txt text-sm ps-sm transition-all translate-y-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-txt peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-500 peer-focus:text-sm peer-focus:-translate-y-2 peer-valid:-top-3.5 peer-valid:text-sm pointer-events-none',
        [forceLabel ? 'peer-valid:-translate-y-2' : 'peer-valid:hidden'],
      ]"
    >
      <slot />
    </label>
  </div>
</template>
<script setup lang="ts">
const model = defineModel();

withDefaults(
  defineProps<{
    options: Array<string> | Set<string>;
    name: string;
    forceLabel?: boolean;
    required?: boolean;
  }>(),
  {
    forceLabel: false,
    required: false,
  }
);
</script>
