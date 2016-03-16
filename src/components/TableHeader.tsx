import * as React from 'react';
import * as _ from "lodash";
import {GridSubcomponentProps} from "../../src/components/TableHeaderCell";
import {Column} from "../../src/models/ColumnLike";
import Element = JSX.Element;
import {TableHeaderCell} from "./TableHeaderCell";
import {getScrollBarWidth} from "../static/WidthMeasureCalculator";

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
        for (i = 0; i < this.props.columns.length - 1; i++) {
            trs.push(TableHeader.renderColumnGroups(this.props.columns[i], i));
        }
        trs.push(this.renderLeafColumns(this.props.columns[i], i));
        return trs;
    }

    private static renderColumnGroups(columns:Column[], key:number):Element {
        const ths = columns.map((column:Column, i:number)=> {
            return (
                <th className="column-group" key={i} colSpan={column.colSpan}>{column.title}</th>
            );
        });
        ths.push(TableHeader.renderPlaceholder("column-group"));
        return (<tr className="column-group-row" key={key}>{ths}</tr>);
    }

    private renderLeafColumns(columns:Column[], key:number):Element {
        const ths = columns.map((colDef:Column, i:number)=> {
            return <TableHeaderCell tableColumnDef={colDef} key={i} isFirstColumn={i===0}
                                    isLastColumn={i===columns.length-1} dispatcher={this.props.dispatcher}/>
        });
        ths.push(TableHeader.renderPlaceholder());
        return (<tr key={key}>{ths}</tr>);
    }

    private static renderPlaceholder(className?:string) {
        const scrollBarWidth = getScrollBarWidth();
        /*
         add an placeholder to align the header with cells
         https://github.com/erfangc/GigaGrid/issues/7
         */
        return (<th key="placeholder" className={className}
                    style={{width: scrollBarWidth + "px"}}/>);
    }

}