////<reference path="../"/>

import {ScrollCalculator} from "../../src/static/ScrollCalculator";
import * as $ from 'jquery';

describe("ScrollCalculator", ()=> {

    describe("a setup where table (canvas) height = 1500 rows, viewport height = 500px", ()=> {

        var viewport:JQuery = null;
        var canvas:JQuery = null;
        var expectedRowsInViewPort:number = null;

        beforeAll(()=> {
            viewport = $("<div></div>");
            canvas = $("<table></table>");
            viewport.append(canvas);
            viewport.css({height: "500px"});
            viewport.css({overflow: "scroll"});
            canvas.css({height: numRows * parseInt(rowHeight) + "px"});
            expectedRowsInViewPort = Math.ceil(viewport.height() / parseInt(rowHeight));
            $("body").append(viewport);
        });

        afterAll(()=> {
            viewport.remove();
        });

        const numRows = 1500;
        const rowHeight:string = "35px";


        it("can compute displayStart, displayEnd given fixed row height and the two DOM elements representing a viewport and a canvas", ()=> {
            const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(rowHeight, null, viewport, canvas);
            expect(displayStart).toBe(0);
            expect(displayEnd).toBe(expectedRowsInViewPort);
        });

        it("can compute the correct displayStart, displayEnd when the viewport are scrolled", ()=> {
            viewport.scrollTop(100);
            const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(rowHeight, null, viewport, canvas);
            expect(displayStart).toBe(2);
            expect(displayEnd).toBe(2 + expectedRowsInViewPort);
        });

        it("can compute the correct displayStart, displayEnd when the viewport are scrolled further", ()=> {
            $(viewport).scrollTop(650);
            const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(rowHeight, null, viewport, canvas);
            expect(displayStart).toBe(18);
            expect(displayEnd).toBe(18 + expectedRowsInViewPort);
        });

        it("can compute the correct displayStart, displayEnd when the viewport are scrolled all the way", ()=> {
            $(viewport).scrollTop(canvas.height() - viewport.height());
            const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(rowHeight, null, viewport, canvas);
            expect(displayStart).toBe(numRows - expectedRowsInViewPort);
            expect(displayEnd).toBe(numRows);
        });

    });

});
