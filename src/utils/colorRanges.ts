// Универзална палета боја за векторизацију
export const colorRanges = [
    // Основне боје
    {
        name: 'Црна',
        hue: [0, 360],
        sat: [0, 100],
        val: [0, 15],
        color: '#000000',
        tolerance: { hue: 360, sat: 100, val: 10 }
    },
    {
        name: 'Бела',
        hue: [0, 360],
        sat: [0, 10],
        val: [90, 100],
        color: '#FFFFFF',
        tolerance: { hue: 360, sat: 10, val: 10 }
    },
    // Топле боје
    {
        name: 'Црвена',
        hue: [350, 10],
        sat: [30, 100],
        val: [30, 100],
        color: '#FF0000',
        tolerance: { hue: 10, sat: 20, val: 20 }
    },
    {
        name: 'Наранџаста',
        hue: [11, 40],
        sat: [30, 100],
        val: [30, 100],
        color: '#FF8000',
        tolerance: { hue: 10, sat: 20, val: 20 }
    },
    {
        name: 'Жута',
        hue: [41, 70],
        sat: [30, 100],
        val: [30, 100],
        color: '#FFD700',
        tolerance: { hue: 10, sat: 20, val: 20 }
    },
    // Хладне боје
    {
        name: 'Зелена',
        hue: [71, 150],
        sat: [30, 100],
        val: [30, 100],
        color: '#008000',
        tolerance: { hue: 10, sat: 20, val: 20 }
    },
    {
        name: 'Тиркизна',
        hue: [151, 190],
        sat: [30, 100],
        val: [30, 100],
        color: '#40E0D0',
        tolerance: { hue: 10, sat: 20, val: 20 }
    },
    {
        name: 'Плава',
        hue: [191, 240],
        sat: [30, 100],
        val: [30, 100],
        color: '#0000FF',
        tolerance: { hue: 10, sat: 20, val: 20 }
    },
    // Остале боје
    {
        name: 'Љубичаста',
        hue: [241, 290],
        sat: [30, 100],
        val: [30, 100],
        color: '#8A2BE2',
        tolerance: { hue: 10, sat: 20, val: 20 }
    },
    {
        name: 'Розе',
        hue: [291, 349],
        sat: [30, 100],
        val: [30, 100],
        color: '#FF69B4',
        tolerance: { hue: 10, sat: 20, val: 20 }
    },
    // Неутралне боје
    {
        name: 'Браон',
        hue: [20, 40],
        sat: [30, 80],
        val: [20, 60],
        color: '#8B4513',
        tolerance: { hue: 10, sat: 20, val: 20 }
    },
    {
        name: 'Сива',
        hue: [0, 360],
        sat: [0, 20],
        val: [20, 80],
        color: '#808080',
        tolerance: { hue: 360, sat: 20, val: 20 }
    }
]

// Универзална подешавања за обраду слике
export const imageProcessingSettings = {
    contrast: 0.3,
    brightness: 0.1,
    posterizeLevels: 8,
    minColorStrength: 0.4,
    minNeighbors: 2,
    neighborStrength: 0.6
} 