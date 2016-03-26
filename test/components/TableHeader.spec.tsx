import * as React from 'react';
import * as ReactTestUtils from 'react-addons-test-utils';
import {TableHeader} from "../../src/components/TableHeader";
import {TestUtils} from "../TestUtils";
import {ColumnFactory} from "../../src/models/ColumnLike";

describe("TableHeader", ()=> {

    var component;

    describe("renders column groups properly", ()=> {
        const mockState = TestUtils.getMockState();
        mockState.columns = TestUtils.getMockColumnDefs();
        const columns = ColumnFactory.createColumnsFromGroupDefinition(
                TestUtils.getMockColumnGroupDefs(),
                mockState);

        ReactTestUtils.renderIntoDocument(
            <table>
                <TableHeader ref={c=>component=c}
                             columns={columns}
                             dispatcher={null}/>
            </table>
        );

        const trs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, "tr");

        it("rendered two rows of headers", ()=> {
            expect(trs.length).toBe(2);
        });

        it("row 1 has colspan defined on its th", ()=> {
            const ths = (trs[0] as HTMLTableRowElement).children;
            expect(ths.length).toBe(2); // +1 for placeholder
            expect((ths[0] as HTMLTableHeaderCellElement).colSpan).toBe(2);
            expect((ths[1] as HTMLTableHeaderCellElement).colSpan).toBe(3);
        });
    });
});