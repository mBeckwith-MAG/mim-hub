<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 flex justify-between bg-dark items-center z-50',
      { 'shadowed border-b border-dark': shadowed },
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
