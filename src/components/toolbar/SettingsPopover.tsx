import * as React from "react";
import {GridSubcomponentProps} from "../TableHeaderCell";
import {Column} from "../../models/ColumnLike";
import {SortableItem} from "./SortableItem";
import * as _ from "lodash";
import DragEvent = __React.DragEvent;
import Props = __React.Props;
import {GigaActionType, ColumnUpdateAction} from "../../store/GigaStore";

export interface SettingsPopoverProps extends GridSubcomponentProps<SettingsPopover> {
    subtotalBys:Column[]
    columns:Column[]
    onDismiss:()=>any
}

interface SettingsPopoverState {
    subtotalBys:Column[]
    columns:Column[]
}

export interface SortableDataTransfer {
    type:string
    colTag:string
    idx:number
}

export class SettingsPopover extends React.Component<SettingsPopoverProps, SettingsPopoverState> {

    constructor(props:SettingsPopoverProps) {
        super(props);
        const columns = _.clone(props.columns);
        const subtotalBys = _.clone(props.subtotalBys);
        this.state = {columns, subtotalBys};
    }

    static swapToAnotherListOfColumns(from:Column[],
                                      to:Column[],
                                      src:SortableDataTransfer,
                                      dest:SortableDataTransfer) {
        const item = from.splice(src.idx, 1)[0];
        to.splice(dest.idx + 1, 0, item);
    }

    moveColumn(columns:Column[], src:SortableDataTransfer, dest:SortableDataTransfer) {
        const item = columns.splice(src.idx, 1)[0];
        // the previous step mutates the columns, dest.idx is no longer reliable, we must find it again ...
        const destIdx = _.findIndex(columns, c=>c.colTag === dest.colTag);
        columns.splice(destIdx + 1, 0, item);
    }

    /**
     * insert the column represented by the srcColTag to the column represented by the destColTag
     * TODO use array index instead in the future!
     * @param src
     * @param dest
     */
    updateColumnPosition(src:SortableDataTransfer,
                         dest:SortableDataTransfer) {

        if (src.type === dest.type)
            /**
             * move the src column to a different position within the same list of columns
             */
            this.moveColumn(this.state[src.type], src, dest);
        else
            /**
             * src is in a different list of column than dest, we need to transfer them
             */
            SettingsPopover.swapToAnotherListOfColumns(this.state[src.type], this.state[dest.type], src, dest);

        this.setState({
            columns: this.state.columns,
            subtotalBys: this.state.subtotalBys
        });
    }

    submitStateChanges() {
        const payload:ColumnUpdateAction = {
            type: GigaActionType.COLUMNS_UPDATE,
            columns: this.state.columns,
            subtotalBys: this.state.subtotalBys
        };
        this.props.dispatcher.dispatch(payload);
    }

    renderSortable(type:string, columns:Column[]) {
        const items = columns.map((c, i)=>
            <SortableItem
                key={i}
                column={c}
                idx={i}
                type={type}
                onUpdate={(src,dest)=>this.updateColumnPosition(src, dest)}
            />);
        if (columns.length === 0) {
            return (
                /**
                 * in the event the column is empty, we still want to handle drop events
                 */
                <ul className="giga-grid-sortable"
                    onDragOver={(e)=>e.preventDefault()}
                    onDrop={(e:DragEvent)=>{
                        const srcType = e.dataTransfer.getData('type');const src = {
                            type: srcType,
                            colTag: e.dataTransfer.getData('colTag'),
                            idx:  parseInt(e.dataTransfer.getData('idx'))
                        };
                        var fromList = this.state[srcType];
                        var toList = this.state[type];
                        var dest: SortableDataTransfer = {
                            type: type,
                            colTag: null,
                            idx: 0
                        };
                        SettingsPopover.swapToAnotherListOfColumns(fromList, toList, src, dest);
                        this.setState({
                            columns: this.state.columns,
                            subtotalBys: this.state.subtotalBys
                        });
                    }}>
                    Drop a Column Here to Subtotal By It
                </ul>);
        } else
            return (
                <ul className="giga-grid-sortable">
                    {items}
                </ul>
            )
    }

    render() {
        return (
            <div className="giga-grid-settings-pop-over">
                <div>
                    <h5>Columns</h5>
                    {this.renderSortable("columns", this.state.columns)}
                </div>
                <div>
                    <h5>Subtotal By</h5>
                    {this.renderSortable("subtotalBys", this.state.subtotalBys)}
                </div>
                <span className="submit" style={{color:"green"}} onClick={(e)=>this.submitStateChanges()}><i
                    className="fa fa-2x fa-check-square"/></span>
                {" "}
                <span style={{color:"red"}} className="dismiss" onClick={(e)=>this.props.onDismiss()}><i
                    className="fa fa-2x fa-close"/></span>
            </div>
        );
    }
}
