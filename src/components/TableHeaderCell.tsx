import * as React from "react";
import * as classNames from "classnames";
import {Column, ColumnFormat, SortDirection} from "../models/ColumnLike";
import {GigaAction} from "../store/GigaStore";
import Dispatcher = Flux.Dispatcher;
import ReactDOM = __React.ReactDOM;

export interface GridSubcomponentProps<T> extends React.Props<T> {
    dispatcher: Dispatcher<GigaAction>;
}

export interface TableHeaderProps extends GridSubcomponentProps<TableHeaderCell> {
    column: Column
    isFirstColumn?: boolean
    isLastColumn?: boolean
}

// Comment
class TableHeaderState {
    handleVisible:boolean;
}

export class TableHeaderCell extends React.Component<TableHeaderProps,TableHeaderState> {

    constructor(props:TableHeaderProps) {
        super(props);
        this.state = {handleVisible: false};
    }

    renderSortIcon() {
        if (this.props.column.sortDirection != undefined) {
            const cx = classNames({
                "fa": true,
                "fa-sort-asc": this.props.column.sortDirection === SortDirection.ASC,
                "fa-sort-desc": this.props.column.sortDirection === SortDirection.DESC
            });
            return (
                <span>
                    <i className={cx}/>
                </span>
            );
        }
    }

    render() {
        const column = this.props.column;

        const style = {
            overflow: "visible",
            position: "relative"
        };

        const cx = classNames({
            "table-header": true,
            "numeric": column.format === ColumnFormat.NUMBER,
            "non-numeric": column.format !== ColumnFormat.NUMBER
        });

        return (
            <th style={style} onMouseEnter={()=>this.setState({handleVisible:true})}
                onMouseLeave={()=>this.setState({handleVisible:false})}
                className={cx}>
                <span className="header-text">
                    {column.title || column.colTag}
                </span>
                {this.renderSortIcon()}
            </th>
        );
    }

}
