import * as React from 'react';
import { Column } from '../../models/ColumnLike';
import { Row } from '../../models/Row';
import { GridComponentProps } from '../GigaGrid';

export interface TableBodyProps extends GridComponentProps<TableBody> {
    rows: Row[];
    columns: Column[];
    rowHeight?: string;
}

export class TableBody extends React.Component<TableBodyProps, any> {

    constructor(props: TableBodyProps) {
        super(props);
    }

    renderRows(rowHeight: string, start?: number, end?: number): JSX.Element[] {
        const { rows } = this.props;
        return rows.map((row: Row, i: number) => this.mapRowsInBody(rowHeight, row, i));
    }

    mapRowsInBody(rowHeight: string, row: Row, i: number): JSX.Element {
        throw 'Must extend TableBody, cannot use is as a component directly!';
    }

    render() {
        let { rowHeight } = this.props;
        let rows = this.renderRows(rowHeight);
        return (
            <div>
                {rows}
            </div>
        );
    }

}
