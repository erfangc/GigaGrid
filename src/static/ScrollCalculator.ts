/**
 * Created by echen on 1/12/2016.
 */
export interface DisplayBoundaries {
    displayStart: number,
    displayEnd: number
}
export class ScrollCalculator {
    static computeDisplayBoundaries(rowHeight:string, viewport:HTMLDivElement, canvas:HTMLTableElement):DisplayBoundaries {
        return {
            displayStart: 0,
            displayEnd: 0
        };
    }
}