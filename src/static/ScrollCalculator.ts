export interface DisplayBoundaries {
    displayStart: number,
    displayEnd: number
}

export class ScrollCalculator {
    static computeDisplayBoundaries(rowHeight:string, viewport:JQuery, canvas:JQuery):DisplayBoundaries {
        const viewportOffset = viewport.offset().top;
        const canvasOffset = canvas.offset().top;
        const progress = viewportOffset - canvasOffset;
        const displayStart = Math.floor(progress / parseInt(rowHeight));
        const displayEnd = displayStart + Math.ceil(viewport.height() / parseInt(rowHeight));
        return {
            displayStart: displayStart,
            displayEnd: displayEnd
        };
    }
}
