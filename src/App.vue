<script setup lang="ts">
import { ref } from 'vue'
import ImageUploader from './components/ImageUploader.vue'
import ConversionPreview from './components/ConversionPreview.vue'
import Header from './components/Header.vue'
import Features from './components/Features.vue'
import { useImageConversion } from './composables/useImageConversion'
import type { ConversionResult, ExportFormat } from './types'
import { convertSvgToEps } from './utils/imageProcessing'

const currentImage = ref<File | null>(null)
const conversionResult = ref<ConversionResult | null>(null)
const error = ref<string | null>(null)

const { isConverting, convertImage } = useImageConversion()

const handleImageUpload = async (file: File) => {
  currentImage.value = file
  error.value = null
  if (isConverting.value) return
  const result = await convertImage(file)
  if (result) {
    conversionResult.value = result
  }
}

const handleError = (message: string) => {
  error.value = message
}

const handleDownload = async (format: ExportFormat) => {
  if (!conversionResult.value?.svg) return

  let content = conversionResult.value.svg
  let mimeType = 'image/svg+xml'
  let extension = format

  if (format === 'eps') {
    content = convertSvgToEps(content)
    mimeType = 'application/postscript'
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `converted.${extension}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="min-h-screen bg-slate-900">
    <Header />

    <main class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
          Transform Your Images into Scalable Vectors
        </h1>

        <p class="text-xl text-slate-300 mb-12">
          Convert your raster images into clean, scalable vector graphics with our advanced AI-powered tool.
        </p>

        <div v-if="error" class="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {{ error }}
        </div>

        <div class="glass-card p-8 mb-12">
          <ImageUploader @upload="handleImageUpload" @error="handleError" />
        </div>

        <ConversionPreview v-if="currentImage" :original-image="currentImage" :conversion-result="conversionResult"
          @download="handleDownload" />
      </div>

      <Features />
    </main>
  </div>
</template>

<style>
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
}
</style>