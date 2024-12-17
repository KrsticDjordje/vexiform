import { ref } from 'vue'
import { createObjectURL } from '../utils/imageProcessing'

export function useImageConversion() {
  const error = ref<string | null>(null)

  const handleError = (message: string) => {
    error.value = message
  }

  return {
    error,
    handleError,
    createObjectURL
  }
}