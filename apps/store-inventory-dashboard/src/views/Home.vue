<template>
  <Navigation class="py-2 px-4">
    <template #left>MIM Hub</template>
    <template #right>
      <RouterLink class="btn secondary outlined" to="/inventory"
        >Inventory</RouterLink
      >
    </template>
  </Navigation>
  <div class="mt-60 text-center text-2xl font-thin">
    Select a link from above to get started
  </div>
</template>
<script setup lang="ts">
import Navigation from '@mim-workspace/ui/Layouts/Navigation.vue';
</script>
