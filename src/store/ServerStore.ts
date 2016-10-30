import {ReduceStore} from "flux/utils";
import {Dispatcher} from "flux";
import {GigaState, GigaProps} from "../components/GigaGrid";
import {ScrollCalculator} from "../static/ScrollCalculator";
import {GigaStore, GigaActionType, GigaAction, PROGRESSIVE_RENDERING_THRESHOLD} from "./GigaStore";
import {InitializeAction, decorateInitialSortBys, decorateColumnsWithSort} from "./reducers/InitializeReducer";
import {TreeRasterizer} from "../static/TreeRasterizer";
import {
    ToggleCellSelectAction,
    cellSelectReducer,
    ToggleRowSelectAction,
    rowSelectReducer
} from "./reducers/SelectReducers";
import {cleartSortReducer, SortUpdateAction, sortUpdateReducer} from "./reducers/SortReducers";
import {ChangeRowDisplayBoundsAction, changeDisplayBoundsReducer} from "./reducers/ChangeRowDisplayBoundsReducer";
import {Column, BucketInfo} from "../models/ColumnLike";
import {TreeBuilder} from "../static/TreeBuilder";
import {Row} from "../models/Row";
import {ToggleCollapseAction, toggleCollapseReducer} from "./reducers/RowCollapseReducers";
import {SortFactory} from "../static/SortFactory";
import $ = require('jquery');

/**
 * Initial state reducer for Server store
 * will not use client side aggregation or pre-sorting etc ... won't even read the `data` prop
 * @param action
 * @return GigaState
 */
function initialStateReducer(action: InitializeAction): GigaState {
    const {
        initialData,
        columnDefs,
        initialSortBys,
        initialSubtotalBys,
        initialFilterBys,
        expandTable,
        additionalUserButtons
    } = action.props;
    /**
     * turn ColumnDefs into "Columns" which are decorated with behaviors
     */
    const columns = columnDefs.map(columnDef=> {
        return _.assign<{},Column>({}, columnDef, {});
    });
    /**
     * create sortBys from columns (any properties passed via initialSortBys will override the same property in the corresponding Column object
     */
    const columnsWithSort: Column[] = decorateColumnsWithSort(columns, initialSortBys);
    const sortBys = decorateInitialSortBys(initialSortBys, columnsWithSort);

    /**
     * create subtotalBys from columns (any properties passed in via initialSubtotalBys will override the same property on the corresponding Column object
     */
    const subtotalBys: Column[] = (initialSubtotalBys || []).map(subtotalBy => {
        const column: Column = _.find(columns, column => column.colTag === subtotalBy.colTag);
        return _.assign<{}, Column>({}, column, subtotalBy);
    });

    // create a simple shallow tree based on the initial data
    const tree = TreeBuilder.buildShallowTree(initialData);
    SortFactory.sortTree(tree, sortBys, columnsWithSort[0]);

    const rasterizedRows: Row[] = TreeRasterizer.rasterize(tree);

    const gridID: number = parseInt(_.uniqueId());

    return {
        rasterizedRows: rasterizedRows,
        displayStart: 0,
        columns: columnsWithSort,
        displayEnd: Math.min(rasterizedRows.length - 1, PROGRESSIVE_RENDERING_THRESHOLD),
        subtotalBys: subtotalBys,
        sortBys: sortBys,
        filterBys: _.cloneDeep(initialFilterBys) || [],
        tree: tree,
        showSettingsPopover: false,
        viewport: undefined,
        canvas: undefined,
        expandTable,
        additionalUserButtons,
        gridID
    }
}

export class ServerStore extends ReduceStore<GigaState> {

    private props: GigaProps;

    constructor(dispatcher: Dispatcher<GigaAction>, props: GigaProps) {
        super(dispatcher);
        this.props = props;
        dispatcher.dispatch({
            type: GigaActionType.INITIALIZE
        });
    }

    getInitialState(): GigaState {
        return null;
    }

    initialize(action: InitializeAction): GigaState {
        // if props not passed we will use this.props
        const overrideAction: InitializeAction = _.assign<{},{},{},InitializeAction>({}, action, {props: action.props || this.props});
        return initialStateReducer(overrideAction); // TODO create initialize reducer
    }

    reduce(state: GigaState,
           action: GigaAction): GigaState {
        let boundaries;
        switch (action.type) {
            /**
             * server only action handlers
             */
            case GigaActionType.LOADING_MORE_DATA:
                let row = (action as LoadingMoreDataAction).parentRow;
                row.loading = true;
                newState = _.clone(state);
                boundaries = ScrollCalculator.computeDisplayBoundaries(this.props.rowHeight, $(state.viewport), $(state.canvas));
                newState.displayStart = boundaries.displayStart;
                newState.displayEnd = boundaries.displayEnd;
                break;
            case GigaActionType.GOT_MORE_DATA:
                const myAction = action as GotMoreDataAction;
                const {parentRow, rows, isDetail} = myAction;
                parentRow.collapsed = false;
                parentRow.loading = false;
                // empty and existing children / detail children
                if (isDetail) {
                    // add data as detail rows
                    parentRow.detailRows = [];
                    dataToDetailRows(rows).forEach(row=>parentRow.detailRows.push(row));
                } else {
                    // add data as subtotal rows
                    parentRow.children = [];
                    dataToSubtotalRows(rows).forEach(row=>parentRow.addChild(row));
                }
                newState = _.clone(state); // force update
                boundaries = ScrollCalculator.computeDisplayBoundaries(this.props.rowHeight, $(state.viewport), $(state.canvas));
                newState.displayStart = boundaries.displayStart;
                newState.displayEnd = boundaries.displayEnd;
                break;
            case GigaActionType.COLLAPSE_ROW:
                break;
            /**
             * plain old action handlers
             */
            case GigaActionType.INITIALIZE:
                newState = this.initialize(action as InitializeAction);
                break;
            case GigaActionType.CHANGE_ROW_DISPLAY_BOUNDS:
                newState = changeDisplayBoundsReducer(state, action as ChangeRowDisplayBoundsAction);
                break;
            case GigaActionType.NEW_SORT:
                newState = sortUpdateReducer(state, action as SortUpdateAction);
                break;
            case GigaActionType.CLEAR_SORT:
                newState = cleartSortReducer(state);
                break;
            case GigaActionType.TOGGLE_ROW_SELECT:
                newState = rowSelectReducer(state, action as ToggleRowSelectAction, this.props);
                break;
            case GigaActionType.TOGGLE_CELL_SELECT:
                newState = cellSelectReducer(state, action as ToggleCellSelectAction, this.props);
                break;
            case GigaActionType.TOGGLE_SETTINGS_POPOVER:
                newState = _.assign<{},GigaState>({}, state, {showSettingsPopover: !state.showSettingsPopover});
                break;
            case GigaActionType.TOGGLE_ROW_COLLAPSE:
                newState = toggleCollapseReducer(state, action as ToggleCollapseAction, this.props);
                break;
            /**
             * not supported actions for server rendering mode
             */
            case GigaActionType.COLUMNS_UPDATE:
                newState = state; // not handled
                break;
            case GigaActionType.COLLAPSE_ALL:
                newState = state; // not handled
                break;
            case GigaActionType.EXPAND_ALL:
                newState = state; // not handled
                break;
            default:
                newState = state;
        }

        var newState: GigaState;

        /*
         determine if an action should trigger rasterization
         todo I wonder if we need to re-compute display bounds after rasterization if so, viewport and canvas must become states so we can access them here
         */
        if (GigaStore.shouldTriggerRasterization(action))
            newState.rasterizedRows = TreeRasterizer.rasterize(newState.tree);

        return newState;
    }

}

export interface ServerSubtotalRow {
    data: any
    bucketInfo: BucketInfo
    sectorPath: BucketInfo[]
}

/**
 * convert server provided rows into DetailRow objects (the server can't give us true ES6 JavaScript instances, so we have
 * to manually instantiate them!)
 * @param rows
 * @returns {Row[]}
 */
function dataToDetailRows(rows: any[]): Row[] {
    return rows.map(row=> {
        const detailRow = new Row();
        detailRow.data = row.data;
        detailRow.sectorPath = row.sectorPath;
        return detailRow;
    });
}

/**
 * convert server provided rows into DetailRow objects (the server can't give us true ES6 JavaScript instances, so we have
 * to manually instantiate them!)
 * @param rows
 * @returns {Row[]}
 */
export function dataToSubtotalRows(rows: ServerSubtotalRow[]): Row[] {
    return rows.map(row=> {
        const subtotalRow = new Row();
        subtotalRow.bucketInfo = row.bucketInfo;
        subtotalRow.sectorPath = row.sectorPath;
        subtotalRow.data = row.data;
        subtotalRow.collapsed = true;
        subtotalRow.isSubtotal = true;
        return subtotalRow;
    });
}

interface GotMoreDataAction extends GigaAction {
    rows: any[]
    isDetail: boolean
    parentRow: Row
}

interface LoadingMoreDataAction extends GigaAction {
    parentRow: Row
}