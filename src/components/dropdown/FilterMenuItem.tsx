import * as React from 'react';
import {GridSubcomponentProps} from "../TableHeader";
import {SimpleDropdownMenuItem} from "./DropdownMenu";
import {TableRowColumnDef} from "../../models/ColumnLike";

export interface FilterMenuItemProps extends GridSubcomponentProps<FilterMenuItem> {
    isLastColumn?:boolean;
    tableRowColumnDef:TableRowColumnDef;
    // TODO think about what props would be needed for the filter to function
}

export class FilterMenuItem extends React.Component<FilterMenuItemProps, any> {

    constructor(props:FilterMenuItemProps) {
        super(props);
    }

    render() {
        // TODO wire up behavior
        return (
            <SimpleDropdownMenuItem text="Filter" isLastColumn={this.props.isLastColumn}>
                <div>
                    <label>
                        Enter Your Filtering Criteria
                        <input type="text" placeholder="use >, < or =, ex: > 50"/>
                    </label>
                </div>
                <div className="dropdown-menu-item hoverable">
                    <i className="fa fa-check"/>
                    &nbsp;
                    <span>Apply</span>
                </div>
                <div className="dropdown-menu-item hoverable">
                    <i className="fa fa-ban"/>
                    &nbsp;
                    <span>Clear</span>
                </div>
            </SimpleDropdownMenuItem>
        );
    }
}