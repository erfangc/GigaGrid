import * as React from 'react';
import {Row} from '../../models/Row';
import {FrozenGigaRow} from '../GigaRow/FrozenGigaRow';
import {TableBody} from './TableBody';

export class FrozenTableBody extends TableBody {
    mapRowsInBody(rowHeight: string, row: Row, i: number): JSX.Element {
        let {columns, dispatcher, gridProps} = this.props;
        return (
            <FrozenGigaRow key={i}
                           columns={columns}
                           row={row}
                           rowHeight={rowHeight}
                           dispatcher={dispatcher}
                           staticLeftHeaders={true}
                           gridProps={gridProps}
            />
        );
    }
}