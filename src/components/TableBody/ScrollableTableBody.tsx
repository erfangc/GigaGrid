import * as React from 'react';
import {TableBody} from './TableBody';
import {Row} from '../../models/Row';
import {ScrollableGigaRow} from '../GigaRow/ScrollableGigaRow';

export class ScrollableTableBody extends TableBody {
    mapRowsInBody(rowHeight: string, row: Row, i: number) {
        let {columns, dispatcher, gridProps} = this.props;
        return (
            <ScrollableGigaRow key={i}
                               columns={columns}
                               row={row}
                               rowHeight={rowHeight}
                               dispatcher={dispatcher}
                               scrollableRightData={true}
                               gridProps={gridProps}
            />
        );
    }
}