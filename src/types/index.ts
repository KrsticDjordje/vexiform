export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface ConversionResult {
  svg: string;
  previewUrl: string;
}

export type ExportFormat = 'svg' | 'eps';