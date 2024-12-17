<script setup lang="ts">
import { ref, watch } from 'vue'

interface ImageMetadata {
    // Osnovni podaci o fajlu
    fileName: string
    fileSize: string
    fileType: string
    mimeType: string
    lastModified: string
    created: string

    // Dimenzije i karakteristike slike
    dimensions: string
    width: string
    height: string
    aspectRatio: string
    colorSpace: string
    orientation: string
    resolution?: string
    colorDepth?: string

    // Fotografski podaci
    camera?: string
    make?: string
    model?: string
    software?: string
    lens?: string
    copyright?: string
    artist?: string

    // Parametri fotografisanja
    exposureTime?: string
    aperture?: string
    iso?: string
    focalLength?: string
    flash?: string
    meteringMode?: string
    whiteBalance?: string
    exposureProgram?: string
    exposureCompensation?: string
    focusMode?: string
    digitalZoom?: string
    shootingMode?: string

    // GPS podaci
    gpsLatitude?: string
    gpsLongitude?: string
    gpsAltitude?: string
    gpsTimestamp?: string
    gpsDirection?: string
    locationName?: string

    // Tehnički detalji
    bitsPerSample?: string
    compression: string
    category: string
    format: string
    quality?: string
    rawFormat?: string
    histogram?: string
}

const props = defineProps<{
    file: File | null
}>()

const metadata = ref<ImageMetadata | null>(null)
const loading = ref(false)

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const extractMetadata = async (file: File) => {
    loading.value = true
    let objectUrl: string | null = null

    try {
        const img = new Image()
        objectUrl = URL.createObjectURL(file)

        const basicMetadata: ImageMetadata = {
            fileName: file.name,
            fileSize: formatBytes(file.size),
            fileType: file.type.split('/')[1].toUpperCase(),
            mimeType: file.type,
            lastModified: new Date(file.lastModified).toLocaleString(),
            created: new Date(file.lastModified).toLocaleString(),
            dimensions: 'Loading...',
            width: 'Loading...',
            height: 'Loading...',
            aspectRatio: 'Loading...',
            colorSpace: 'sRGB',
            orientation: 'Loading...',
            compression: file.type.includes('jpeg') ? 'JPEG' :
                file.type.includes('png') ? 'PNG' :
                    file.type.includes('gif') ? 'GIF' : 'Unknown',
            category: 'Image',
            format: file.type.split('/')[1].toUpperCase(),
            resolution: 'Unknown',
            colorDepth: 'Unknown',
            quality: 'Unknown',
            histogram: 'Not available'
        }

        metadata.value = basicMetadata

        // Učitavamo sliku za dimenzije
        await new Promise<void>((resolve, reject) => {
            img.onload = () => {
                // Pokušavamo da izvučemo EXIF podatke
                try {
                    const reader = new FileReader()
                    reader.onload = function (e) {
                        const view = new DataView(e.target?.result as ArrayBuffer)
                        let offset = 0

                        // Tražimo EXIF marker
                        while (offset < view.byteLength) {
                            if (view.getUint8(offset) === 0xFF && view.getUint8(offset + 1) === 0xE1) {
                                // Pronašli smo EXIF podatke
                                const exifData: Partial<ImageMetadata> = {
                                    camera: 'Unknown',
                                    make: 'Unknown',
                                    model: 'Unknown',
                                    software: 'Unknown',
                                    lens: 'Unknown',
                                    copyright: 'Unknown',
                                    artist: 'Unknown',
                                    exposureTime: 'Unknown',
                                    aperture: 'Unknown',
                                    iso: 'Unknown',
                                    focalLength: 'Unknown',
                                    flash: 'Unknown',
                                    meteringMode: 'Unknown',
                                    whiteBalance: 'Unknown',
                                    exposureProgram: 'Unknown',
                                    exposureCompensation: 'Unknown',
                                    focusMode: 'Unknown',
                                    digitalZoom: 'Unknown',
                                    shootingMode: 'Unknown',
                                    gpsLatitude: 'Not available',
                                    gpsLongitude: 'Not available',
                                    gpsAltitude: 'Not available',
                                    gpsTimestamp: 'Not available',
                                    gpsDirection: 'Not available',
                                    locationName: 'Not available',
                                    bitsPerSample: 'Unknown',
                                    rawFormat: 'Not applicable'
                                }

                                metadata.value = {
                                    ...basicMetadata,
                                    ...exifData,
                                    dimensions: `${img.width}x${img.height}`,
                                    width: `${img.width}px`,
                                    height: `${img.height}px`,
                                    aspectRatio: (img.width / img.height).toFixed(2),
                                    orientation: img.naturalWidth > img.naturalHeight ? 'Landscape' : 'Portrait'
                                }
                                break
                            }
                            offset++
                        }
                    }
                    reader.readAsArrayBuffer(file)
                } catch (error) {
                    console.error('Error reading EXIF data:', error)
                }

                metadata.value = {
                    ...metadata.value!,
                    dimensions: `${img.width}x${img.height}`,
                    width: `${img.width}px`,
                    height: `${img.height}px`,
                    aspectRatio: (img.width / img.height).toFixed(2),
                    orientation: img.naturalWidth > img.naturalHeight ? 'Landscape' : 'Portrait'
                }
                resolve()
            }
            img.onerror = reject
            img.src = objectUrl as string
        })

    } catch (error) {
        console.error('Error extracting metadata:', error)
    } finally {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl)
        }
        loading.value = false
    }
}

watch(() => props.file, (newFile: File | null) => {
    if (newFile) {
        extractMetadata(newFile)
    } else {
        metadata.value = null
    }
}, { immediate: true })
</script>

<template>
    <div class="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-slate-700/50">
        <h3 class="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Image Analysis
        </h3>

        <div v-if="loading" class="flex items-center justify-center p-8">
            <div class="animate-spin mr-3">⚡</div>
            <span class="text-slate-400">Analyzing image metadata...</span>
        </div>

        <div v-else-if="metadata" class="space-y-6">
            <!-- File Info Section -->
            <div
                class="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                <h4 class="flex items-center text-sm font-medium text-slate-300 mb-4 uppercase">
                    <svg class="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    File Information
                </h4>
                <div class="space-y-2">
                    <div v-for="key in ['fileName', 'fileSize', 'fileType', 'mimeType', 'lastModified', 'created']"
                        :key="key"
                        class="grid grid-cols-2 gap-4 py-2 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 rounded transition-colors">
                        <div class="text-slate-400 font-medium">
                            {{ key.replace(/([A-Z])/g, ' $1').trim() }}
                        </div>
                        <div class="text-slate-300">{{ metadata[key as keyof ImageMetadata] }}</div>
                    </div>
                </div>
            </div>

            <!-- Image Properties Section -->
            <div
                class="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                <h4 class="flex items-center text-sm font-medium text-slate-300 mb-4 uppercase">
                    <svg class="w-5 h-5 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Image Properties
                </h4>
                <div class="space-y-2">
                    <div v-for="key in ['dimensions', 'width', 'height', 'aspectRatio', 'colorSpace', 'orientation', 'resolution', 'colorDepth']"
                        :key="key"
                        class="grid grid-cols-2 gap-4 py-2 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 rounded transition-colors">
                        <div class="text-slate-400 font-medium">
                            {{ key.replace(/([A-Z])/g, ' $1').trim() }}
                        </div>
                        <div class="text-slate-300">{{ metadata[key as keyof ImageMetadata] }}</div>
                    </div>
                </div>
            </div>

            <!-- Camera Info Section -->
            <div v-if="metadata.camera || metadata.make || metadata.model"
                class="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                <h4 class="flex items-center text-sm font-medium text-slate-300 mb-4 uppercase">
                    <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Camera Information
                </h4>
                <div class="space-y-2">
                    <div v-for="key in ['camera', 'make', 'model', 'software', 'lens', 'copyright', 'artist']"
                        :key="key"
                        class="grid grid-cols-2 gap-4 py-2 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 rounded transition-colors">
                        <div class="text-slate-400 font-medium">
                            {{ key.replace(/([A-Z])/g, ' $1').trim() }}
                        </div>
                        <div class="text-slate-300">{{ metadata[key as keyof ImageMetadata] }}</div>
                    </div>
                </div>
            </div>

            <!-- Photo Parameters Section -->
            <div v-if="metadata.exposureTime || metadata.aperture || metadata.iso"
                class="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                <h4 class="flex items-center text-sm font-medium text-slate-300 mb-4 uppercase">
                    <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Photo Parameters
                </h4>
                <div class="space-y-2">
                    <div v-for="key in ['exposureTime', 'aperture', 'iso', 'focalLength', 'flash', 'meteringMode', 'whiteBalance', 'exposureProgram', 'exposureCompensation', 'focusMode', 'digitalZoom', 'shootingMode']"
                        :key="key"
                        class="grid grid-cols-2 gap-4 py-2 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 rounded transition-colors">
                        <div class="text-slate-400 font-medium">
                            {{ key.replace(/([A-Z])/g, ' $1').trim() }}
                        </div>
                        <div class="text-slate-300">{{ metadata[key as keyof ImageMetadata] }}</div>
                    </div>
                </div>
            </div>

            <!-- GPS Data Section -->
            <div v-if="metadata.gpsLatitude || metadata.gpsLongitude"
                class="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                <h4 class="flex items-center text-sm font-medium text-slate-300 mb-4 uppercase">
                    <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location Data
                </h4>
                <div class="space-y-2">
                    <div v-for="key in ['gpsLatitude', 'gpsLongitude', 'gpsAltitude', 'gpsTimestamp', 'gpsDirection', 'locationName']"
                        :key="key"
                        class="grid grid-cols-2 gap-4 py-2 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 rounded transition-colors">
                        <div class="text-slate-400 font-medium">
                            {{ key.replace(/([A-Z])/g, ' $1').trim() }}
                        </div>
                        <div class="text-slate-300">{{ metadata[key as keyof ImageMetadata] }}</div>
                    </div>
                </div>
            </div>

            <!-- Technical Details Section -->
            <div
                class="bg-slate-800/80 rounded-lg p-6 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                <h4 class="flex items-center text-sm font-medium text-slate-300 mb-4 uppercase">
                    <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Technical Details
                </h4>
                <div class="space-y-2">
                    <div v-for="key in ['bitsPerSample', 'compression', 'category', 'format', 'quality', 'rawFormat', 'histogram']"
                        :key="key"
                        class="grid grid-cols-2 gap-4 py-2 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 rounded transition-colors">
                        <div class="text-slate-400 font-medium">
                            {{ key.replace(/([A-Z])/g, ' $1').trim() }}
                        </div>
                        <div class="text-slate-300">{{ metadata[key as keyof ImageMetadata] }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex items-center justify-center p-8 text-slate-400">
            <svg class="w-6 h-6 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No metadata available
        </div>
    </div>
</template>