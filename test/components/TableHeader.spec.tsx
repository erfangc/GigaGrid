import * as React from 'react';
import * as ReactTestUtils from 'react-addons-test-utils';
import {TableHeader} from "../../src/components/TableHeader";
import {TestUtils} from "../TestUtils";
import {ColumnFactory} from "../../src/models/ColumnLike";

describe("TableHeader", ()=> {

    var component;
    it("renders flat columns properly, i.e. no column grouping", ()=> {

        const columns = ColumnFactory
            .createColumnsFromDefinition(
                TestUtils.getMockColumnDefs(),
                TestUtils.getMockState());

        ReactTestUtils.renderIntoDocument(
            <table>
                <TableHeader ref={c=>component=c}
                             columns={[columns]}
                             dispatcher={null}/>
            </table>
        );

        const trs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, "tr");

        expect(trs.length).toBe(1);

    });

    describe("renders column groups properly", ()=> {
        const columns = ColumnFactory
            .createColumnsFromGroupDefinition(
                TestUtils.getMockColumnGroupDefs(),
                TestUtils.getMockColumnDefs(),
                TestUtils.getMockState());

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