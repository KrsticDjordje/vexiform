<script setup lang="ts">
import { useFileUpload } from '../composables/useFileUpload'

const emit = defineEmits<{
  (e: 'upload', file: File): void
  (e: 'error', message: string): void
}>()

const { dragActive, validateFile } = useFileUpload()

const handleFile = (file: File) => {
  try {
    validateFile(file)
    emit('upload', file)
  } catch (e) {
    emit('error', e instanceof Error ? e.message : 'Invalid file')
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  dragActive.value = false
  
  if (e.dataTransfer?.files.length) {
    handleFile(e.dataTransfer.files[0])
  }
}

const handleFileInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    handleFile(input.files[0])
  }
}
</script>

<template>
  <div
    class="relative border-2 border-dashed border-slate-700 rounded-xl p-12 text-center"
    :class="{ 'border-cyan-500': dragActive }"
    @dragenter.prevent="dragActive = true"
    @dragleave.prevent="dragActive = false"
    @dragover.prevent
    @drop="handleDrop"
  >
    <input
      type="file"
      accept="image/*"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      @change="handleFileInput"
    >
    
    <div class="space-y-4">
      <svg class="w-16 h-16 mx-auto text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
      
      <div>
        <p class="text-xl font-medium mb-2">Drop your image here</p>
        <p class="text-slate-400">or click to browse</p>
      </div>
      
      <p class="text-sm text-slate-500">
        Supports PNG, JPG, GIF up to 10MB
      </p>
    </div>
  </div>
</template>