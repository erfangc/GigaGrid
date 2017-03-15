import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { Column, ColumnFormat, SortDirection } from '../models/ColumnLike';
import { GridComponentProps } from './GigaGrid';
import { GigaActionType, ColumnResizeAction } from '../store/GigaStore';
import { ToolbarToggle } from './toolbar/Toolbar';
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

        const componentClasses = {
            'cell': true,
            'text-align-right': column.format === ColumnFormat.NUMBER,
            'text-align-left': column.format !== ColumnFormat.NUMBER
        };

        if (this.props.tableHeaderClass) {
            componentClasses[`${this.props.tableHeaderClass}`] = true;
        } else {
            componentClasses['table-header'] = true;
        }

        componentClasses[`giga-grid-column-${this.props.columnNumber}`] = true;
        const cx = classNames(componentClasses);

        if (typeof column.headerTemplateCreator === 'function') {
            return (
                <div className={cx}>
                    <span className="content header-text">
                        {column.headerTemplateCreator(column)}
                    </span>
                </div>
            );
        }
        else {
            const style = {
                width: `${column.width}px`,
                minWidth: column.minWidth ? `${column.minWidth}px` : '75px',
                overflow: 'visible',
                position: 'relative'
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
                    className={cx}>
                    <span className="content header-text">
                        {column.title || column.colTag}
                    </span>
                    {this.renderSortIcon()}
                    {this.renderToolbar()}
                    <span
                        style={{ cursor: 'col-resize', float: 'right', backgroundColor: '#ebebeb', width: '3px', marginLeft: '2px' }}
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

    renderToolbar() {
        if (this.props.isFirstColumn && !this.props.gridProps.disableConfiguration) {
            return (<ToolbarToggle dispatcher={this.props.dispatcher} />);
        } else {
            return null;
        }
    }

}
