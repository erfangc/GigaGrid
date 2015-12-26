import * as $ from 'jquery';
import React = require('react');
import ReactDOM = require('react-dom');
import {SubtotalTableRow} from "../../src/components/TableRow";
import {SubtotalTableRowProps} from "../../src/components/TableRow";
import {SubtotalRow} from "../../src/models/Row";
import {DetailTableRowProps} from "../../src/components/TableRow";
import {DetailTableRow} from "../../src/components/TableRow";
import {DetailRow} from "../../src/models/Row";
import {TestUtils} from "../TestUtils";

describe("TableRow Components", () => {

    afterAll(()=> {
        ReactDOM.unmountComponentAtNode(document.getElementById('container'));
        $("body").empty();
    });

    beforeAll(()=> {
        $("body").append("<table><tbody id='container'></tbody></table>");
    });

    describe("SubtotalTableRow", () => {

        function toDOM(subtotalRow:SubtotalRow) {
            const props:SubtotalTableRowProps = new SubtotalTableRowProps(subtotalRow, TestUtils.getSampleTableRowColumnDefs());
            const element = React.createElement(SubtotalTableRow, props);
            ReactDOM.render(element, document.getElementById('container'));
            return $("#container").find("tr");
        }

        it("should render correctly under basic conditions", ()=> {

            var $tr = toDOM(TestUtils.getSampleSubtotalRow());

            expect($tr.length).toBe(1);
            expect($tr.find("i.fa.fa-minus").length).toBe(1);
            expect($tr.children("td").first().hasClass('giga-grid-locked-col')).toBeTruthy();
            expect($tr.children("td").first().css('padding-left')).toEqual("0px");
            expect($tr.children("td:nth-child(2)").hasClass('numeric')).toBeTruthy();
            expect($tr.children("td:nth-child(1)").hasClass('numeric')).toBeFalsy();

        });

        describe("should render a SubtotalRow that is N layers deep in the tree:", ()=> {
            it("2 layers", () => {

                var subtotalRow = TestUtils.getSampleSubtotalRow();
                subtotalRow.setSectorPath(['Sector X']);
                var $tr = toDOM(subtotalRow);

                expect($tr.length).toBe(1);
                expect($tr.find("i.fa.fa-minus").length).toBe(1);
                expect($tr.children("td").first().hasClass('giga-grid-locked-col')).toBeTruthy();
                expect($tr.children("td").first().css('padding-left')).toEqual("25px");
                expect($tr.children("td:nth-child(2)").hasClass('numeric')).toBeTruthy();
                expect($tr.children("td:nth-child(1)").hasClass('numeric')).toBeFalsy();

            });

            it("3 layers", () => {
                var subtotalRow = TestUtils.getSampleSubtotalRow();
                subtotalRow.setSectorPath(['Sector X', 'Another']);
                var $tr = toDOM(subtotalRow);

                expect($tr.length).toBe(1);
                expect($tr.find("i.fa.fa-minus").length).toBe(1);
                expect($tr.children("td").first().hasClass('giga-grid-locked-col')).toBeTruthy();
                expect($tr.children("td").first().css('padding-left')).toEqual("50px");
                expect($tr.children("td:nth-child(2)").hasClass('numeric')).toBeTruthy();
                expect($tr.children("td:nth-child(1)").hasClass('numeric')).toBeFalsy();

            });

            it("4 layers", () => {
                var subtotalRow = TestUtils.getSampleSubtotalRow();
                subtotalRow.setSectorPath(['Sector X', 'Another', 'Another']);
                var $tr = toDOM(subtotalRow);

                expect($tr.length).toBe(1);
                expect($tr.find("i.fa.fa-minus").length).toBe(1);
                expect($tr.children("td").first().hasClass('giga-grid-locked-col')).toBeTruthy();
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
                const props:DetailTableRowProps = new DetailTableRowProps(TestUtils.getDetailRow(), TestUtils.getSampleTableRowColumnDefs());
                const element = React.createElement(DetailTableRow, props);
                ReactDOM.render(element, document.getElementById('container'));
                $tr = $("#container").find("tr");
            });

            it("should be consisted one `tr`", ()=> {
                expect($tr.length).toBe(1);
            });
            it("should have no + icon on the first cell", () => {
                expect($tr.find("i.fa.fa-plus").length).toBe(0);
            });
            it("first cell should have a lock class", ()=> {
                expect($tr.children("td").first().hasClass('giga-grid-locked-col')).toBeFalsy();
            });
            it("should have no identation", ()=> {
                expect($tr.children("td").first().css('padding-left')).toEqual("0px");
            });
            it("first child should be a numeric child", ()=> {
                expect($tr.children("td:nth-child(1)").hasClass('numeric')).toBeTruthy();
            });
        });

        it("it should have the proper indentation if part of a subtotaled tree", () => {
            const detailRow:DetailRow = TestUtils.getDetailRow();
            detailRow.setSectorPath(['Some Parent']);
            const props:DetailTableRowProps = new DetailTableRowProps(detailRow, TestUtils.getSampleTableRowColumnDefs());
            const element = React.createElement(DetailTableRow, props);
            ReactDOM.render(element, document.getElementById('container'));
            const $tr = $("#container").find("tr");

            expect($tr.children("td").first().css('padding-left')).toEqual("50px");
        });

        it("should render a row with missing data", ()=> {
            const props:DetailTableRowProps = new DetailTableRowProps(TestUtils.getDetailRowWithMissingData(), TestUtils.getSampleTableRowColumnDefs());
            const element = React.createElement(DetailTableRow, props);
            ReactDOM.render(element, document.getElementById('container'));
            const $tr = $("#container").find("tr");

            expect($tr.children("td:nth-child(2)").text()).toEqual("");
        });

    });

});
