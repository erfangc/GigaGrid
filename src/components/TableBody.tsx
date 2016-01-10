import * as React from 'react';
import {GridSubcomponentProps} from "./TableHeaderCell";
import {Column} from "../models/ColumnLike";
import {Row} from "../models/Row";
import {GigaRow} from "./GigaRow";

export interface TableBodyProps extends GridSubcomponentProps<TableBody> {
    rows: Row[]
    columns: Column[]
}

export class TableBody extends React.Component<TableBodyProps,any> {

    constructor(props:TableBodyProps) {
        super(props);
    }

    render() {

        const rows:JSX.Element[] = this.props.rows.map((row:Row, i: number) => {
            return (<GigaRow key={i}
                             columns={this.props.columns}
                             row={row}
                             dispatcher={this.props.dispatcher}/>);
        });

        return (
            <tbody>
                {rows}
            </tbody>
        );
    }
}