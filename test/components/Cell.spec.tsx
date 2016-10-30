import * as React from "react";
import * as ReactTestUtils from "react-addons-test-utils";
import {GigaAction} from "../../src/store/GigaStore";
import {Row} from "../../src/models/Row";
import {TestUtils} from "../TestUtils";
import {Column} from "../../src/models/ColumnLike";
import {Cell} from "../../src/components/Cell";
import * as $ from "jquery";
import {Dispatcher} from "flux";

describe("Cell", ()=> {

    var dispatcher:Dispatcher<GigaAction>;
    var row:Row;
    var columns:Column[];
    var component;
    beforeEach(()=> {
        dispatcher = new Dispatcher<GigaAction>();
        row = TestUtils.getDetailRow();
        columns = TestUtils.getSimpleColumns();
    });

    it("renders a Cell", ()=> {
        ReactTestUtils.renderIntoDocument<Cell>(
            <div>
                <Cell ref={c=>component=c}
                      rowHeight={"25x"}
                      isFirstColumn={true}
                      dispatcher={dispatcher}
                      column={columns[2]}
                      columnNumber={1}
                      row={row}
                />
            </div>
        );
        let textContent = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "content")[0].textContent;
        expect(textContent).toBe("R2D2");
    });

    it("can deduce the correct identation for 1st rows in a subtotaled tree", ()=> {
        row.sectorPath = [{colTag: "Level 1", title: "Level 1", value: "Level 1"}, {colTag: "Level 2", title: "Level 2", value: "Level 2"}];
        let column = columns[0];

        ReactTestUtils.renderIntoDocument(
            <div>
                <Cell ref={c=>component=c}
                      rowHeight={"25x"}
                      isFirstColumn={true}
                      dispatcher={dispatcher}
                      column={column}
                      columnNumber={1}
                      row={row}
                />
            </div>
        );
        expect($(ReactTestUtils.findRenderedDOMComponentWithClass(component,"content-container")).css("padding-left")).toBe("75px");
    });

    it("can render a +/- for the first cell of a subtotal row", ()=> {
        let subtotalRow = TestUtils.getSimpleSubtotalRow();
        let column = columns[0];
        ReactTestUtils.renderIntoDocument(
            <div>
                <Cell ref={c=>component=c}
                      rowHeight={"25x"}
                      isFirstColumn={true}
                      dispatcher={dispatcher}
                      column={column}
                      columnNumber={1}
                      row={subtotalRow}/>
            </div>
        );
        expect($(ReactTestUtils.findRenderedDOMComponentWithClass(component,"content-container")).find("i.fa").length).toBe(1);
    });

});