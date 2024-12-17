declare module 'exif-js' {
    interface ExifTags {
        [key: string]: any
    }

    interface ExifStatic {
        getData(img: any, callback: () => void): void
        getTag(img: any, tag: string): any
        getAllTags(img: any): ExifTags
        readFromBinaryFile(file: ArrayBuffer): ExifTags | false
    }

    const EXIF: ExifStatic
    export default EXIF
} 