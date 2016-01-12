import {ScrollCalculator} from "../../src/static/ScrollCalculator";
import * as $ from 'jquery';
import {getScrollBarWidth} from "../../src/static/WidthMeasureCalculator";

describe("ScrollCalculator", ()=> {

    xdescribe("a setup where table (canvas) height = 1500 rows, viewport height = 500px", ()=> {

        var viewport:HTMLDivElement = null;
        var canvas:HTMLTableElement = null;

        beforeEach(()=> {
            viewport = document.createElement("div");
            canvas = document.createElement("table");
            viewport.appendChild(canvas);
        });

        afterEach(()=> {
            viewport.removeChild(canvas);
            document.removeChild(viewport);
        });

        const numRows = 1500;
        const rowHeight:string = "35px";
        viewport.style.height = "500px";
        canvas.height = numRows * parseInt(rowHeight) + "px";

        const expectedRowsInViewPort = Math.ceil(parseInt(viewport.style.height) / parseInt(rowHeight));

        it("can compute displayStart, displayEnd given fixed row height and the two DOM elements representing a viewport and a canvas", ()=> {
            const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(rowHeight, viewport, canvas);
            expect(displayStart).toBe(0);
            expect(displayEnd).toBe(expectedRowsInViewPort);
        });

        it("can compute the correct displayStart, displayEnd when the viewport are scrolled", ()=> {
            const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(rowHeight, viewport, canvas);
            $(viewport).scrollTop(100);
            expect(displayStart).toBe(2);
            expect(displayEnd).toBe(2 + expectedRowsInViewPort);
        });

        it("can compute the correct displayStart, displayEnd when the viewport are scrolled", ()=> {
            const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(rowHeight, viewport, canvas);
            $(viewport).scrollTop(650);
            expect(displayStart).toBe(18);
            expect(displayEnd).toBe(18 + expectedRowsInViewPort);
        });

        it("can compute the correct displayStart, displayEnd when the viewport are scrolled all the way", ()=> {
            const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(rowHeight, viewport, canvas);
            $(viewport).scrollTop(parseInt(canvas.height) - parseInt(viewport.style.height) + getScrollBarWidth());
            expect(displayStart).toBe(numRows - expectedRowsInViewPort);
            expect(displayEnd).toBe(numRows);
        });

    });

});
