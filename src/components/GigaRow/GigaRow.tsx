import * as React from "react";
import * as classNames from "classnames";
import {Row} from "../../models/Row";
import {Column} from "../../models/ColumnLike";
import {GigaActionType} from "../../store/GigaStore";
import {GridComponentProps, GigaProps} from "../GigaGrid";
import {CellProps, Cell} from "../Cell";

export interface GigaRowProps extends GridComponentProps<GigaRow> {
    row: Row;
    rowHeight: string;
    columns: Column[];
    staticLeftHeaders?: boolean;
    scrollableRightData?: boolean;
    gridProps: GigaProps
}

export abstract class GigaRow extends React.Component<GigaRowProps, any> {

    constructor(props: GigaRowProps) {
        super(props);
    }

    render() {
        let {row, rowHeight, columns} = this.props;
        let subtotalLvlClassName = `subtotal-row-${row.sectorPath.length - 1}`;
        let rowClassNames: ClassDictionary = {
            "giga-grid-row": true,
            "placeholder-false": true,
            "subtotal-row": !row.isDetailRow(),
            "detail-row": row.isDetailRow(),
            "selected": row.selected,
        };
        rowClassNames[subtotalLvlClassName] = row.isDetailRow() ? false : true;
        let cx = classNames(rowClassNames);
        let cells = columns.map((column, i) => GigaRow.renderCell(this.getCellProps(column, i)));
        return (
            <div className={cx}
                 style={{height: rowHeight}}
                 onClick={(e:MouseEvent) => this.rowSelect(e)}
            >
                {cells}
            </div>
        );
    }

    rowSelect(e: MouseEvent) {
        e.preventDefault();
        let {dispatcher, row} = this.props;
        let action = {
            type: GigaActionType.TOGGLE_ROW_SELECT,
            row: row
        };
        dispatcher.dispatch(action);
    }

    /**
     * renders a cell given the cell's props
     */
    protected static renderCell(props: CellProps): JSX.Element {
        let {row, column} = props;
        // if the user provided us with a cellTemplateCreator function, we will use that function to render the cell
        if (column.cellTemplateCreator) {
            return column.cellTemplateCreator(row, column, props);
        } else {
            return (
                <Cell
                    {...props}
                />
            );
        }
    }

    abstract getCellProps(column: Column, i: number): CellProps
}
