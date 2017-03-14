import { ScrollCalculator } from '../../src/static/ScrollCalculator';

describe('ScrollCalculator', () => {

    describe('a setup where table (canvas) height = 1500 rows, viewport height = 500px', () => {
        const rowHeight = '35px';
        it('can compute displayStart, displayEnd given fixed row height and the two DOM elements representing a viewport and a canvas', () => {
            const viewport: any = {
                style: {
                    maxHeight: '500px'
                },
                scrollTop: 0
            };
            const { displayStart, displayEnd } = ScrollCalculator.computeDisplayBoundaries(rowHeight, null, viewport);
            expect(displayStart).toBe(0);
            expect(displayEnd).toBe(19);
        });

        it('can compute the correct displayStart, displayEnd when the viewport are scrolled by 100px', () => {
            const viewport: any = {
                style: {},
                clientHeight: 500,
                scrollTop: 100
            };
            const { displayStart, displayEnd } = ScrollCalculator.computeDisplayBoundaries(rowHeight, null, viewport);
            expect(displayStart).toBe(2);
            expect(displayEnd).toBe(21);
        });

        // it("can compute the correct displayStart, displayEnd when the viewport are scrolled further", () => {
        //     viewport.scrollTop = 650;
        //     const { displayStart, displayEnd } = ScrollCalculator.computeDisplayBoundaries(rowHeight, null, viewport, canvas);
        //     expect(displayStart).toBe(18 - 2);
        //     expect(displayEnd).toBe(18 + expectedRowsInViewPort + 2);
        // });

        // it("can compute the correct displayStart, displayEnd when the viewport are scrolled all the way", () => {
        //     const { displayStart, displayEnd } = ScrollCalculator.computeDisplayBoundaries(rowHeight, null, viewport, canvas);
        //     expect(displayStart).toBe(numRows - expectedRowsInViewPort - 2);
        //     expect(displayEnd).toBe(numRows + 2);
        // });
        
    });

});
