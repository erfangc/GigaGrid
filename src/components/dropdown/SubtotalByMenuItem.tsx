import * as React from 'react';
import * as classNames from  'classnames';
import * as _ from 'lodash';
import {GridSubcomponentProps} from "../TableHeaderCell";
import {Column} from "../../models/ColumnLike";
import {ColumnFormat} from "../../models/ColumnLike";
import SyntheticEvent = __React.SyntheticEvent;
import {NewSubtotalAction} from "../../store/GigaStore";
import {GigaActionType} from "../../store/GigaStore";
import {SimpleDropdownMenuItem} from "./DropdownMenu";
import FormEvent = __React.FormEvent;
import {SubtotalBy} from "../../models/ColumnLike";
import input = __React.__Addons.TestUtils.Simulate.input;
import {DetailRow} from "../../models/Row";

export interface SubtotalByMenuItemProps extends GridSubcomponentProps<SubtotalByMenuItem> {
    isLastColumn?:boolean;
    column:Column;
}

export class SubtotalByMenuItem extends React.Component<SubtotalByMenuItemProps, any> {

    constructor(props:SubtotalByMenuItemProps) {
        super(props);
    }

    private input:HTMLInputElement;
    private errorMessage:string;

    private isNumericColumn():boolean {
        return this.props.column.format === ColumnFormat.NUMBER;
    }

    private onSubmit(e:SyntheticEvent) {
        var subtotalBy:SubtotalBy = {
            colTag: this.props.column.colTag
        };
        if (this.isNumericColumn()) {
            if (this.getInputErrors(this.input).length > 0)
                return;
            else // create a bucketing function that will produce the correct sector title for every detail row
                subtotalBy.groupBy = (detailRow:DetailRow) => {
                    const cutoffs:Array<number> = this.input.value.split(",").map(entry=>parseFloat(entry));
                    cutoffs.sort();
                    var column = this.props.column;
                    const value = detailRow.getByColTag(column.colTag) || 0;

                    if (value > cutoffs[cutoffs.length - 1])
                        return `${column.title} ${cutoffs[cutoffs.length - 1]} +`;
                    for (var i = cutoffs.length - 2; i >= 0; i--) {
                        if (cutoffs[i] < value)
                            return `${column.title} ${cutoffs[i]} - ${cutoffs[i + 1]}`
                    }
                    return `${column.title} ${cutoffs[0]} -`;
                }
        }
        const action:NewSubtotalAction = {
            type: GigaActionType.NEW_SUBTOTAL,
            subtotalBys: [subtotalBy]
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

        const style = {};

        if (this.isNumericColumn())
            return [
                <div key={1} className={cx} style={style} onClick={e=>{e.preventDefault();e.stopPropagation();}}>
                    {this.renderForm()}
                </div>,
                <li key={2} className="dropdown-menu-item hoverable">
                    <i className="fa fa-plus"/>
                    &nbsp;
                    <span onClick={e=>this.onSubmit(e)}>Add Subtotal</span>
                </li>
            ];
        else
            return (
                [
                    <li key={1} onClick={e=>this.onSubmit(e)} className="dropdown-menu-item hoverable">
                        <i className="fa fa-plus"/>
                        &nbsp;
                        <span>Add Subtotal</span>
                    </li>
                ]
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
                <div>
                    Enter Buckets to Subtotal By
                </div>
                <input type="text" onChange={(e)=>this.handleInputChange(e)} ref={(c)=>this.input=c}
                       placeholder="ex: 1,3,5,7,9"/>
                <div style={{color:"red"}}>
                    {this.errorMessage}
                </div>
            </div>
        );
    }

    private getInputErrors(input:HTMLInputElement):Array<string> {
        // validator function
        function validate(entry) {
            if (isNaN(entry) && entry !== "")
                return entry;
            else
                return null;
        }

        const val:string = input.value;
        return _.compact(val.split(",").map((entry)=>validate(entry)));
    }

    private handleInputChange(e:FormEvent) {
        const errors = this.getInputErrors(e.target as HTMLInputElement);
        if (errors.length > 0)
            this.errorMessage = `'${errors.join(", ")}' Must Be Number(s)`;
        else
            this.errorMessage = "";

        this.setState({});
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
