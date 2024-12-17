declare module 'potrace' {
    interface PotraceParams {
        turdSize?: number;
        turnPolicy?: 'black' | 'white' | 'left' | 'right' | 'minority' | 'majority';
        alphaMax?: number;
        optCurve?: boolean;
        optTolerance?: number;
        threshold?: number;
        blackOnWhite?: boolean;
        background?: string;
        color?: string;
    }

    interface Potrace {
        trace(buffer: Buffer, params: PotraceParams, callback: (err: Error | null, svg: string) => void): void;
    }

    const potrace: Potrace;
    export default potrace;
} 