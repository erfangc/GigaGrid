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
        var tableHeight = viewport[0].style.maxHeight ? viewport[0].style.maxHeight : viewport[0].style.height ? viewport[0].style.height : ""
        var displayEnd = displayStart + Math.ceil( parseInt(tableHeight) / parseInt(rowHeight));
        return {
            displayStart: displayStart,
            displayEnd: displayEnd
        };
    }
}
