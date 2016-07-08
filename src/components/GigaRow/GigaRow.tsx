import * as React from "react";
import * as classNames from "classnames";
import {Row, GenericRow} from "../../models/Row";
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

export class GigaRow extends React.Component<GigaRowProps, any> {

    constructor(props:GigaRowProps) {
        super(props);
    }

    render() {
        const props = this.props;
        const subtotalLvlClassName = `subtotal-row-${(props.row as GenericRow).sectorPath().length - 1}`;
        const rowClassNames:ClassDictionary = {
            "giga-grid-row": true,
            "placeholder-false": true,
            "subtotal-row": !props.row.isDetail(),
            "detail-row": props.row.isDetail(),
            "selected": props.row.isSelected(),
        };
        rowClassNames[subtotalLvlClassName] = props.row.isDetail() ? false : true;
        const cx = classNames(rowClassNames);
        const cells = props
            .columns
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

    mapColumnToCell(column:Column, i:number){
        throw "Must extend GigaRow, cannot use is as a component directly!";
    }
}
