<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import ImageMetadata from './ImageMetadata.vue'
import type { ProcessingMode } from '../types'
import { createObjectURL, revokeObjectURL } from '../utils/imageProcessing'

const props = defineProps<{
  originalImage: File
  processingMode: ProcessingMode
}>()

const originalPreview = ref('')

watch(() => props.originalImage, (file) => {
  if (originalPreview.value) {
    revokeObjectURL(originalPreview.value)
  }
  if (file) {
    originalPreview.value = createObjectURL(file)
  }
}, { immediate: true })

onUnmounted(() => {
  if (originalPreview.value) {
    revokeObjectURL(originalPreview.value)
  }
})
</script>

<template>
  <div class="glass-card p-8">
    <h2 class="text-2xl font-bold mb-6">Image Analysis</h2>

    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-lg font-medium mb-4">Original</h3>
        <div class="aspect-square rounded-lg overflow-hidden bg-slate-800">
          <img v-if="originalPreview" :src="originalPreview" class="w-full h-full object-contain" alt="Original image">
        </div>
      </div>

      <div>
        <ImageMetadata :file="originalImage" />
      </div>
    </div>
  </div>
</template>