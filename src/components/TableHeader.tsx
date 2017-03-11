import * as React from "react";
import { Column } from "../models/ColumnLike";
import { TableHeaderCell } from "./TableHeaderCell";
import { GridComponentProps, getHorizontalScrollbarThickness } from "./GigaGrid";

export interface TableHeaderProps extends GridComponentProps<TableHeader> {
    tableHeaderClass?: string;
    columns: Column[][];
    staticLeftHeaders: number;
    setRightHeader: (c: HTMLDivElement) => void;
}

/**
 * terminology: column groups are columns that can span multiple `leaf` columns and physically reside
 * on top of `leaf` columns
 *
 * `leaf` columns are the real columns that are associated with the cells in the table
 */
export class TableHeader extends React.Component<TableHeaderProps, any> {

    constructor(props: TableHeaderProps) {
        super(props);
    }

    render() {
        return (
            <div className="header-table">
                {this.renderHeaderRows()}
            </div>
        );
    }

    private renderHeaderRows(): JSX.Element[] {
        const trs: JSX.Element[] = [];
        let i: number;
        for (i = 0; i < this.props.columns.length - 1; i++) {
            trs.push(TableHeader.renderColumnGroups(this.props.columns[i], i));
        }
        trs.push(this.renderLeafColumns(this.props.columns[i], i));
        return trs;
    }

    private static renderColumnGroups(columns: Column[], key: number): JSX.Element {
        const ths = columns.map((column: Column, i: number) => {
            const style: any = {
                width: column.colSpan + "px"
            };
            return (
                <div className="column-group" key={i} style={style}>
                    <span className="content header-text">{column.title}</span>
                </div>
            );
        });
        return (<div className="column-group-row" key={key}>{ths}</div>);
    }

    private renderLeafColumns(columns: Column[], key: number): JSX.Element {
        const ths = columns.map((column: Column, i: number) => {
            return (
                <TableHeaderCell
                    column={column}
                    key={i}
                    isFirstColumn={i === 0}
                    isLastColumn={i === columns.length - 1}
                    columnNumber={i}
                    tableHeaderClass={this.props.tableHeaderClass}
                    gridProps={this.props.gridProps}
                    dispatcher={this.props.dispatcher}
                />
            );
        });
        // add a placeholder to offset the scrollbar
        ths.push(<div className="blank-header-cell text-align-right table-header" key={ths.length}
            style={{ minWidth: '0', width: `${getHorizontalScrollbarThickness() + 5}px` }}>&nbsp;</div>);
        if (this.props.staticLeftHeaders > 0) {
            const leftHeaders = ths.slice(0, this.props.staticLeftHeaders);
            const rightScrollingHeaders = ths.slice(this.props.staticLeftHeaders);
            let {setRightHeader} = this.props;
            return (
                <div key={key}>
                    <div className="left-static-headers">{leftHeaders}</div>
                    <div ref={setRightHeader} style={{maxWidth: "100%"}} className="right-scrolling-headers">{rightScrollingHeaders}</div>
                </div>
            );
        }
        else {
            return (<div className="right-scrolling-headers" key={key}>{ths}</div>);
        }
    }

}