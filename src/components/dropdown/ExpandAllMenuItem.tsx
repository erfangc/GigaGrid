import * as React from 'react';
import {GridSubcomponentProps} from "../TableHeaderCell";
import {SimpleDropdownMenuItem} from "./DropdownMenu";
import {Column} from "../../models/ColumnLike";
import {GigaActionType} from "../../store/GigaStore";

export interface ExpandAllMenuItemProps extends GridSubcomponentProps<ExpandAllMenuItem> {
    isLastColumn?:boolean;
    tableRowColumnDef:Column;
    // TODO think about what props would be needed for the filter to function
}

export class ExpandAllMenuItem extends React.Component<ExpandAllMenuItemProps, any> {

    constructor(props:ExpandAllMenuItemProps) {
        super(props);
    }

    render() {
        return (
            <SimpleDropdownMenuItem onClick={(e)=>{
                this.props.dispatcher.dispatch({
                    type: GigaActionType.EXPAND_ALL
                })
            }} text="Expand All" isLastColumn={this.props.isLastColumn}/>
        );
    }
}