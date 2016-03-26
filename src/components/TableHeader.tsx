import * as React from "react";
import {GridSubcomponentProps} from "../../src/components/TableHeaderCell";
import {Column} from "../../src/models/ColumnLike";
import {TableHeaderCell} from "./TableHeaderCell";
import Element = JSX.Element;

export interface TableHeaderProps extends GridSubcomponentProps<TableHeader> {
    columns: Column[][]
}

/**
 * terminology: column groups are columns that can span multiple `leaf` columns and physically reside
 * on top of `leaf` columns
 *
 * `leaf` columns are the real columns that are associated with the cells in the table
 */
export class TableHeader extends React.Component<TableHeaderProps,any> {

    constructor(props:TableHeaderProps) {
        super(props);
    }

    render() {
        return (
            <thead>
                {this.renderHeaderRows()}
            </thead>
        )
    }

    private renderHeaderRows():Element[] {
        const trs:Element[] = [];
        var i:number;
        for (i = 0; i < this.props.columns.length - 1; i++)
            trs.push(TableHeader.renderColumnGroups(this.props.columns[i], i));
        trs.push(this.renderLeafColumns(this.props.columns[i], i));
        return trs;
    }

    private static renderColumnGroups(columns:Column[], key:number):Element {
        const ths = columns.map((column:Column, i:number)=> {
            return (
                <th className="column-group" key={i} colSpan={column.colSpan}>{column.title}</th>
            );
        });
        return (<tr className="column-group-row" key={key}>{ths}</tr>);
    }

    private renderLeafColumns(columns:Column[], key:number):Element {
        const ths = columns.map((colDef:Column, i:number)=> {
            return <TableHeaderCell column={colDef} key={i} isFirstColumn={i===0}
                                    isLastColumn={i===columns.length-1} dispatcher={this.props.dispatcher}/>
        });
        return (<tr key={key}>{ths}</tr>);
    }

}