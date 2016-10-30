import * as React from "react";
import * as classNames from "classnames";
import {Row} from "../../models/Row";
import {Column} from "../../models/ColumnLike";
import {GigaActionType} from "../../store/GigaStore";
import SyntheticEvent = __React.SyntheticEvent;
import {GridSubcomponentProps, GigaProps} from "../GigaGrid";

export interface GigaRowProps extends GridSubcomponentProps<GigaRow> {
    row:Row;
    rowHeight: string;
    columns:Column[];
    staticLeftHeaders?: boolean;
    scrollableRightData?: boolean;
    gridProps: GigaProps
}

export abstract class GigaRow extends React.Component<GigaRowProps, any> {

    constructor(props:GigaRowProps) {
        super(props);
    }

    render() {
        const {row, columns} = this.props;
        const subtotalLvlClassName = `subtotal-row-${row.sectorPath.length - 1}`;
        const rowClassNames:ClassDictionary = {
            "giga-grid-row": true,
            "placeholder-false": true,
            "subtotal-row": !row.isDetailRow(),
            "detail-row": row.isDetailRow(),
            "selected": row.selected,
        };
        rowClassNames[subtotalLvlClassName] = row.isDetailRow() ? false : true;
        const cx = classNames(rowClassNames);
        const cells = columns
            .map(this.mapColumnToCell.bind(this));
        return <div className={cx} style={{height: this.props.rowHeight}} onClick={(e:SyntheticEvent)=>{
            e.preventDefault();
            var action = {
                type: GigaActionType.TOGGLE_ROW_SELECT,
                row: this.props.row
            };
            this.props.dispatcher.dispatch(action);
        }}>{cells}</div>
    }

    abstract mapColumnToCell(column: Column, i: number)
}
