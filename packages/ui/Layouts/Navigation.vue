<template>
  <nav>
    <div class="title">
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
