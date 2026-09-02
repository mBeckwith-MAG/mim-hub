<template>
  <label
    for="dropzone-file"
    :class="[
      'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors px-4 text-center duration-400',
      isDragging
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
        : 'border-mid bg-light hover:bg-mid hover:border-light',
    ]"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <div class="flex flex-col items-center justify-center py-4">
      <svg
        :class="[
          'w-8 h-8 mb-2 transition-colors',
          isDragging ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400',
        ]"
        aria-hidden="true"
        xmlns="http://w3.org"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        <span class="font-semibold">Click to upload multiple files</span> or
        drag and drop
      </p>
    </div>
    <input
      id="dropzone-file"
      type="file"
      multiple
      class="hidden"
      @change="handleFileChange"
    />
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'files-selected', files: File[]): void;
}>();

const isDragging = ref(false);

const emitFiles = (rawFiles: FileList | null) => {
  if (!rawFiles) return;
  emit('files-selected', Array.from(rawFiles));
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target && target.files) {
    emitFiles(target.files);
  }
  target.value = '';
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e && e.dataTransfer) {
    emitFiles(e.dataTransfer.files);
  }
};
</script>
