<script setup lang="ts">
import { ref } from 'vue'
import ImageUploader from './components/ImageUploader.vue'
import ConversionPreview from './components/ConversionPreview.vue'
import ImageMetadata from './components/ImageMetadata.vue'
import Header from './components/Header.vue'
import Features from './components/Features.vue'
import Footer from './components/Footer.vue'
import { useImageConversion } from './composables/useImageConversion'
import type { ConversionResult, ExportFormat, ProcessingMode } from './types'
import { convertSvgToEps } from './utils/imageProcessing'

const currentImage = ref<File | null>(null)
const conversionResult = ref<ConversionResult | null>(null)
const error = ref<string | null>(null)
const processingMode = ref<ProcessingMode>('vectorize')

const { isConverting, convertImage } = useImageConversion()

const handleImageUpload = async (file: File) => {
  currentImage.value = file
  error.value = null

  if (processingMode.value === 'vectorize') {
    if (isConverting.value) return
    const result = await convertImage(file)
    if (result) {
      conversionResult.value = result
    }
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
          Transform Your Images
        </h1>

        <p class="text-xl text-slate-300 mb-12">
          Choose how you want to process your image - convert to vector or analyze metadata.
        </p>

        <!-- Mode Selection -->
        <div class="glass-card p-8 mb-8">
          <div class="flex gap-4 mb-8">
            <button @click="processingMode = 'vectorize'" :class="[
              'px-6 py-3 rounded-lg font-medium transition-all',
              processingMode === 'vectorize'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            ]">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Vectorize
              </div>
            </button>
            <button @click="processingMode = 'metadata'" :class="[
              'px-6 py-3 rounded-lg font-medium transition-all',
              processingMode === 'metadata'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            ]">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Metadata
              </div>
            </button>
          </div>

          <div v-if="error" class="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {{ error }}
          </div>

          <ImageUploader @upload="handleImageUpload" @error="handleError" />
        </div>

        <!-- Results -->
        <ConversionPreview v-if="currentImage && processingMode === 'vectorize'" :original-image="currentImage"
          :conversion-result="conversionResult" @download="handleDownload" />

        <ImageMetadata v-if="currentImage && processingMode === 'metadata'" :file="currentImage" />
      </div>

      <Features :mode="processingMode" />
    </main>

    <Footer />
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