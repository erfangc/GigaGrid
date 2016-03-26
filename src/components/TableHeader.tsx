import * as React from "react";
import {Column} from "../../src/models/ColumnLike";
import {TableHeaderCell} from "./TableHeaderCell";
import {GridSubcomponentProps, getScrollBarWidth} from "./GigaGrid";

export interface TableHeaderProps extends GridSubcomponentProps<TableHeader> {
    columns:Column[][]
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

    private renderHeaderRows():JSX.Element[] {
        const trs:JSX.Element[] = [];
        var i:number;
        for (i = 0; i < this.props.columns.length - 1; i++)
            trs.push(TableHeader.renderColumnGroups(this.props.columns[i], i));
        trs.push(this.renderLeafColumns(this.props.columns[i], i));
        return trs;
    }

    /**
     * TODO th with colSpan really screw up our ability to set width on columns
     */
    private static renderColumnGroups(columns:Column[], key:number):JSX.Element {
        const ths = columns.map((column:Column, i:number)=> {
            return (
                <th className="column-group" key={i} colSpan={column.colSpan}>{column.title}</th>
            );
        });
        return (<tr className="column-group-row" key={key}>{ths}</tr>);
    }

    private renderLeafColumns(columns:Column[], key:number):JSX.Element {
        const ths = columns.map((column:Column, i:number)=> {
            return <TableHeaderCell column={column} key={i}
                                    isFirstColumn={i===0}
                                    isLastColumn={i===columns.length-1}
                                    dispatcher={this.props.dispatcher}/>
        });
        // add a placeholder to offset the scrollbar
        ths.push(<th key={ths.length} style={{width:`${getScrollBarWidth()}px`}}/>);
        return (<tr key={key}>{ths}</tr>);
    }

}