import * as React from "react";
import * as ReactTestUtils from "react-addons-test-utils";
import {ColumnDef} from "../../src/models/ColumnLike";
import {GigaGrid} from "../../src/components/GigaGrid";
import {TestUtils} from "../TestUtils";

describe('GigaGrid', ()=> {

    it("can render a basic table", () => {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const columnDefs:ColumnDef[] = peopleData.columnDefs();
        var component: React.Component<any, any> = null;
        ReactTestUtils.renderIntoDocument(<GigaGrid ref={c=>component=c} data={data} columnDefs={columnDefs}/>);
        const rows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "giga-grid-row");
        expect(rows.length).toBe(10);
        expect((rows as HTMLTableRowElement[])[0].children[0].textContent.substr(0, 5)).toBe("Maria");
    });

    it("it can render a subtotaled HTML table (as indicated by the presence of additional rows in the DOM)", () => {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const columnDefs:ColumnDef[] = peopleData.columnDefs();
        var component: React.Component<any, any> = null;
        ReactTestUtils.renderIntoDocument(<GigaGrid ref={c=>component=c} data={data} columnDefs={columnDefs} initialSubtotalBys={[{colTag: "gender"}]}/>);
        const rows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "subtotal-row");
        expect(rows.length).toBe(2); // collapsed by default
        // TODO add test for expanded columns
    });

});
