import type { ConversionResult } from '../types'
import Jimp from 'jimp'

export async function processImage(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const buffer = Buffer.from(reader.result as ArrayBuffer)
        resolve(buffer)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

export async function convertToSvg(buffer: Buffer): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const Potrace = await import('potrace')
      const image = await Jimp.read(buffer)

      const MAX_SIZE = 1000
      if (image.bitmap.width > MAX_SIZE || image.bitmap.height > MAX_SIZE) {
        image.scaleToFit(MAX_SIZE, MAX_SIZE)
      }

      // Чувамо димензије
      const width = image.bitmap.width
      const height = image.bitmap.height

      // Функција за трејсовање једног канала
      const traceChannel = async (channelImage: Jimp) => {
        const buffer = await channelImage.getBufferAsync(Jimp.MIME_PNG)
        return new Promise<string>((resolve, reject) => {
          Potrace.default.trace(buffer, {
            turdSize: 2,
            turnPolicy: 'black',
            alphaMax: 1,
            optCurve: true,
            optTolerance: 0.1,
            threshold: 128,
            blackOnWhite: true
          }, (err: Error | null, svg: string) => {
            if (err) reject(err)
            else resolve(svg)
          })
        })
      }

      // Раздвајамо слику на канале и процесирамо сваки
      const channels = ['red', 'green', 'blue'] as const
      const paths: string[] = []

      for (const channel of channels) {
        const channelImage = image.clone()

        // Издвајамо један канал
        channelImage.scan(0, 0, width, height, function (x, y, idx) {
          const r = this.bitmap.data[idx + 0]
          const g = this.bitmap.data[idx + 1]
          const b = this.bitmap.data[idx + 2]

          let value
          switch (channel) {
            case 'red':
              value = r
              break
            case 'green':
              value = g
              break
            case 'blue':
              value = b
              break
          }

          // Постављамо праг за канал
          const threshold = 128
          const binary = value > threshold ? 255 : 0

          this.bitmap.data[idx + 0] = binary
          this.bitmap.data[idx + 1] = binary
          this.bitmap.data[idx + 2] = binary
        })

        // Трејсујемо канал
        const channelSvg = await traceChannel(channelImage)

        // Извлачимо путање и додајемо боју
        const pathMatches = channelSvg.match(/<path[^>]*d="([^"]*)"[^>]*>/g) || []
        pathMatches.forEach(path => {
          const d = path.match(/d="([^"]*)"/)![1]
          let color
          switch (channel) {
            case 'red':
              color = 'rgb(255,0,0)'
              break
            case 'green':
              color = 'rgb(0,255,0)'
              break
            case 'blue':
              color = 'rgb(0,0,255)'
              break
          }
          paths.push(`<path d="${d}" fill="${color}" opacity="0.5"/>`)
        })
      }

      // Комбинујемо све путање у финални SVG
      const finalSvg = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg viewBox="0 0 ${width} ${height}" 
  preserveAspectRatio="xMidYMid meet"
  version="1.1" xmlns="http://www.w3.org/2000/svg">
  ${paths.join('\n  ')}
</svg>`

      resolve(finalSvg)
    } catch (error) {
      reject(error)
    }
  })
}

export function createObjectURL(file: File): string {
  return URL.createObjectURL(file)
}

export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url)
}

export function convertSvgToEps(svg: string): string {
  const cleanSvg = svg.replace(/<\?xml[^>]*\?>/, '').replace(/<!DOCTYPE[^>]*>/, '')

  const viewBoxMatch = cleanSvg.match(/viewBox="([^"]*)"/)
  const [x, y, width, height] = viewBoxMatch ? viewBoxMatch[1].split(' ').map(Number) : [0, 0, 100, 100]

  const epsHeader = `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 ${width} ${height}
%%HiResBoundingBox: 0 0 ${width} ${height}
%%Creator: Vexiform
%%Title: Converted Vector Image
%%DocumentData: Clean7Bit
%%LanguageLevel: 2
%%Pages: 1
%%EndComments

%%BeginProlog
/m { moveto } def
/l { lineto } def
/c { curveto } def
/h { closepath } def
/f { fill } def
/S { stroke } def
/n { newpath } def
/rgb { setrgbcolor } def
%%EndProlog

%%Page: 1 1

% Initialize graphics state
1 setlinewidth
0 setlinecap
0 setlinejoin

% Scale to fit page
${width} ${height} scale
1 -1 scale
0 -1 translate
`

  const epsFooter = `
showpage
%%EOF`

  // Функција за конверзију HTML боје у RGB вредности
  const parseColor = (color: string): number[] => {
    // Подразумевана црна боја
    if (!color || color === 'none') return [0, 0, 0]

    // Хексадецимални формат
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.slice(0, 2), 16) / 255
      const g = parseInt(hex.slice(2, 4), 16) / 255
      const b = parseInt(hex.slice(4, 6), 16) / 255
      return [r, g, b]
    }

    // rgb() формат
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (rgbMatch) {
      return [
        parseInt(rgbMatch[1]) / 255,
        parseInt(rgbMatch[2]) / 255,
        parseInt(rgbMatch[3]) / 255
      ]
    }

    return [0, 0, 0]
  }

  let paths = cleanSvg.match(/<path[^>]*d="([^"]*)"[^>]*>/g) || []
  let psCommands = paths.map(path => {
    const d = path.match(/d="([^"]*)"/)![1]
    const fillMatch = path.match(/fill="([^"]*)"/)
    const strokeMatch = path.match(/stroke="([^"]*)"/)

    const fillColor = fillMatch ? parseColor(fillMatch[1]) : [0, 0, 0]
    const strokeColor = strokeMatch ? parseColor(strokeMatch[1]) : [0, 0, 0]
    const isFill = !path.includes('fill="none"')

    let currentX = 0
    let currentY = 0

    const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g) || []
    const psPath = commands.map(cmd => {
      const type = cmd[0]
      const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number)

      switch (type) {
        case 'M':
          currentX = coords[0]
          currentY = coords[1]
          return `n ${currentX} ${currentY} m`
        case 'L':
          currentX = coords[0]
          currentY = coords[1]
          return `${currentX} ${currentY} l`
        case 'C':
          currentX = coords[4]
          currentY = coords[5]
          return `${coords[0]} ${coords[1]} ${coords[2]} ${coords[3]} ${currentX} ${currentY} c`
        case 'Z':
          return 'h'
        default:
          return ''
      }
    }).join('\n')

    // Додајемо боје и операције цртања
    const operations = []
    if (isFill) {
      operations.push(`${fillColor.join(' ')} rgb\n${psPath}\nf`)
    }
    if (strokeMatch && strokeMatch[1] !== 'none') {
      operations.push(`${strokeColor.join(' ')} rgb\n${psPath}\nS`)
    }

    return operations.join('\n')
  }).join('\n')

  return `${epsHeader}\n${psCommands}${epsFooter}`
}