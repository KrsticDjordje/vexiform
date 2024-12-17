<script setup lang="ts">
import { computed } from 'vue'
import type { Feature } from '../types'

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
    description: 'Get detailed information about image format and quality',
    icon: '📊'
  },
  {
    title: 'Location Data',
    description: 'Access GPS coordinates and location information',
    icon: '📍'
  },
  {
    title: 'Technical Details',
    description: 'View advanced technical specifications',
    icon: '⚙️'
  },
  {
    title: 'Real-time Analysis',
    description: 'Instant metadata extraction and display',
    icon: '⚡'
  }
]

const features = computed(() => metadataFeatures)
</script>

<template>
  <section class="py-12">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-4">
        Metadata Analysis Features
      </h2>
      <p class="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
        Discover everything about your images with our comprehensive metadata analysis tools
      </p>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="feature in features" :key="feature.title"
          class="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
          <div class="text-4xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-xl font-bold mb-2">{{ feature.title }}</h3>
          <p class="text-slate-400">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>