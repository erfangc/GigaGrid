import * as React from 'react';
import * as classNames from 'classnames';
import {DropdownMenu} from "./DropdownMenu";
import SyntheticEvent = __React.SyntheticEvent;
import {SimpleDropdownMenuItem} from "./DropdownMenu";
import {TableRowColumnDef} from "../../models/ColumnLike";
import {ColumnFormat} from "../../models/ColumnLike";
import {DropdownMenuItemProps} from "./DropdownMenu";
import {GigaGridProps} from "../GigaGrid";
import {GridSubcomponentProps} from "../TableHeader";
import {GigaGridActionType} from "../../store/GigaGridStore";
import {NewSubtotalAction} from "../../store/GigaGridStore";
import {ClearSubtotalAction} from "../../store/GigaGridStore";

export interface SortMenuItemProps extends GridSubcomponentProps<SortMenuItem> {
    isLastColumn?:boolean;
    tableRowColumnDef:TableRowColumnDef;
}

export class SortMenuItem extends React.Component<SortMenuItemProps, any> {
    constructor(props:SortMenuItemProps) {
        super(props);
    }

    render() {
        return (
            <SimpleDropdownMenuItem text="Sort" isLastColumn={this.props.isLastColumn}>
                <li className="dropdown-menu-item hoverable">
                    <span>
                        <i className="fa fa-sort-amount-asc"/>
                    </span>
                    &nbsp;Sort Descending
                </li>
                <li className="dropdown-menu-item hoverable">
                    <span>
                        <i className="fa fa-sort-amount-desc"/>
                    </span>
                    &nbsp;Sort Ascending
                </li>
                <li className="dropdown-menu-item hoverable">
                    <span>
                        <i className="fa fa-sort-amount-asc"/>
                    </span>
                    &nbsp;Add Sort Descending
                </li>
                <li className="dropdown-menu-item hoverable">
                    <span>
                        <i className="fa fa-sort-amount-desc"/>
                    </span>
                    &nbsp;Add Sort Ascending
                </li>
                <li className="dropdown-menu-item hoverable">
                    <span>
                        <i className="fa fa-ban"/>
                    </span>
                    &nbsp;Clear All Sort
                </li>
            </SimpleDropdownMenuItem>
        );
    }
}

// TODO wire up events
export interface SubtotalByMenuItemProps extends GridSubcomponentProps<SubtotalByMenuItem> {
    isLastColumn?:boolean;
    tableRowColumnDef:TableRowColumnDef;
}

export class SubtotalByMenuItem extends React.Component<SubtotalByMenuItemProps, any> {

    constructor(props:SubtotalByMenuItemProps) {
        super(props);
    }

    private input:HTMLInputElement;

    private isNumericColumn():boolean {
        return this.props.tableRowColumnDef.format === ColumnFormat.NUMBER;
    }

    private onSubmit(e:SyntheticEvent) {
        const action:NewSubtotalAction = {
            type: GigaGridActionType.NEW_SUBTOTAL,
            subtotalBys: [{
                colTag: this.props.tableRowColumnDef.colTag
            }]
        };
        this.props.dispatcher.dispatch(action);
    }

    private onCancel(e:SyntheticEvent) {
        this.props.dispatcher.dispatch({
            type: GigaGridActionType.CLEAR_SUBTOTAL
        });
    }

    private renderAddSubtotal() {

        const cx = classNames({
            "dropdown-menu-item": true,
            "hoverable": !this.isNumericColumn()
        });

        const style = {
            width: this.isNumericColumn() ? "13em" : null
        };

        if (this.isNumericColumn())
            return (
                <div className={cx} style={style} onClick={e=>{e.preventDefault();e.stopPropagation();}}>
                    {this.renderForm()}
                    <span className="dropdown-menu-item hoverable">
                        <i className="fa fa-plus"/>
                        &nbsp;
                        <span onClick={e=>this.onSubmit(e)}>Add Subtotal</span>
                    </span>
                </div>
            );
        else
            return (
                <li onClick={e=>this.onSubmit(e)} className="dropdown-menu-item hoverable">
                    <i className="fa fa-plus"/>
                    &nbsp;
                    <span>Add Subtotal</span>
                </li>
            );
    }

    private renderClearSubtotal() {
        return (
            <li onClick={e=>this.onCancel(e)} className="dropdown-menu-item hoverable">
                <i className="fa fa-ban"/>
                &nbsp;
                <span>Clear All Subtotal</span>
            </li>
        );
    }

    private renderForm() {
        return (
            <div>
                <label>
                    Enter Buckets to Subtotal By
                    <input type="text" ref={(c)=>this.input=c} placeholder="ex: 1,3,5,7,9"/>
                </label>
            </div>
        );
    }

    render() {
        return (
            <SimpleDropdownMenuItem text="Subtotal" isLastColumn={this.props.isLastColumn}>
                {this.renderAddSubtotal()}
                {this.renderClearSubtotal()}
            </SimpleDropdownMenuItem>
        );
    }
}
