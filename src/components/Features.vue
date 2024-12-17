<script setup lang="ts">
import { computed } from 'vue'
import type { Feature, ProcessingMode } from '../types'

const props = defineProps<{
  mode: ProcessingMode
}>()

const vectorFeatures: Feature[] = [
  {
    title: 'Smart Vectorization',
    description: 'Advanced AI-powered algorithms for precise vector conversion',
    icon: '⚡'
  },
  {
    title: 'Multiple Formats',
    description: 'Export your vectors in SVG and EPS formats',
    icon: '📦'
  },
  {
    title: 'Color Preservation',
    description: 'Maintains original color fidelity in vector output',
    icon: '🎨'
  }
]

const metadataFeatures: Feature[] = [
  {
    title: 'Detailed Analysis',
    description: 'Extract comprehensive metadata from your images',
    icon: '🔍'
  },
  {
    title: 'EXIF Support',
    description: 'View camera settings, date, and other EXIF data',
    icon: '📷'
  },
  {
    title: 'Format Info',
    description: 'Get detailed information about image format and encoding',
    icon: '📊'
  }
]

const features = computed(() =>
  props.mode === 'vectorize' ? vectorFeatures : metadataFeatures
)
</script>

<template>
  <section class="py-12">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">
        {{ mode === 'vectorize' ? 'Vector Conversion Features' : 'Metadata Analysis Features' }}
      </h2>

      <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div v-for="feature in features" :key="feature.title" class="glass-card p-6 rounded-xl text-center">
          <div class="text-4xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-xl font-bold mb-2">{{ feature.title }}</h3>
          <p class="text-slate-400">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>