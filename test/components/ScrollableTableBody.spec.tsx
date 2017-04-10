import * as React from 'react';
import * as ReactTestUtils from 'react-addons-test-utils';
import {TestUtils} from '../TestUtils';
import {TreeRasterizer} from '../../src/static/TreeRasterizer';
import {ScrollableTableBody} from '../../src/components/TableBody/ScrollableTableBody';

describe('TableBody', ()=> {

    it('consists of many rows', ()=> {
        const data = TestUtils.newPeopleTestData();
        let component;
        ReactTestUtils.renderIntoDocument(
            <div>
                <ScrollableTableBody ref={c=>component=c} dispatcher={null}
                           rows={data.detailRows()}
                           columns={data.columns()}
                           gridProps={data.gridProps()}/>
            </div>);
        const trs = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'row');
        expect(trs.length).toBe(10);
    });

    it('consists even more rows if the rows include subtotals', ()=> {
        const data = TestUtils.newPeopleTestData();
        const rows = TreeRasterizer.rasterize(data.tree());
        let component;
        ReactTestUtils.renderIntoDocument(
            <div>
                <ScrollableTableBody ref={c=>component=c} dispatcher={null}
                           rows={rows}
                           columns={data.columns()}
                           gridProps={data.gridProps()}/>
            </div>
        );
        const trs = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'row');
        expect(trs.length).toBe(2); // collapsed by default
        // TODO add test case for expanding
    });

});