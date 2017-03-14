export interface DisplayBoundaries {
    displayStart: number;
    displayEnd: number;
}

export class ScrollCalculator {
    static computeDisplayBoundaries(
        rowHeight: string,
        bodyHeight: string,
        viewport: HTMLDivElement): DisplayBoundaries {
        const bufferRows = 4;
        let displayStart = 0, displayEnd = 20;
        const progress = viewport.scrollTop;
        displayStart = Math.floor(progress / parseInt(rowHeight));
        const viewportHeight: number = viewport.style.maxHeight ? parseInt(viewport.style.maxHeight) : viewport.clientHeight;
        displayEnd = displayStart + Math.ceil(viewportHeight / parseInt(rowHeight)) + bufferRows;
        // If the bodyHeight is larger than the current viewable area, let's get enough data for that area
        if (bodyHeight) {
            const parsedBodyHeight = parseInt(bodyHeight);
            const parsedRowHeight = parseInt(rowHeight);
            if ((displayEnd - displayStart) * parsedRowHeight < parsedBodyHeight) {
                displayEnd = Math.round(parsedBodyHeight / parsedRowHeight) + displayStart;
            }
        }
        return {
            displayStart,
            displayEnd
        };
    }
}
