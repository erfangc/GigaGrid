///<reference path="../../typings/tsd.d.ts"/>

import * as React from "react";
import "../../src/styles/theme/Default.styl";
import {GigaRow} from "../../src/components/GigaRow";
import * as ReactTestUtils from "react-addons-test-utils";
import {TestUtils} from "../TestUtils";
import {Row} from "../../src/models/Row";
import {Column} from "../../src/models/ColumnLike";

describe("GigaRow Components", () => {

    describe("GigaRow rendering of a SubtotalRow", () => {
        var component = null;
        const row:Row = TestUtils.getSimpleSubtotalRow();
        const columns:Column[] = TestUtils.getSimpleColumns();
        ReactTestUtils.renderIntoDocument(
            <table>
                <tbody>
                <GigaRow ref={c=>component=c} row={row} rowHeight="25px" columns={columns} dispatcher={null}/>
                </tbody>
            </table>
        );
        const trs:Element[] = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, "tr");
        const tr:HTMLTableRowElement = trs[0] as HTMLTableRowElement;

        it("should render a `tr`", () => {
            expect(trs.length).toBe(1);
            expect(tr.style.height).toBe("25px")
        });

        it("should have class placeholder-false", () => {
            expect(tr.className).toContain("placeholder-false")
        });

        it("should have class subtotal-row", () => {
            expect(tr.className).toContain("subtotal-row");
        });

    });

    describe("GigaRow rendering of a DetailRow", () => {
        var component = null;
        const row:Row = TestUtils.getDetailRow();
        const columns:Column[] = TestUtils.getSimpleColumns();
        ReactTestUtils.renderIntoDocument(
            <table>
                <tbody>
                <GigaRow ref={c=>component=c} row={row} rowHeight="25px" columns={columns} dispatcher={null}/>
                </tbody>
            </table>
        );
        const trs:Element[] = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, "tr");
        const tr:HTMLTableRowElement = trs[0] as HTMLTableRowElement;

        it("should render a `tr`", () => {
            expect(trs.length).toBe(1);
            expect(tr.style.height).toBe("25px")
        });

        it("should have class placeholder-false", () => {
            expect(tr.className).toContain("placeholder-false");
            expect(tr.className).toContain("detail-row");
            expect(tr.className).not.toContain("subtotal-row");
        });
    });

});
