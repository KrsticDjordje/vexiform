import { ref } from 'vue'
import type { ConversionResult } from '../types'
import { processImage, convertToSvg, createObjectURL } from '../utils/imageProcessing'

export function useImageConversion() {
  const isConverting = ref(false)
  const error = ref<string | null>(null)

  const convertImage = async (file: File): Promise<ConversionResult | null> => {
    isConverting.value = true
    error.value = null

    try {
      const svgData = await processImage(file)
      const svg = await convertToSvg(svgData)

      return {
        svg,
        previewUrl: createObjectURL(file)
      }
    } catch (e) {
      console.error('Conversion error:', e)
      error.value = e instanceof Error ? e.message : 'Failed to convert image'
      return null
    } finally {
      isConverting.value = false
    }
  }

  return {
    isConverting,
    error,
    convertImage
  }
}