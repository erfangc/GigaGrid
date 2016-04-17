import * as React from "react";
import * as ReactTestUtils from "react-addons-test-utils";
import {GigaAction} from "../../src/store/GigaStore";
import {DetailRow, Row} from "../../src/models/Row";
import {TestUtils} from "../TestUtils";
import {Column} from "../../src/models/ColumnLike";
import {Cell, CellProps} from "../../src/components/Cell";
import * as $ from "jquery";
import {Dispatcher} from "flux";

describe("Cell", ()=> {

    var dispatcher:Dispatcher<GigaAction>;
    var row:DetailRow;
    var columns:Column[];
    var component;

    beforeEach(()=> {
        dispatcher = new Dispatcher<GigaAction>();
        row = TestUtils.getDetailRow();
        columns = TestUtils.getSimpleColumns();
    });

    it("renders a td", ()=> {
        ReactTestUtils.renderIntoDocument<Cell>(
            <table>
                <tbody>
                    <tr>
                        <Cell ref={c=>component=c} rowHeight={""} isFirstColumn={true} dispatcher={dispatcher}
                              column={columns[2]}
                              row={row}/>
                    </tr>
                </tbody>
            </table>
        );
        const textContent = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, "td")[0].textContent;
        expect(textContent).toBe("R2D2");
    });

    it("can handle custom cell content", ()=> {

        const colDef = columns[2];
        colDef.cellTemplateCreator = (row:Row, column:Column, props:CellProps):JSX.Element => {
            return (
                <td>
                    <span style={{"color": "green"}}>Hello World</span>
                </td>
            )
        };

        ReactTestUtils.renderIntoDocument<Cell>(
            <table>
                <tbody>
                    <tr>
                        <Cell ref={c=>component=c}
                              isFirstColumn={false}
                              rowHeight={""}
                              dispatcher={dispatcher}
                              column={colDef}
                              row={row}/>
                    </tr>
                </tbody>
            </table>
        );

        const spans = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, "span");

        expect(spans.length).toBe(1);
        expect(spans[0].textContent).toBe("Hello World");
        expect($(spans[0]).css("color")).toBe("green");

    });

    it("can deduce the correct identation for 1st rows in a subtotaled tree", ()=> {
        row.setSectorPath(["Level 1", "Level 2"]);
        const colDef = columns[0];
        ReactTestUtils.renderIntoDocument(
            <table>
                <tbody>
                    <tr>
                        <Cell ref={c=>component=c}
                              rowHeight={""}
                              isFirstColumn={true}
                              dispatcher={dispatcher}
                              column={colDef}
                              row={row}/>
                    </tr>
                </tbody>
            </table>
        );
        expect($(ReactTestUtils.findRenderedDOMComponentWithTag(component,"td")).css("padding-left")).toBe("75px");
    });

    it("can render a +/- for the first cell of a subtotal row", ()=> {
        const subtotalRow = TestUtils.getSimpleSubtotalRow();
        const colDef = columns[0];
        ReactTestUtils.renderIntoDocument(
            <table>
                <tbody>
                    <tr>
                        <Cell ref={c=>component=c}
                              rowHeight={""}
                              isFirstColumn={true}
                              dispatcher={dispatcher}
                              column={colDef}
                              row={subtotalRow}/>
                    </tr>
                </tbody>
            </table>
        );
        expect($(ReactTestUtils.findRenderedDOMComponentWithTag(component,"td")).find("i.fa").length).toBe(1);
    });

});