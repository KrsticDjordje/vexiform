<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import Button from './ui/Button.vue'
import type { ConversionResult, ExportFormat } from '../types'
import { createObjectURL, revokeObjectURL } from '../utils/imageProcessing'

const props = defineProps<{
  originalImage: File
  conversionResult: ConversionResult | null
}>()

const emit = defineEmits<{
  (e: 'download', format: ExportFormat): void
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
    <h2 class="text-2xl font-bold mb-6">Preview</h2>

    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-lg font-medium mb-4">Original</h3>
        <div class="aspect-square rounded-lg overflow-hidden bg-slate-800">
          <img v-if="originalPreview" :src="originalPreview" class="w-full h-full object-contain" alt="Original image">
        </div>
      </div>

      <div>
        <h3 class="text-lg font-medium mb-4">Vexiform</h3>
        <div class="aspect-square rounded-lg overflow-hidden bg-slate-800">
          <div v-if="conversionResult?.svg" class="w-full h-full flex items-center justify-center bg-white">
            <div v-html="conversionResult.svg" class="w-full h-full"></div>
          </div>
          <div v-else class="w-full h-full flex items-center justify-center text-slate-500">
            <div class="animate-spin mr-2">⚡</div>
            Processing...
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex gap-4">
      <Button variant="primary" :disabled="!conversionResult?.svg" @click="$emit('download', 'svg')">
        Download SVG
      </Button>
      <Button variant="secondary" :disabled="!conversionResult?.svg" @click="$emit('download', 'eps')">
        Download EPS
      </Button>
    </div>
  </div>
</template>