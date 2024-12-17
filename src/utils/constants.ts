export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif']

export const FEATURES = [
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
] as const