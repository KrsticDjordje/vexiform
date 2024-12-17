<script setup lang="ts">
import type { Feature } from '../types'

const features: Feature[] = [
  {
    title: 'AI-Powered Conversion',
    description: 'Advanced machine learning algorithms ensure accurate vector conversion while preserving image quality.',
    icon: '🤖'
  },
  {
    title: 'Real-time Preview',
    description: 'See your vexiform image instantly with our live preview feature.',
    icon: '👁️'
  },
  {
    title: 'Multiple Export Formats',
    description: 'Export your vectors in SVG, AI, EPS, or PDF formats.',
    icon: '💾'
  },
  {
    title: 'Batch Processing',
    description: 'Convert multiple images at once to save time.',
    icon: '⚡'
  }
]
</script>

<template>
  <section class="py-20">
    <h2 class="text-3xl font-bold text-center mb-12">Why Choose Our Tool?</h2>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="feature in features" :key="feature.title" class="glass-card p-6 text-center">
        <div class="text-4xl mb-4">{{ feature.icon }}</div>
        <h3 class="text-xl font-bold mb-2">{{ feature.title }}</h3>
        <p class="text-slate-400">{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>