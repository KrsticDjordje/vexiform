<script setup lang="ts">
</script>

<template>
  <header class="py-6 px-4 backdrop-blur-lg border-b border-slate-800">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center gap-2">
        <svg class="w-8 h-8 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span class="text-xl font-bold">Vexiform</span>
      </div>

      <nav class="hidden md:flex gap-8">
        <a href="#features" class="text-slate-300 hover:text-white transition-colors">Features</a>
        <a href="#how-it-works" class="text-slate-300 hover:text-white transition-colors">How it Works</a>
        <a href="#pricing" class="text-slate-300 hover:text-white transition-colors">Pricing</a>
      </nav>

      <button class="neo-button px-6 py-2 text-cyan-400 font-medium">
        Get Started
      </button>
    </div>
  </header>
</template>