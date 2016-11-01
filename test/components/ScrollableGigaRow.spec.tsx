///<reference path="../../typings/index.d.ts"/>

import * as React from "react";
import "../../styles/theme/Default.styl";
import {ScrollableGigaRow} from "../../src/components/GigaRow/ScrollableGigaRow";
import * as ReactTestUtils from "react-addons-test-utils";
import {TestUtils} from "../TestUtils";
import {Row} from "../../src/models/Row";
import {Column} from "../../src/models/ColumnLike";
import {Cell, CellProps} from "../../src/components/Cell";
import $ = require('jquery');

describe("GigaRow Components", () => {

    describe("GigaRow rendering of a SubtotalRow", () => {
        var component = null;
        const row: Row = TestUtils.getSimpleSubtotalRow();
        const data = TestUtils.newPeopleTestData();
        const columns: Column[] = TestUtils.getSimpleColumns();
        ReactTestUtils.renderIntoDocument(
            <div>
                <ScrollableGigaRow ref={c=>component=c} row={row} rowHeight="25px" columns={columns} dispatcher={null}
                                   gridProps={data.gridProps()}/>
            </div>
        );
        const rows: Element[] = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "giga-grid-row");
        const singleRow: HTMLDivElement = rows[0] as HTMLDivElement;

        it("should render a row", () => {
            expect(rows.length).toBe(1);
            expect(singleRow.style.height).toBe("25px")
        });

        it("should have class placeholder-false", () => {
            expect(singleRow.className).toContain("placeholder-false")
        });

        it("should have class subtotal-row", () => {
            expect(singleRow.className).toContain("subtotal-row");
        });

    });

    describe("GigaRow rendering of a DetailRow", () => {
        var component = null;
        const row: Row = TestUtils.getDetailRow();
        const data = TestUtils.newPeopleTestData();
        const columns: Column[] = TestUtils.getSimpleColumns();
        ReactTestUtils.renderIntoDocument(
            <div>
                <ScrollableGigaRow ref={c=>component=c} row={row} rowHeight="25px" columns={columns} dispatcher={null}
                                   gridProps={data.gridProps()}/>
            </div>
        );
        const rows: Element[] = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "giga-grid-row");
        const singleRow: HTMLDivElement = rows[0] as HTMLDivElement;

        it("should render a row", () => {
            expect(rows.length).toBe(1);
            expect(singleRow.style.height).toBe("25px")
        });

        it("should have class placeholder-false", () => {
            expect(singleRow.className).toContain("placeholder-false");
            expect(singleRow.className).toContain("detail-row");
            expect(singleRow.className).not.toContain("subtotal-row");
        });
    });

    describe("GigaRow render rows with custom cells instead of the default one", () => {
        it("can handle custom cell content", ()=> {
            var component = null;
            const row: Row = TestUtils.getDetailRow();
            const column: Column = TestUtils.getSimpleColumns()[0];
            const data = TestUtils.newPeopleTestData();

            class CustomCell extends Cell {
                render() {
                    return super.renderContentContainerWithElement(
                        <div>
                            <span style={{color:"green"}}>Hello World</span>
                        </div>
                    );
                }
            }

            column.cellTemplateCreator = (props: CellProps) => {
                return (<CustomCell {...props}/>);
            };

            ReactTestUtils.renderIntoDocument<Cell>(
                <div>
                    <ScrollableGigaRow
                        ref={c=>component=c}
                        columns={[column]}
                        rowHeight={"25px"}
                        dispatcher={null}
                        row={row}
                        gridProps={data.gridProps()}
                    />
                </div>
            );

            const spans = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, "span");

            expect(spans.length).toBe(1);
            expect(spans[0].textContent).toBe("Hello World");
            expect($(spans[0]).css("color")).toBe("green");

        });
    })

});
