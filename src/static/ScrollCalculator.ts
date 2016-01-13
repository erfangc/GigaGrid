import * as $ from 'jquery';
import {parsePixelValue} from "./WidthMeasureCalculator";

export interface DisplayBoundaries {
    displayStart: number,
    displayEnd: number
}

export class ScrollCalculator{
    static computeDisplayBoundaries(rowHeight:string, viewport:HTMLDivElement, canvas:HTMLTableElement): DisplayBoundaries {
        const viewportOffset = $(viewport).offset().top;
        const canvasOffset = $(canvas).offset().top;
        const progress = canvasOffset - viewportOffset;

        const displayStart = Math.floor(progress / parsePixelValue(rowHeight));
        const displayEnd = displayStart + Math.ceil(parsePixelValue(canvas.height) / parsePixelValue(rowHeight));
        debugger;
        return{
            displayStart: displayStart,
            displayEnd: displayEnd
        };
    }
}