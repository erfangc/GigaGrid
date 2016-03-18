import * as React from "react";
import * as classNames from "classnames";
import {Column, ColumnFormat, SortDirection} from "../models/ColumnLike";
import {DropdownMenu, SimpleDropdownMenuItem} from "./dropdown/DropdownMenu";
import {SortMenuItem} from "./dropdown/SortMenuItem";
import {GigaAction, GigaActionType} from "../store/GigaStore";
import {SubtotalByMenuItem} from "./dropdown/SubtotalByMenuItem";
import {FilterMenuItem} from "./dropdown/FilterMenuItem";
import Dispatcher = Flux.Dispatcher;
import ReactDOM = __React.ReactDOM;

export interface GridSubcomponentProps<T> extends React.Props<T> {
    dispatcher: Dispatcher<GigaAction>;
}

export interface TableHeaderProps extends GridSubcomponentProps<TableHeaderCell> {
    tableColumnDef: Column
    isFirstColumn?: boolean
    isLastColumn?: boolean
}
// Comment
class TableHeaderState {
    handleVisible:boolean;
}

export class TableHeaderCell extends React.Component<TableHeaderProps,TableHeaderState> {

    private dropdownMenuRef:DropdownMenu;
    private dropdownToggleHandleRef:HTMLElement;

    constructor(props:TableHeaderProps) {
        super(props);
        this.state = {handleVisible: false};
    }

    private renderDropdownMenu() {

        const cx = classNames({
            "dropdown-menu-toggle-handle": true,
            "fa": true,
            "fa-bars": true,
            "dropdown-menu-toggle-handle-hide": !this.state.handleVisible
        });

        return (
            <span style={{position:"absolute", right: "5px"}}>
                <i key={1} className={cx} ref={c=>this.dropdownToggleHandleRef=c}
                   onClick={()=>this.dropdownMenuRef.toggleDisplay()}/>
                <DropdownMenu ref={(c:DropdownMenu)=>this.dropdownMenuRef=c} alignLeft={this.props.isLastColumn}
                              toggleHandle={()=>this.dropdownToggleHandleRef}>
                    <SortMenuItem tableRowColumnDef={this.props.tableColumnDef} isLastColumn={this.props.isLastColumn}
                                  dispatcher={this.props.dispatcher}/>
                    <SubtotalByMenuItem column={this.props.tableColumnDef}
                                        isLastColumn={this.props.isLastColumn}
                                        dispatcher={this.props.dispatcher}/>
                    <FilterMenuItem dispatcher={this.props.dispatcher}
                                    isLastColumn={this.props.isLastColumn}
                                    tableRowColumnDef={this.props.tableColumnDef}/>
                    <SimpleDropdownMenuItem onClick={()=>{
                                this.props.dispatcher.dispatch({
                                type: GigaActionType.COLLAPSE_ALL
                                })
                        }} text="Collapse All" isLastColumn={this.props.isLastColumn}/>
                    <SimpleDropdownMenuItem onClick={()=>{
                                this.props.dispatcher.dispatch({
                                    type: GigaActionType.EXPAND_ALL
                                })
                        }} text="Expand All" isLastColumn={this.props.isLastColumn}/>
                </DropdownMenu>
            </span>

        );
    }

    renderSortIcon() {
        if (this.props.tableColumnDef.sortDirection != undefined) {
            const cx = classNames({
                "fa": true,
                "fa-sort-asc": this.props.tableColumnDef.sortDirection === SortDirection.ASC,
                "fa-sort-desc": this.props.tableColumnDef.sortDirection === SortDirection.DESC
            });
            return (
                <span>
                    <i className={cx}/>
                </span>
            );
        }
    }

    render() {
        const columnDef = this.props.tableColumnDef;

        const style = {
            overflow: "visible",
            position: "relative"
        };

        const cx = classNames({
            "table-header": true,
            "numeric": columnDef.format === ColumnFormat.NUMBER,
            "non-numeric": columnDef.format !== ColumnFormat.NUMBER
        });

        return (
            <th style={style} onMouseEnter={()=>this.setState({handleVisible:true})}
                onMouseLeave={()=>this.setState({handleVisible:false})}
                className={cx}>
                <span className="header-text">
                    {columnDef.title || columnDef.colTag}
                </span>
                {this.renderSortIcon()}
                {this.renderDropdownMenu()}
            </th>
        );
    }

}
