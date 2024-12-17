import { ref } from 'vue'

export function useFileUpload() {
  const dragActive = ref(false)

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PNG, JPG, or GIF.')
    }

    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit.')
    }

    return true
  }

  return {
    dragActive,
    validateFile
  }
}