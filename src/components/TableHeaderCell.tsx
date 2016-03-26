import * as React from "react";
import * as classNames from "classnames";
import {Column, ColumnFormat, SortDirection} from "../models/ColumnLike";
import {GridSubcomponentProps} from "./GigaGrid";
import {NewSortAction, GigaActionType} from "../store/GigaStore";

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
        if (this.props.column.direction != undefined) {
            const cx = classNames({
                "fa": true,
                "fa-sort-asc": this.props.column.direction === SortDirection.ASC,
                "fa-sort-desc": this.props.column.direction === SortDirection.DESC
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
            <th style={style}
                onClick={()=>{
                    const {colTag, format, direction} = this.props.column;
                    const sortBy: Column = {
                        colTag: colTag,
                        format: format,
                        direction: direction === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC
                    };
                    const payload: NewSortAction = {
                        type: GigaActionType.NEW_SORT,
                        sortBys: [sortBy]
                    };
                    this.props.dispatcher.dispatch(payload);
                }}
                className={cx}>
                <span className="header-text">
                    {column.title || column.colTag}
                </span>
                {this.renderSortIcon()}
            </th>
        );
    }

}
