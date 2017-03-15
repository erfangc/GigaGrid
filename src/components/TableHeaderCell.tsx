import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { Column, SortDirection } from '../models/ColumnLike';
import { GridComponentProps } from './GigaGrid';
import { GigaActionType, ColumnResizeAction } from '../store/GigaStore';
import { SortUpdateAction } from '../store/handlers/SortReducers';

export interface TableHeaderProps extends GridComponentProps<TableHeaderCell> {
    column: Column;
    tableHeaderClass?: string;
    isFirstColumn?: boolean;
    isLastColumn?: boolean;
    columnNumber: number;
}

export class TableHeaderCell extends React.Component<TableHeaderProps, {}> {

    constructor(props: TableHeaderProps) {
        super(props);
    }

    renderSortIcon() {
        classNames();
        const { direction } = this.props.column;
        if (direction !== undefined) {
            const cx = classNames({
                'fa': true,
                'fa-sort-asc': direction === SortDirection.ASC,
                'fa-sort-desc': direction === SortDirection.DESC
            });
            return (
                <span>
                    {' '}<i className={cx} />
                </span>
            );
        }
    }

    render() {
        const column = this.props.column;

        const style = {
            height: '15px',
            width: `${column.width}px`,
            minWidth: column.minWidth ? `${column.minWidth}px` : '75px'
        };
        return (
            <div style={style}
                onClick={() => {
                    const { direction } = this.props.column;
                    const sortBy: Column = Object.assign({}, this.props.column, {
                        direction: direction === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC
                    });
                    const payload: SortUpdateAction = {
                        type: GigaActionType.NEW_SORT,
                        sortBys: [sortBy]
                    };
                    this.props.dispatcher.dispatch(payload);
                }}
                className="cell">
                {column.title || column.colTag}
                {this.renderSortIcon()}
                <span
                    style={{ cursor: 'col-resize', float: 'right', width: '3px' }}
                    draggable
                    onDragEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        let cellNode: HTMLDivElement = ReactDOM.findDOMNode(this) as HTMLDivElement;
                        let action: ColumnResizeAction = {
                            type: GigaActionType.COLUMN_RESIZE,
                            column: column,
                            newWidth: e.clientX - cellNode.getBoundingClientRect().right + column.width
                        };
                        this.props.dispatcher.dispatch(action);
                    }}>&nbsp;
                    </span>
            </div>
        );


    }

}
