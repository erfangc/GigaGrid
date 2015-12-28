import * as React from 'react';
import Dispatcher = Flux.Dispatcher;
import * as classNames from 'classnames';
import {TableRowColumnDef} from "../models/ColumnLike";
import {DropdownMenu} from "./dropdown/DropdownMenu";
import {SimpleDropdownMenuItem} from "./dropdown/DropdownMenu";
import {ColumnFormat} from "../models/ColumnLike";
import {SubtotalByMenuItem} from "./dropdown/StandardMenuItems";
import {SortMenuItem} from "./dropdown/StandardMenuItems";
import {GigaGridAction} from "../store/GigaGridStateStore";
import DOMElement = __React.DOMElement;
import ReactDOM = __React.ReactDOM;

export interface GridSubcomponentProps<T> extends React.Props<T> {
    dispatcher: Dispatcher<GigaGridAction>;
}

export interface TableHeaderProps extends GridSubcomponentProps<TableHeader> {
    tableColumnDef: TableRowColumnDef;
    isFirstColumn?: boolean;
    isLastColumn?: boolean;
}

class TableHeaderState {
    handleVisible:boolean;
}

export class TableHeader extends React.Component<TableHeaderProps,TableHeaderState> {

    private dropdownMenuRef:DropdownMenu;

    constructor(props:TableHeaderProps) {
        super(props);
        this.state = {handleVisible: false};
    }

    private renderDropdownMenu() {
        return (
            <DropdownMenu ref={(c:DropdownMenu)=>this.dropdownMenuRef=c} alignLeft={this.props.isLastColumn}>
                <SortMenuItem tableRowColumnDef={this.props.tableColumnDef} isLastColumn={this.props.isLastColumn}
                              dispatcher={this.props.dispatcher}/>
                <SubtotalByMenuItem tableRowColumnDef={this.props.tableColumnDef} isLastColumn={this.props.isLastColumn}
                                    dispatcher={this.props.dispatcher}/>
            </DropdownMenu>
        );
    }

    private renderHeaderAddon() {
        if (this.props.isFirstColumn)
            return null;

        const cx = classNames({
            "fa": true,
            "fa-bars": true,
            "dropdown-menu-toggle-handle-hide": !this.state.handleVisible
        });

        return (
            <span style={{position:"relative"}}>
                &nbsp;
                <i className={cx} onClick={()=>this.dropdownMenuRef.toggleDisplay()}/>
                {this.renderDropdownMenu()}
            </span>
        );
    }

    render() {
        const columnDef = this.props.tableColumnDef;
        return (
            <th onMouseEnter={()=>this.setState({handleVisible:true})}
                onMouseLeave={()=>this.setState({handleVisible:false})}
                className={columnDef.format === ColumnFormat.NUMBER ? "numeric" : "non-numeric"}>
                <span>
                    {columnDef.title || columnDef.colTag}
                </span>
                {this.renderHeaderAddon()}
            </th>
        );
    }
}