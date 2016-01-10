import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GigaRow} from "../../src/components/GigaRow";
import {GigaRowProps} from "../../src/components/GigaRow";
import {SubtotalRow} from "../../src/models/Row";
import {TestUtils} from "../TestUtils";
import {DetailRow} from "../../src/models/Row";
import {Row} from "../../src/models/Row";

describe("GigaRow Components", () => {

    afterAll(()=> {
        ReactDOM.unmountComponentAtNode(document.getElementById('container'));
        $("body").empty();
    });

    beforeAll(()=> {
        $("body").append("<table><tbody id='container'></tbody></table>");
    });

    describe("GigaRow", () => {

        function toDOM(subtotalRow:SubtotalRow) {
            const props:GigaRowProps = {
                dispatcher: null,
                row: subtotalRow,
                columns: TestUtils.getSampleColumns()
            };
            const element = React.createElement(GigaRow, props);
            ReactDOM.render(element, document.getElementById('container'));
            return $("#container").find("tr");
        }

        it("should render correctly under basic conditions", ()=> {

            var $tr = toDOM(TestUtils.getSimpleSubtotalRow());

            expect($tr.length).toBe(1);
            expect($tr.find("i.fa.fa-minus").length).toBe(1);
            expect($tr.children("td").first().css('padding-left')).toEqual("0px");
            expect($tr.children("td:nth-child(2)").hasClass('numeric')).toBeTruthy();
            expect($tr.children("td:nth-child(1)").hasClass('numeric')).toBeFalsy();

        });

        describe("should render a SubtotalRow that is N layers deep in the tree:", ()=> {
            it("2 layers", () => {

                var subtotalRow = TestUtils.getSimpleSubtotalRow();
                subtotalRow.setSectorPath(['Sector X']);
                var $tr = toDOM(subtotalRow);

                expect($tr.length).toBe(1);
                expect($tr.find("i.fa.fa-minus").length).toBe(1);
                expect($tr.children("td").first().css('padding-left')).toEqual("25px");
                expect($tr.children("td:nth-child(2)").hasClass('numeric')).toBeTruthy();
                expect($tr.children("td:nth-child(1)").hasClass('numeric')).toBeFalsy();

            });

            it("3 layers", () => {
                var subtotalRow = TestUtils.getSimpleSubtotalRow();
                subtotalRow.setSectorPath(['Sector X', 'Another']);
                var $tr = toDOM(subtotalRow);

                expect($tr.length).toBe(1);
                expect($tr.find("i.fa.fa-minus").length).toBe(1);
                expect($tr.children("td").first().css('padding-left')).toEqual("50px");
                expect($tr.children("td:nth-child(2)").hasClass('numeric')).toBeTruthy();
                expect($tr.children("td:nth-child(1)").hasClass('numeric')).toBeFalsy();

            });

            it("4 layers", () => {
                var subtotalRow = TestUtils.getSimpleSubtotalRow();
                subtotalRow.setSectorPath(['Sector X', 'Another', 'Another']);
                var $tr = toDOM(subtotalRow);

                expect($tr.length).toBe(1);
                expect($tr.find("i.fa.fa-minus").length).toBe(1);
                expect($tr.children("td").first().css('padding-left')).toEqual("75px");
                expect($tr.children("td:nth-child(2)").hasClass('numeric')).toBeTruthy();
                expect($tr.children("td:nth-child(1)").hasClass('numeric')).toBeFalsy();

            });
        });

    });

    describe("DetailRow", ()=> {

        describe("render correct under basic conditions", () => {
            var $tr;
            beforeEach(()=> {
                const props:GigaRowProps = {
                    dispatcher: null,
                    row: TestUtils.getDetailRow(),
                    columns: TestUtils.getSampleColumns()
                };
                const element = React.createElement(GigaRow, props);
                ReactDOM.render(element, document.getElementById('container'));
                $tr = $("#container").find("tr");
            });

            it("should be consisted one `tr`", ()=> {
                expect($tr.length).toBe(1);
            });
            it("should have no + icon on the first cell", () => {
                expect($tr.find("i.fa.fa-plus").length).toBe(0);
            });
            it("should have no identation", ()=> {
                expect($tr.children("td").first().css('padding-left')).toEqual("0px");
            });
            it("first child should be a numeric child", ()=> {
                expect($tr.children("td:nth-child(1)").hasClass('numeric')).toBeTruthy();
            });
        });

        it("it should have the proper indentation if part of a subtotaled tree", () => {
            const detailRow:Row = TestUtils.getDetailRow();
            detailRow.setSectorPath(['Some Parent']);
            const props:GigaRowProps = {
                dispatcher: null,
                row: detailRow,
                columns: TestUtils.getSampleColumns()
            };
            const element = React.createElement(GigaRow, props);
            ReactDOM.render(element, document.getElementById('container'));
            const $tr = $("#container").find("tr");

            expect($tr.children("td").first().css('padding-left')).toEqual("50px");
        });

        it("should render a row with missing data", ()=> {
            const props:GigaRowProps = {
                dispatcher: null,
                row: TestUtils.getDetailRowWithMissingData(),
                columns: TestUtils.getSampleColumns()
            };
            const element = React.createElement(GigaRow, props);
            ReactDOM.render(element, document.getElementById('container'));
            const $tr = $("#container").find("tr");

            expect($tr.children("td:nth-child(2)").text()).toEqual("");
        });

    });

});
