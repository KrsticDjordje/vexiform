<script setup lang="ts">
import { ref, watch } from 'vue'

interface ImageMetadata {
    fileName: string
    fileSize: string
    fileType: string
    dimensions: string
    lastModified: string
    mimeType: string
    [key: string]: string
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
        }

        metadata.value = basicMetadata

        // Učitavamo sliku za dimenzije
        await new Promise<void>((resolve, reject) => {
            img.onload = () => {
                metadata.value = {
                    ...basicMetadata,
                    dimensions: `${img.width}x${img.height}`,
                    width: `${img.width}px`,
                    height: `${img.height}px`,
                    aspectRatio: (img.width / img.height).toFixed(2),
                    colorSpace: img.colorSpace || 'Unknown',
                    orientation: img.naturalWidth > img.naturalHeight ? 'Landscape' : 'Portrait'
                }
                resolve()
            }
            img.onerror = reject
            img.src = objectUrl
        })

        // Dodajemo dodatne informacije o fajlu
        if (file.type.startsWith('image/')) {
            metadata.value = {
                ...metadata.value,
                category: 'Image',
                format: file.type.split('/')[1].toUpperCase(),
                compression: file.type.includes('jpeg') ? 'JPEG' :
                    file.type.includes('png') ? 'PNG' :
                        file.type.includes('gif') ? 'GIF' : 'Unknown'
            }
        }

    } catch (error) {
        console.error('Error extracting metadata:', error)
    } finally {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl)
        }
        loading.value = false
    }
}

watch(() => props.file, (newFile) => {
    if (newFile) {
        extractMetadata(newFile)
    } else {
        metadata.value = null
    }
}, { immediate: true })
</script>

<template>
    <div class="bg-slate-800 rounded-lg p-6">
        <h3 class="text-lg font-medium mb-4">Image Metadata</h3>

        <div v-if="loading" class="text-slate-400">
            Loading metadata...
        </div>

        <div v-else-if="metadata" class="grid gap-2">
            <div v-for="(value, key) in metadata" :key="key"
                class="grid grid-cols-2 gap-4 py-2 border-b border-slate-700 last:border-0">
                <div class="text-slate-400 font-medium">
                    {{ key.replace(/([A-Z])/g, ' $1').trim() }}
                </div>
                <div class="text-slate-300">{{ value }}</div>
            </div>
        </div>

        <div v-else class="text-slate-400">
            No metadata available
        </div>
    </div>
</template>