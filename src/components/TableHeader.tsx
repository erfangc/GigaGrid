import * as React from 'react';
import { Column } from '../models/ColumnLike';
import { TableHeaderCell } from './TableHeaderCell';
import { GridComponentProps } from './GigaGrid';

export interface TableHeaderProps extends GridComponentProps<TableHeader> {
    tableHeaderClass?: string;
    columns: Column[][];
    staticLeftHeaders: number;
    setRightHeader: (c: HTMLDivElement) => void;
}

/**
 * terminology: column groups are columns that can span multiple `leaf` columns and physically reside
 * on top of `leaf` columns
 *
 * `leaf` columns are the real columns that are associated with the cells in the table
 */
export class TableHeader extends React.Component<TableHeaderProps, any> {

    constructor(props: TableHeaderProps) {
        super(props);
    }

    renderCells(): JSX.Element[] {
        let { columns } = this.props;
        return columns[0].map((column: Column, i: number) => {
            return (
                <TableHeaderCell
                    column={column}
                    key={i}
                    isFirstColumn={i === 0}
                    isLastColumn={i === columns.length - 1}
                    columnNumber={i}
                    tableHeaderClass={this.props.tableHeaderClass}
                    gridProps={this.props.gridProps}
                    dispatcher={this.props.dispatcher}
                />
            );
        });
    }

    render(): JSX.Element {
        let cells = this.renderCells();
        let { staticLeftHeaders, setRightHeader } = this.props;
        let frozen = cells.slice(0, this.props.staticLeftHeaders);
        let scrollable = cells.slice(this.props.staticLeftHeaders);
        let maybeFrozen = staticLeftHeaders > 0 ? (
            <div className="frozen">
                <div className="row">
                    {frozen}
                </div>
            </div>
        ) : null;
        return (
            <div className="header">
                {maybeFrozen}
                <div className="scrollable" ref={setRightHeader}>
                    <div className="row">
                        {scrollable}
                    </div>
                </div>
            </div>
        );
    }

}