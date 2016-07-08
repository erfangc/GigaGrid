import * as React from "react";
import * as classNames from "classnames";
import {Column, ColumnFormat, SortDirection} from "../models/ColumnLike";
import {GridSubcomponentProps} from "./GigaGrid";
import {GigaActionType} from "../store/GigaStore";
import * as _ from "lodash";
import {ToolbarToggle} from "./toolbar/Toolbar";
import {SortUpdateAction} from "../store/reducers/SortReducers";

export interface TableHeaderProps extends GridSubcomponentProps<TableHeaderCell> {
    column:Column
    tableHeaderClass?:string
    isFirstColumn?:boolean
    isLastColumn?:boolean
    columnNumber:number
}

export class TableHeaderCell extends React.Component<TableHeaderProps,{}> {

    constructor(props:TableHeaderProps) {
        super(props);
    }

    renderSortIcon() {
        classNames();
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

        const componentClasses:ClassDictionary = {
            "text-align-right": column.format === ColumnFormat.NUMBER,
            "text-align-left": column.format !== ColumnFormat.NUMBER
        };

        if (this.props.tableHeaderClass)
            componentClasses[`${this.props.tableHeaderClass}`] = true;
        else
            componentClasses["table-header"] = true;

        componentClasses[`giga-grid-column-${this.props.columnNumber}`] = true;
        const cx = classNames(componentClasses);

        if(_.isFunction(column.headerTemplateCreator)){
            return (
                <div className={cx}>
                    <span className="content header-text">
                        {column.headerTemplateCreator(column)}
                    </span>
                </div>
            );
        }
        else{
            const style = {
                overflow: "visible",
                position: "relative"
            };

            return (
                <div style={style}
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
                    <span className="content header-text">
                        {column.title || column.colTag}
                    </span>
                    {this.renderSortIcon()}
                    {this.renderToolbar()}
                </div>
            );
        }

    }

    renderToolbar() {
        if (this.props.isFirstColumn && !this.props.gridProps.disableConfiguration)
            return (<ToolbarToggle dispatcher={this.props.dispatcher}/>);
        else
            return null;
    }

}
