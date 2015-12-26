import * as React from 'react';
import {DropdownMenu} from "./DropdownMenu";
import SyntheticEvent = __React.SyntheticEvent;
import {SimpleDropdownMenuItem} from "./DropdownMenu";
import {TableRowColumnDef} from "../../models/ColumnLike";
import {ColumnFormat} from "../../models/ColumnLike";
import className = require('classnames');
import {DropdownMenuItemProps} from "./DropdownMenu";

// TODO wire up events
export interface SubtotalByMenuItemProps extends React.Props<SubtotalByMenuItem> {
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
        e.stopPropagation();
        e.preventDefault();
        // TODO emit event
    }

    private onCancel(e:SyntheticEvent) {
        e.stopPropagation();
        e.preventDefault();
        // TODO emit event
    }

    private renderAddSubtotal() {

        const cx = className({
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
                <li className="dropdown-menu-item hoverable">
                    <i className="fa fa-plus"/>
                    &nbsp;
                    <span onClick={e=>this.onSubmit(e)}>Add Subtotal</span>
                </li>
            );
    }

    private renderCancelSubtotal() {
        return (
            <li className="dropdown-menu-item hoverable">
                <i className="fa fa-ban"/>
                &nbsp;
                <span onClick={e=>this.onCancel(e)}>Clear Subtotal</span>
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
                {this.renderCancelSubtotal()}
            </SimpleDropdownMenuItem>
        );
    }
}