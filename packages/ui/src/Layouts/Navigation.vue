<template>
  <nav
    :class="[
      'flex justify-between bg-mid items-center z-50',
      { 'shadow-md shadow-mid border-b border-dark': shadowed },
    ]"
  >
    <div class="text-4xl font-thin">
      <div v-if="$slots.left">
        <slot name="left" />
      </div>
      <div v-else />
    </div>

    <div>
      <div v-if="$slots.center">
        <slot name="center" />
      </div>
      <div v-else />
    </div>

    <div>
      <div v-if="$slots.right">
        <slot name="right" />
      </div>
      <div v-else />
    </div>
  </nav>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    shadowed?: boolean;
  }>(),
  {
    shadowed: false,
  }
);
</script>
