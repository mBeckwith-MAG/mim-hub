<template>
  <Grid :rows="2" class="gap-md p-md">
    <Grid :cols="showPayoff ? 3 : 2" class="gap-md">
      <slot name="top-row" />
    </Grid>
    <Grid :cols="2" class="gap-md">
      <slot name="bottom-row" />
    </Grid>
  </Grid>
</template>
<script setup lang="ts">
import { Grid } from '@mim-workspace/ui';

defineProps({
  showPayoff: {
    type: Boolean,
    default: false,
  },
});
</script>
