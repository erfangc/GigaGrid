import * as React from "react";
import {DragEvent, SyntheticEvent} from "react";
import {Column, AggregationMethod, ColumnFormat} from "../../models/ColumnLike";
import {SortableItem} from "./SortableItem";
import * as _ from "lodash";
import {GigaActionType, GigaAction} from "../../store/GigaStore";
import "./SettingsPopover.styl";
import * as classNames from "classnames";
import {ColumnUpdateAction} from "../../store/reducers/ColumnUpdateReducer";
import {AdditionalButton} from "../GigaGrid";

export interface SettingsPopoverProps {
    subtotalBys: Column[]
    columns: Column[]
    onSubmit: (action: GigaAction)=>any
    onDismiss: ()=>any
    additionalUserButtons: AdditionalButton[]
}

interface SettingsPopoverState {
    subtotalBys: Column[]
    columns: Column[]
    activeColumn: Column // the column being edited
}

export interface SortableDataTransfer {
    type: string
    colTag: string
    idx: number
}

export class SettingsPopover extends React.Component<SettingsPopoverProps, SettingsPopoverState> {

    constructor(props: SettingsPopoverProps) {
        super(props);
        const columns = _.clone(props.columns);
        const subtotalBys = _.clone(props.subtotalBys);
        const activeColumn = undefined;
        this.state = {columns, subtotalBys, activeColumn};
    }

    /**
     * move the src from the `from` list to after the dest column in the `to` list
     * @param from
     * @param to
     * @param src
     * @param dest
     */
    private static swapToAnotherListOfColumns(from: Column[],
                                       to: Column[],
                                       src: SortableDataTransfer,
                                       dest: SortableDataTransfer) {
        const item = from.splice(src.idx, 1)[0];
        to.splice(dest.idx + 1, 0, item);
    }

    /**
     * moves the src column to after the dest column within the same list
     * @param columns
     * @param src
     * @param dest
     */
    private moveColumn(columns: Column[], src: SortableDataTransfer, dest: SortableDataTransfer) {
        const item = columns.splice(src.idx, 1)[0];
        // need a more reliable way to to determine destIdx, given that the same column could be repeated in the list
        const destIdx = _.findIndex(columns, c => c.colTag === dest.colTag);
        columns.splice(destIdx + 1, 0, item);
    }

    /**
     * insert the column represented by the srcColTag to the column represented by the destColTag
     * @param src
     * @param dest
     */
    private updateColumnPosition(src: SortableDataTransfer,
                                 dest: SortableDataTransfer) {

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

        this.setState(_.assign<{}, SettingsPopoverState>({}, this.state, {
            columns: this.state.columns,
            subtotalBys: this.state.subtotalBys
        }));
    }

    commitColumnUpdates() {
        const payload: ColumnUpdateAction = {
            type: GigaActionType.COLUMNS_UPDATE,
            columns: this.state.columns,
            subtotalBys: this.state.subtotalBys
        };
        this.props.onSubmit.call(undefined, payload);
    }

    renderSortable(type: string, columns: Column[]) {
        const items = columns.map((c, i) =>
            <SortableItem
                key={i}
                column={c}
                idx={i}
                type={type}
                onClick={(function(column:Column) {
                    this.setState(_.assign<{},SettingsPopoverState>({}, this.state, {activeColumn: column}));
                }).bind(this)}
                onUpdate={(src,dest)=>this.updateColumnPosition(src, dest)}
            />);
        if (columns.length === 0) {
            return (
                /**
                 * in the event the column is empty, we still want to handle drop events
                 */
                <ul className="giga-grid-sortable"
                    onDragOver={e => e.preventDefault()}
                    onDrop={(e:DragEvent)=>{
                        const srcType = e.dataTransfer.getData('type');
                        const src = {
                            type: srcType,
                            colTag: e.dataTransfer.getData('colTag'),
                            idx:  parseInt(e.dataTransfer.getData('idx'))
                        };
                        const fromList = this.state[srcType];
                        const toList = this.state[type];
                        const dest: SortableDataTransfer = {
                            type: type,
                            colTag: null,
                            idx: 0
                        };
                        SettingsPopover.swapToAnotherListOfColumns(fromList, toList, src, dest);
                        this.setState(_.assign<{},SettingsPopoverState>({},this.state, {
                            columns: this.state.columns,
                            subtotalBys: this.state.subtotalBys
                        }));
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
        const activeColumn = this.state.activeColumn;
        const layoutControlClassDict: ClassDictionary = {
            "giga-grid-flex-column": true,
            "column-50": !!activeColumn,
            "column-100": activeColumn !== null
        };
        const layoutControlClassName = classNames(layoutControlClassDict);
        return (
            <div className="giga-grid-settings-pop-over" onClick={e=>e.stopPropagation()}>
                <h3>Configure table columns</h3>
                <div className="row">
                    <div className={layoutControlClassName}>
                        <div>
                            <h5>Columns</h5>
                            {this.renderSortable("columns", this.state.columns)}
                        </div>
                        <div>
                            <h5>Subtotal By</h5>
                            {this.renderSortable("subtotalBys", this.state.subtotalBys)}
                        </div>
                        <div>
                    <span className="giga-grid-button"
                          onClick={()=>this.props.onSubmit.call(undefined,{type:GigaActionType.EXPAND_ALL})}>Expand All</span>
                            {" "}
                            <span className="giga-grid-button"
                                  onClick={()=>this.props.onSubmit.call(undefined,{type:GigaActionType.COLLAPSE_ALL})}>Collapse All</span>
                            {" "}
                            <span className="giga-grid-button"
                                  onClick={()=>this.props.onSubmit.call(undefined,{type:GigaActionType.CLEAR_SORT})}>Clear Sort</span>
                        </div>
                        <br/>
                        {this.renderAdditionalUserButtons()}
                        <div>
                        </div>
                    </div>
                    {this.renderColumnConfigurer(activeColumn)}
                </div>
                <div>
                    <span className="giga-grid-button" style={{float: "right"}}
                          onClick={(e)=>this.props.onDismiss()}>
                        Close <i className="fa fa-times"/>
                    </span>

                    <span className="giga-grid-button" style={{float: "right"}}
                          onClick={(e)=>this.commitColumnUpdates()}>
                        Save <i className="fa fa-save"/>
                    </span>
                </div>
            </div>
        );
    }

    private renderAdditionalUserButtons() {
        let additionalUserButtons = this.props.additionalUserButtons;
        return (
            <div>
                {additionalUserButtons.map(function (additionalUserButton) {
                    return <span className="giga-grid-button" key={additionalUserButton.name}
                                 onClick={()=>additionalUserButton.customCallback()}>{additionalUserButton.name}</span>
                })}
            </div>
        );
    }

    private renderColumnConfigurer(column?: Column): JSX.Element | string {
        if (!column)
            return "";

        function onTitleChange(e: SyntheticEvent) {
            e.preventDefault();
            column.title = (e.target as HTMLInputElement).value;
            this.setState(_.assign<{},SettingsPopoverState>({}, this.state, {column: column}));
        }

        function onAggregationMethodChange(e: SyntheticEvent) {
            e.preventDefault();
            //noinspection TypeScriptValidateTypes
            column.aggregationMethod = parseInt((e.target as HTMLSelectElement).value);
            this.setState(_.assign<{},SettingsPopoverState>({}, this.state, {column: column}));
        }

        function onFormatChange(e: SyntheticEvent) {
            e.preventDefault();
            //noinspection TypeScriptValidateTypes
            column.format = parseInt((e.target as HTMLSelectElement).value);
            this.setState(_.assign<{},SettingsPopoverState>({}, this.state, {column: column}));
        }

        return (
            <div className="giga-grid-flex-column column-50">
                <div>
                    <h5 className="inline-label">Title</h5>
                    <span className="giga-grid-button dismiss"
                          onClick={()=>this.setState(_.assign<{},SettingsPopoverState>({},this.state,{activeColumn: undefined}))}><i
                        className="fa fa-chevron-left"/></span>
                </div>
                <input type="text" className="giga-grid-text-input" placeholder="Title" value={column.title}
                       onChange={onTitleChange.bind(this)}/>
                <br/>
                <div>
                    <div className="column-50">
                        <h5>Aggregation Method</h5>
                        <select value={AggregationMethod[column.aggregationMethod]}
                                onChange={onAggregationMethodChange.bind(this)}>
                            <option type="radio" value={AggregationMethod[AggregationMethod.SUM]}>Sum</option>
                            <option type="radio" value={AggregationMethod[AggregationMethod.COUNT]}>Count</option>
                            <option type="radio" value={AggregationMethod[AggregationMethod.COUNT_DISTINCT]}>
                                Count Distinct
                            </option>
                            <option type="radio" value={AggregationMethod[AggregationMethod.RANGE]}>Range</option>
                            <option type="radio" value={AggregationMethod[AggregationMethod.AVERAGE]}>Average</option>
                            <option type="radio" value={AggregationMethod[AggregationMethod.WEIGHTED_AVERAGE]}>
                                Weighted Average
                            </option>
                        </select>
                    </div>
                    <div className="column-50">
                        <h5>Format</h5>
                        <select value={ColumnFormat[column.format]} onChange={onFormatChange.bind(this)}>
                            <option value={ColumnFormat[ColumnFormat.CURRENCY]}>Currency</option>
                            <option value={ColumnFormat[ColumnFormat.DATE]}>Date</option>
                            <option value={ColumnFormat[ColumnFormat.NUMBER]}>Number</option>
                            <option value={ColumnFormat[ColumnFormat.STRING]}>String</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}
