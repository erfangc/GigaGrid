import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-addons-test-utils';
import * as Flux from 'flux';
import * as FluxUtil from 'flux/utils';
import {CellProps} from "../../src/components/Cell";
import Dispatcher = Flux.Dispatcher;
import {GigaAction} from "../../src/store/GigaStore";
import {DetailRow} from "../../src/models/Row";
import {ColumnFormat} from "../../src/models/ColumnLike";
import {TestUtils} from "../TestUtils";
import {TableRowColumnDef} from "../../src/models/ColumnLike";
import {Cell} from "../../src/components/Cell";
import * as $ from 'jquery';

describe("Cell", ()=> {

    var dispatcher:Dispatcher<GigaAction>;
    var row:DetailRow;
    var columnDefs:TableRowColumnDef[];
    var component;

    beforeEach(()=> {
        dispatcher = new Dispatcher<GigaAction>();
        row = TestUtils.getDetailRow();
        columnDefs = TestUtils.getSampleTableRowColumnDefs();
    });

    it("renders a td", ()=> {
        ReactTestUtils.renderIntoDocument<Cell>(
            <table>
                <tbody>
                    <tr>
                        <Cell ref={c=>component=c} isFirstColumn={true} dispatcher={dispatcher}
                              tableRowColumnDef={columnDefs[2]}
                              row={row}/>
                    </tr>
                </tbody>
            </table>
        );
        const $domNode = $(ReactDOM.findDOMNode(component));
        expect($domNode.text()).toBe("R2D2");
    });

    it("can handle custom cell", ()=> {

        const colDef = columnDefs[2];
        colDef.cellTemplateCreator = (data:any, tableRowColumnDef?:TableRowColumnDef):JSX.Element => {
            return (
                <span style={{"color": "green"}}>Hello World</span>
            )
        };

        ReactTestUtils.renderIntoDocument<Cell>(
            <table>
                <tbody>
                    <tr>
                        <Cell ref={c=>component=c}
                              isFirstColumn={false}
                              dispatcher={dispatcher}
                              tableRowColumnDef={colDef}
                              row={row}/>
                    </tr>
                </tbody>
            </table>
        );

        expect($(ReactDOM.findDOMNode(component)).find("span").length).toBe(1);
        expect($(ReactDOM.findDOMNode(component)).find("span").text()).toBe("Hello World");
        expect($(ReactDOM.findDOMNode(component)).find("span").css("color")).toBe("green");

    });

    it("can deduce the correct identation for 1st rows in a subtotaled tree", ()=> {
        row.setSectorPath(["Level 1", "Level 2"]);
        const colDef = columnDefs[0];
        ReactTestUtils.renderIntoDocument(
            <table>
                <tbody>
                    <tr>
                        <Cell ref={c=>component=c}
                              isFirstColumn={true}
                              dispatcher={dispatcher}
                              tableRowColumnDef={colDef}
                              row={row}/>
                    </tr>
                </tbody>
            </table>
        );
        expect($(ReactDOM.findDOMNode(component)).css("padding-left")).toBe("75px");
    });

    it("can render a +/- for the first cell of a subtotal row", ()=> {
        const subtotalRow = TestUtils.getSampleSubtotalRow();
        const colDef = columnDefs[0];
        ReactTestUtils.renderIntoDocument(
            <table>
                <tbody>
                    <tr>
                        <Cell ref={c=>component=c}
                              isFirstColumn={true}
                              dispatcher={dispatcher}
                              tableRowColumnDef={colDef}
                              row={subtotalRow}/>
                    </tr>
                </tbody>
            </table>
        );
        expect($(ReactDOM.findDOMNode(component)).find("i.fa").length).toBe(1);
    });

});