import {ScrollCalculator} from "../../src/static/ScrollCalculator";
describe("ScrollCalculator", ()=> {
    var viewport:HTMLDivElement = null;
    var canvas: HTMLTableElement = null;
    beforeEach(()=>{
        viewport = document.createElement("div");
        canvas =document.createElement("table");
        viewport.appendChild(canvas);
    });
    it("can compute displayStart, displayEnd given fixed row height and the two DOM elements representing a viewport and a canvas", ()=> {
        viewport.style.height = "500px";
        canvas.height = "1500px";
        const rowHeight: string = "35px";
        const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(rowHeight, viewport, canvas);
        expect(displayStart).toBe(0);
        expect(displayEnd).toBe(14);
    });
});