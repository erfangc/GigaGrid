import * as React from "react";
import * as ReactTestUtils from "react-addons-test-utils";
import {ColumnDef} from "../../src/models/ColumnLike";
import {GigaGrid} from "../../src/components/GigaGrid";
import {TestUtils} from "../TestUtils";

describe('GigaGrid', ()=> {

    it("can render a basic HTML table", () => {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const columnDefs:ColumnDef[] = peopleData.columnDefs();
        var component: React.Component<any, any> = null;
        ReactTestUtils.renderIntoDocument(<GigaGrid ref={c=>component=c} data={data} columnDefs={columnDefs}/>);
        const trs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, "tr");
        expect(trs.length).toBe(11);
        expect((trs as HTMLTableRowElement[])[0].children[0].textContent.substr(0, 10)).toBe("First Name");
    });

    it("it can render a subtotaled HTML table (as indicated by the presence of additional `tr` in the DOM)", () => {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const columnDefs:ColumnDef[] = peopleData.columnDefs();
        var component: React.Component<any, any> = null;
        ReactTestUtils.renderIntoDocument(<GigaGrid ref={c=>component=c} data={data} columnDefs={columnDefs} initialSubtotalBys={[{colTag: "gender"}]}/>);
        const trs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, "tr");
        expect(trs.length).toBe(3); // collapsed by default
        // TODO add test for expanded columns
    });

});
