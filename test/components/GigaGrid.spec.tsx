import * as React from 'react';
import * as ReactTestUtils from 'react-addons-test-utils';
import {ColumnDef} from '../../src/models/ColumnLike';
import {GigaGrid} from '../../src/components/GigaGrid';
import {TestUtils} from '../TestUtils';

describe('GigaGrid', ()=> {

    it('can render a basic table', () => {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const columnDefs:ColumnDef[] = peopleData.columnDefs();
        let component: GigaGrid = null;
        ReactTestUtils.renderIntoDocument(<GigaGrid ref={c=>component=c} data={data} columnDefs={columnDefs}/>);
        const rows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'row');
        expect(rows.length).toBe(10);
        expect((rows as HTMLTableRowElement[])[0].children[0].textContent.substr(0, 5)).toBe('Maria');
    });

    it('it can render a subtotaled HTML table (as indicated by the presence of additional rows in the DOM)', () => {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const columnDefs:ColumnDef[] = peopleData.columnDefs();
        let component: React.Component<any, any> = null;
        ReactTestUtils.renderIntoDocument(<GigaGrid ref={c=>component=c} data={data} columnDefs={columnDefs} initialSubtotalBys={[{colTag: 'gender'}]}/>);
        const rows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'subtotal-row');
        expect(rows.length).toBe(2); // collapsed by default
        // TODO add test for expanded columns
    });

    it('it can render a subtotaled HTML table with initialSubtotalBys as strings', () => {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const columnDefs:ColumnDef[] = peopleData.columnDefs();
        let component: React.Component<any, any> = null;
        ReactTestUtils.renderIntoDocument(<GigaGrid ref={c=>component=c} data={data} columnDefs={columnDefs} initialSubtotalBys={['gender']}/>);
        const rows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'subtotal-row');
        expect(rows.length).toBe(2); // collapsed by default
    });

    it('it can render a sorted HTML table with initialSubtotalBys as Columns', () => {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const columnDefs:ColumnDef[] = peopleData.columnDefs();
        let component: React.Component<any, any> = null;
        ReactTestUtils.renderIntoDocument(<GigaGrid ref={c=>component=c} data={data} columnDefs={columnDefs} initialSortBys={[{colTag: 'gift', 'direction': 0}]}/>);
        const rows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'row');
        const textOfFirstRow = rows[0].textContent;
        expect(textOfFirstRow.charAt(textOfFirstRow.length-1)).toBe('2');
    });

    it('it can render a sorted HTML table with initialSubtotalBys as strings', () => {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const columnDefs:ColumnDef[] = peopleData.columnDefs();
        let component: React.Component<any, any> = null;
        ReactTestUtils.renderIntoDocument(<GigaGrid ref={c=>component=c} data={data} columnDefs={columnDefs} initialSortBys={['gift']}/>);
        const rows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'row');
        const textOfFirstRow = rows[0].textContent;
        expect(textOfFirstRow.charAt(textOfFirstRow.length-1)).toBe('2');
    });
});
