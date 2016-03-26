import * as React from "react";
import * as classNames from "classnames";
import {Column, ColumnFormat, SortDirection} from "../models/ColumnLike";
import {GridSubcomponentProps} from "./GigaGrid";
import {SortUpdateAction, GigaActionType} from "../store/GigaStore";
import * as _ from "lodash";

export interface TableHeaderProps extends GridSubcomponentProps<TableHeaderCell> {
    column:Column
    isFirstColumn?:boolean
    isLastColumn?:boolean
}

export class TableHeaderCell extends React.Component<TableHeaderProps,{}> {

    constructor(props:TableHeaderProps) {
        super(props);
    }

    renderSortIcon() {
        const {direction} = this.props.column;
        if (direction != undefined) {
            const cx = classNames({
                "fa": true,
                "fa-sort-asc": direction === SortDirection.ASC,
                "fa-sort-desc": direction === SortDirection.DESC
            });
            return (
                <span>
                    {' '}<i className={cx}/>
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
                    const {direction} = this.props.column;
                    const sortBy: Column = _.assign<{},Column>({},this.props.column, {
                        direction: direction === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC
                    });
                    const payload: SortUpdateAction = {
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
