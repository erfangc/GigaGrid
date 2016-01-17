import * as React from 'react';
import Dispatcher = Flux.Dispatcher;
import * as classNames from 'classnames';
import {Column} from "../models/ColumnLike";
import {DropdownMenu} from "./dropdown/DropdownMenu";
import {SimpleDropdownMenuItem} from "./dropdown/DropdownMenu";
import {ColumnFormat} from "../models/ColumnLike";
import {SortMenuItem} from "./dropdown/SortMenuItem";
import {GigaAction} from "../store/GigaStore";
import ReactDOM = __React.ReactDOM;
import {SortDirection} from "../models/ColumnLike";
import {SubtotalByMenuItem} from "./dropdown/SubtotalByMenuItem";
import {FilterMenuItem} from "./dropdown/FilterMenuItem";
import {parsePixelValue} from "../static/WidthMeasureCalculator";

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
        return (
            <span style={{position:"relative"}}>
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

        const cx = classNames({
            "fa": true,
            "fa-bars": true,
            "dropdown-menu-toggle-handle-hide": !this.state.handleVisible
        });

        const style = {
            width: this.props.tableColumnDef.width,
            overflow: "visible"
        };

        const dropdownMenuToggle = (
            <i key={1} className={cx} ref={c=>this.dropdownToggleHandleRef=c}
               onClick={()=>this.dropdownMenuRef.toggleDisplay()}/>
        );

        return (
            <th style={style} onMouseEnter={()=>this.setState({handleVisible:true})}
                onMouseLeave={()=>this.setState({handleVisible:false})}
                className={columnDef.format === ColumnFormat.NUMBER ? "numeric" : "non-numeric"}>
                {this.props.isLastColumn ? [dropdownMenuToggle," "] : null}
                <span>
                    {columnDef.title || columnDef.colTag}
                </span>
                {this.renderSortIcon()}
                {!this.props.isLastColumn ? [" ", dropdownMenuToggle] : null}
                {this.renderDropdownMenu()}
            </th>
        );
    }

}
