import * as React from "react";
import * as ReactTestUtils from "react-addons-test-utils";
import {GigaAction, GigaActionType, NewSortAction} from "../../src/store/GigaStore";
import {Dispatcher} from "flux";
import {SortDirection, ColumnFormat} from "../../src/models/ColumnLike";
import {TableHeaderCell} from "../../src/components/TableHeaderCell";

describe("clicking on a header cell should sort by that header", ()=> {

    var component:React.Component<{},{}> = null;
    const dispatcher = new Dispatcher();

    var sortAction:NewSortAction = null;
    dispatcher.register((action:GigaAction)=> {
        sortAction = action as NewSortAction;
    });

    it("should fire sort actions when clicked even if the column does not specify a sort direction", ()=> {

        ReactTestUtils.renderIntoDocument(
            <table>
                <thead>
                <tr>
                    <TableHeaderCell column={{colTag: "foo", format: ColumnFormat.STRING}} ref={c=>component=c}
                                     dispatcher={dispatcher}
                                     isFirstColumn={false}
                                     isLastColumn={false}/>
                </tr>
                </thead>
            </table>
        );

        ReactTestUtils.Simulate.click(ReactTestUtils.findRenderedDOMComponentWithTag(component, "th"));

        expect(sortAction.type).toEqual(GigaActionType.NEW_SORT);
        expect(sortAction.sortBys.length).toEqual(1);
        expect(sortAction.sortBys[0].direction).toEqual(SortDirection.DESC);

    });

    it("should fire a reverse sort action when clicked again (initially ASC)", ()=> {

        ReactTestUtils.renderIntoDocument(
            <table>
                <thead>
                <tr>
                    <TableHeaderCell column={{colTag: "foo", format: ColumnFormat.STRING, direction: SortDirection.ASC}}
                                     ref={c=>component=c}
                                     dispatcher={dispatcher}
                                     isFirstColumn={false}
                                     isLastColumn={false}/>
                </tr>
                </thead>
            </table>
        );
        ReactTestUtils.Simulate.click(ReactTestUtils.findRenderedDOMComponentWithTag(component, "th"));

        expect(sortAction.type).toEqual(GigaActionType.NEW_SORT);
        expect(sortAction.sortBys.length).toEqual(1);
        expect(sortAction.sortBys[0].direction).toEqual(SortDirection.DESC);
    });

    it("should fire a reverse sort action when clicked again (initially DESC)", ()=> {

        ReactTestUtils.renderIntoDocument(
            <table>
                <thead>
                <tr>
                    <TableHeaderCell column={{colTag: "foo", format: ColumnFormat.STRING, direction: SortDirection.DESC}}
                                     ref={c=>component=c}
                                     dispatcher={dispatcher}
                                     isFirstColumn={false}
                                     isLastColumn={false}/>
                </tr>
                </thead>
            </table>
        );
        ReactTestUtils.Simulate.click(ReactTestUtils.findRenderedDOMComponentWithTag(component, "th"));

        expect(sortAction.type).toEqual(GigaActionType.NEW_SORT);
        expect(sortAction.sortBys.length).toEqual(1);
        expect(sortAction.sortBys[0].direction).toEqual(SortDirection.ASC);
    });

});
