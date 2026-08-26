<template>
  <Container>
    <p class="text-2xl font-thin font-stretch-semi-expanded">My Assigned Items</p>
    <Loading v-if="loading" hasLabel />

    <!-- <ItemDisplay v-else v-for="item in assignedItems" :item :key="item.id" /> -->
  </Container>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Container, Loading } from '@mim-workspace/ui'

const loading = ref(false)
</script>
