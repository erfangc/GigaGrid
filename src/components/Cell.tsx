import * as React from 'react';
import * as classNames from 'classnames';
import {Column, AggregationMethod} from "../models/ColumnLike";
import {Row} from "../models/Row";
import {ColumnFormat} from "../models/ColumnLike";
import {SubtotalRow} from "../models/Row";
import {format} from '../static/SubtotalAggregator';
import SyntheticEvent = __React.SyntheticEvent;
import {ToggleCollapseAction} from "../store/GigaStore";
import {GigaActionType} from "../store/GigaStore";
import {GridSubcomponentProps} from "./GigaGrid";

export interface CellProps extends GridSubcomponentProps<Cell> {
    row:Row
    column:Column
    rowHeight:string
    isFirstColumn?:boolean
}


export class Cell extends React.Component<CellProps,any> {

    constructor(props:CellProps) {
        super(props);
    }

    private onCollapseToggle(e:SyntheticEvent) {
        e.preventDefault();
        e.stopPropagation(); // we don't want toggle collapse to also trigger a row / cell clicked event

        const action:ToggleCollapseAction = {
            type: GigaActionType.TOGGLE_ROW_COLLAPSE,
            subtotalRow: this.props.row as SubtotalRow
        };
        this.props.dispatcher.dispatch(action);
    }

    private onClick() {
        var action = {
            type: GigaActionType.TOGGLE_CELL_SELECT,
            row: this.props.row,
            column: this.props.column
        };
        this.props.dispatcher.dispatch(action);
    }

    private renderSubtotalCellWithCollapseBtn(row:SubtotalRow):JSX.Element {

        const cx = classNames({
            "fa": true,
            "fa-plus": row.isCollapsed(),
            "fa-minus": !row.isCollapsed()
        });
        return (
            <td style={this.calculateStyle()} onClick={e=>this.onClick()}>
                <strong>
                    <span>
                        <i className={cx} onClick={e=>this.onCollapseToggle(e)}/>&nbsp;
                        {row.bucketInfo.title || ""}
                    </span>
                </strong>
            </td>
        );
    }

    private calculateStyle() {
        return {
            width: this.props.column.width,
            height: this.props.rowHeight,
            paddingLeft: this.props.isFirstColumn ? TableRowUtils.calculateFirstColumnIdentation(this.props.row) : undefined
        };
    }

    render() {

        var result:JSX.Element;
        const props = this.props;
        const row = props.row;
        const cd = props.column;
        const cx = classNames({
            "numeric": cd.format === ColumnFormat.NUMBER,
            "non-numeric": cd.format !== ColumnFormat.NUMBER
        });

        // cell is the first cell of a subtotal row
        if (props.isFirstColumn && !row.isDetail())
            result = this.renderSubtotalCellWithCollapseBtn(row as SubtotalRow);
        else
            result = (<td className={cx} onClick={e=>this.onClick()}
                          style={this.calculateStyle()}>{Cell.renderNormalCellContent(row, cd)}</td>);

        return result;
    }

    /**
     * Figure out the cell value and then decorated it if necessary. If the user provided a custom renderer this is where we render it and return a component instead of a primitive
     * @param row
     * @param cd
     * @returns {JSX.Element|string|number}
     */
    private static renderNormalCellContent(row:Row, cd:Column) {
        var renderedCellContent: JSX.Element|string|number = "";
        if (cd.cellTemplateCreator)
            renderedCellContent = cd.cellTemplateCreator(row.data()[cd.colTag], cd);
        else {
            renderedCellContent = format(row.data()[cd.colTag], cd.formatInstruction) || "";
            // here we perform ad-decorations, so far just for those columns subtotaled as 'COUNT' and 'COUNT_DISTINCT'
            if (!row.isDetail() && cd.aggregationMethod === AggregationMethod.COUNT || cd.aggregationMethod === AggregationMethod.COUNT_DISTINCT)
                renderedCellContent = `[${renderedCellContent}]`;
        }
        return renderedCellContent;
    }
}

class TableRowUtils {
    public static calculateFirstColumnIdentation(row:Row) {
        /*
         handle when there are no subtotal rows
         */
        if ((row.sectorPath() || []).length === 0)
            return "10px";
        else {
            const identLevel = (row.sectorPath() || []).length;
            return ((row.isDetail() && identLevel !== 0 ? identLevel + 1 : identLevel ) * 25) + 'px';
        }
    }
}