export interface DisplayBoundaries {
    displayStart: number;
    displayEnd: number;
}
export declare class ScrollCalculator {
    static computeDisplayBoundaries(rowHeight: string, bodyHeight: string, viewport: HTMLDivElement): DisplayBoundaries;
}
