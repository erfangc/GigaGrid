import * as React from 'react';
import * as classNames from 'classnames';
import {DropdownMenu} from "./DropdownMenu";
import SyntheticEvent = __React.SyntheticEvent;
import {SimpleDropdownMenuItem} from "./DropdownMenu";
import {TableRowColumnDef} from "../../models/ColumnLike";
import {ColumnFormat} from "../../models/ColumnLike";
import {DropdownMenuItemProps} from "./DropdownMenu";
import {GigaProps} from "../GigaGrid";
import {GridSubcomponentProps} from "../TableHeader";
import {GigaActionType} from "../../store/GigaStore";
import {NewSubtotalAction} from "../../store/GigaStore";
import {ClearSubtotalAction} from "../../store/GigaStore";
import {NewSortAction} from "../../store/GigaStore";
import {GigaAction} from "../../store/GigaStore";
import {SortBy} from "../../models/ColumnLike";
import {SortDirection} from "../../models/ColumnLike";

export interface SortMenuItemProps extends GridSubcomponentProps<SortMenuItem> {
    isLastColumn?:boolean;
    tableRowColumnDef:TableRowColumnDef;
}

export class SortMenuItem extends React.Component<SortMenuItemProps, any> {

    constructor(props:SortMenuItemProps) {
        super(props);
    }

    private dispatchSortAction(action:GigaAction) {
        this.props.dispatcher.dispatch(action);
    }

    private createSortByFromColumnDef(dir?:SortDirection):SortBy {

        function reverseSortDirection(dir:SortDirection):SortDirection {
            if (dir === undefined)
                return SortDirection.DESC;
            else if (dir === SortDirection.ASC)
                return SortDirection.DESC;
            else if (dir === SortDirection.DESC)
                return SortDirection.ASC;
        }

        const cd = this.props.tableRowColumnDef;
        return {
            colTag: cd.colTag,
            format: cd.format,
            customSortFn: cd.customSortFn,
            direction: dir || reverseSortDirection(cd.sortDirection),
        };

    }

    private renderSortAscending() {

        return (
            <li className="dropdown-menu-item hoverable" onClick={()=>{
                const action = {
                    sortBys: [this.createSortByFromColumnDef(SortDirection.ASC)],
                    type: GigaActionType.NEW_SORT
                };
                this.dispatchSortAction(action);
            }}>
                <span>
                    <i className="fa fa-sort-amount-asc"/>
                </span>
                &nbsp;Sort Ascending
            </li>
        );
    }

    private renderSortDescending() {
        return (
            <li className="dropdown-menu-item hoverable" onClick={()=>{
                const action = {
                    sortBys: [this.createSortByFromColumnDef(SortDirection.DESC)],
                    type: GigaActionType.NEW_SORT
                };
                this.dispatchSortAction(action);
            }}>
                <span>
                    <i className="fa fa-sort-amount-desc"/>
                </span>
                &nbsp;Sort Descending
            </li>
        );
    }

    private renderAddSortAscending() {
        return (
            <li className="dropdown-menu-item hoverable" onClick={()=>{
                const action = {
                    sortBy: this.createSortByFromColumnDef(SortDirection.ASC),
                    type: GigaActionType.ADD_SORT
                };
                this.dispatchSortAction(action);
            }}>
                <span>
                    <i className="fa fa-sort-amount-asc"/>
                </span>
                &nbsp;Add Sort Ascending
            </li>
        );
    }

    private renderAddSortDescending() {
        return (
            <li className="dropdown-menu-item hoverable" onClick={()=>{
                const action = {
                    sortBys: this.createSortByFromColumnDef(SortDirection.DESC),
                    type: GigaActionType.ADD_SORT
                };
                this.dispatchSortAction(action);
            }}>
                <span>
                    <i className="fa fa-sort-amount-desc"/>
                </span>
                &nbsp;Add Sort Descending
            </li>
        );
    }

    private renderClearSort() {
        return (
            <li className="dropdown-menu-item hoverable" onClick={()=>{
                const action = {
                    type: GigaActionType.CLEAR_SORT
                };
                this.dispatchSortAction(action);
            }}>
                <span>
                    <i className="fa fa-ban"/>
                </span>
                &nbsp;Clear All Sort
            </li>
        );
    }

    render() {
        return (
            <SimpleDropdownMenuItem text="Sort" isLastColumn={this.props.isLastColumn}>
                {this.renderSortDescending()}
                {this.renderSortAscending()}
                {this.renderAddSortDescending()}
                {this.renderAddSortAscending()}
                {this.renderClearSort()}
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
            type: GigaActionType.NEW_SUBTOTAL,
            subtotalBys: [{
                colTag: this.props.tableRowColumnDef.colTag
            }]
        };
        this.props.dispatcher.dispatch(action);
    }

    private onCancel(e:SyntheticEvent) {
        this.props.dispatcher.dispatch({
            type: GigaActionType.CLEAR_SUBTOTAL
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