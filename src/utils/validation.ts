import { MAX_FILE_SIZE, VALID_IMAGE_TYPES } from './constants'

export function validateImageFile(file: File): void {
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a PNG, JPG, or GIF.')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit.')
  }
}