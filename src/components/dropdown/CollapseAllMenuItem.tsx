import * as React from 'react';
import {GridSubcomponentProps} from "../TableHeaderCell";
import {SimpleDropdownMenuItem} from "./DropdownMenu";
import {Column} from "../../models/ColumnLike";
import {GigaActionType} from "../../store/GigaStore";

export interface CollapseAllMenuItemProps extends GridSubcomponentProps<CollapseAllMenuItem> {
    isLastColumn?:boolean;
    tableRowColumnDef:Column;
    // TODO think about what props would be needed for the filter to function
}

export class CollapseAllMenuItem extends React.Component<CollapseAllMenuItemProps, any> {

    constructor(props:CollapseAllMenuItemProps) {
        super(props);
    }

    render() {
        return (
            <SimpleDropdownMenuItem onClick={(e)=>{
                this.props.dispatcher.dispatch({
                    type: GigaActionType.COLLAPSE_ALL
                })
            }} text="Collapse All" isLastColumn={this.props.isLastColumn}/>
        );
    }
}