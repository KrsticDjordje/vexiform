<script setup lang="ts">
import { ref } from 'vue'
import ImageUploader from './components/ImageUploader.vue'
import ConversionPreview from './components/ConversionPreview.vue'
import Header from './components/Header.vue'
import Features from './components/Features.vue'
import Footer from './components/Footer.vue'
import type { ProcessingMode } from './types'

const currentImage = ref<File | null>(null)
const error = ref<string | null>(null)
const processingMode = ref<ProcessingMode>('metadata')

const handleImageUpload = async (file: File) => {
  currentImage.value = file
  error.value = null
}

const handleError = (message: string) => {
  error.value = message
}

</script>

<template>
  <div class="min-h-screen bg-slate-900">
    <Header />

    <main class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
          Analyze Your Images
        </h1>

        <p class="text-xl text-slate-300 mb-12">
          Extract and analyze detailed metadata from your images.
        </p>

        <div class="glass-card p-8 mb-8">
          <ImageUploader @upload="handleImageUpload" @error="handleError" />
        </div>

        <ConversionPreview v-if="currentImage" :original-image="currentImage" :processing-mode="processingMode" />

        <Features :mode="processingMode" />
      </div>
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