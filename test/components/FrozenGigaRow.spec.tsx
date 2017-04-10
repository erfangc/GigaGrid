import * as React from 'react';
import {FrozenGigaRow} from '../../src/components/GigaRow/FrozenGigaRow';
import * as ReactTestUtils from 'react-addons-test-utils';
import {TestUtils} from '../TestUtils';
import {Row} from '../../src/models/Row';
import {Column} from '../../src/models/ColumnLike';

/**
 * This test suite is essentially duplicated to make sure a developer doesn't break either class which extends TableBody
 */
describe('GigaRow Components', () => {

    describe('GigaRow rendering of a SubtotalRow', () => {
        let component = null;
        const row:Row = TestUtils.getSimpleSubtotalRow();
        const data = TestUtils.newPeopleTestData();
        const columns:Column[] = TestUtils.getSimpleColumns();
        ReactTestUtils.renderIntoDocument(
            <div>
                <FrozenGigaRow ref={c=>component=c} row={row} rowHeight="25px" columns={columns} dispatcher={null} gridProps={data.gridProps()}/>
            </div>
        );
        const rows:Element[] = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'row');
        const singleRow:HTMLDivElement = rows[0] as HTMLDivElement;

        it('should render a row', () => {
            expect(rows.length).toBe(1);
            expect(singleRow.style.height).toBe('25px');
        });

        it('should have class subtotal-row', () => {
            expect(singleRow.className).toContain('subtotal-row');
        });

    });

    describe('GigaRow rendering of a DetailRow', () => {
        let component = null;
        const row:Row = TestUtils.getDetailRow();
        const data = TestUtils.newPeopleTestData();
        const columns:Column[] = TestUtils.getSimpleColumns();
        ReactTestUtils.renderIntoDocument(
            <div>
                <FrozenGigaRow ref={c=>component=c} row={row} rowHeight="25px" columns={columns}  dispatcher={null} gridProps={data.gridProps()}/>
            </div>
        );
        const rows:Element[] = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'row');
        const singleRow:HTMLDivElement = rows[0] as HTMLDivElement;

        it('should render a row', () => {
            expect(rows.length).toBe(1);
            expect(singleRow.style.height).toBe('25px');
        });

        it('should have class placeholder-false', () => {
            expect(singleRow.className).toContain('detail-row');
            expect(singleRow.className).not.toContain('subtotal-row');
        });
    });

});
