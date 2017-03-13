import {ReduceStore} from 'flux/utils';
import {Dispatcher} from 'flux';
import {ScrollCalculator} from '../static/ScrollCalculator';
import {GigaStore, GigaActionType, GigaAction, PROGRESSIVE_RENDERING_THRESHOLD} from './GigaStore';
import {InitializeAction, decorateInitialSortBys, decorateColumnsWithSort} from './handlers/InitializeReducer';
import {TreeRasterizer} from '../static/TreeRasterizer';
import {
    ToggleCellSelectAction,
    cellSelectHandler,
    ToggleRowSelectAction,
    rowSelectHandler
} from './handlers/SelectReducers';
import {cleartSortHandler, SortUpdateAction, sortUpdateHandler} from './handlers/SortReducers';
import {ChangeRowDisplayBoundsAction, changeDisplayBoundsHandler} from './handlers/ChangeRowDisplayBoundsReducer';
import {Column, BucketInfo} from '../models/ColumnLike';
import {TreeBuilder} from '../static/TreeBuilder';
import {Row} from '../models/Row';
import {ToggleCollapseAction, toggleCollapseHandler} from './handlers/RowCollapseReducers';
import {SortFactory} from '../static/SortFactory';
import {GigaProps} from '../components/GigaProps';
import {CellContentChangeAction, cellContentChangeHandler} from './handlers/CellContentChange';
import {GigaState} from '../components/GigaState';

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
        additionalUserButtons
    } = action.props;
    /**
     * turn ColumnDefs into "Columns" which are decorated with behaviors
     */
    const columns = columnDefs.map(columnDef => {
        return Object.assign({}, columnDef, {});
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
        if (typeof subtotalBy === 'string') {
            return columns.find(column => column.colTag === subtotalBy);
        }
        else if (typeof subtotalBy === 'object') {
            return Object.assign({}, columns.find(column => column.colTag === subtotalBy.colTag), subtotalBy as Column);
        } else {
            throw `Invalid subtotalBy: ${subtotalBy}`;
        }
    });

    // create a simple shallow tree based on the initial data
    const tree = TreeBuilder.buildShallowTree(initialData);
    SortFactory.sortTree(tree, sortBys, columnsWithSort[0]);

    const rasterizedRows: Row[] = TreeRasterizer.rasterize(tree);

    const gridID: number = ServerStore.id++;

    return {
        rasterizedRows: rasterizedRows,
        displayStart: 0,
        columns: columnsWithSort,
        displayEnd: PROGRESSIVE_RENDERING_THRESHOLD,
        subtotalBys: subtotalBys,
        sortBys: sortBys,
        filterBys: Object.assign({}, initialFilterBys) || [],
        tree: tree,
        showSettingsPopover: false,
        viewport: undefined,
        canvas: undefined,
        leftBody: undefined,
        rightBody: undefined,
        leftHeader: undefined,
        rightHeader: undefined,
        additionalUserButtons,
        gridID
    };
}

export class ServerStore extends ReduceStore<GigaState, GigaAction> {

    static id: number = 0;

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
        const overrideAction: InitializeAction = Object.assign({}, action, { props: action.props || this.props });
        return initialStateReducer(overrideAction); // TODO create initialize reducer
    }

    reduce(state: GigaState,
           action: GigaAction): GigaState {
        let newState: GigaState;
        let row: Row;
        let boundaries;
        switch (action.type) {
            /**
             * server only action handlers
             */
            case GigaActionType.LOADING_MORE_DATA:
                row = (action as LoadingMoreDataAction).parentRow;
                row.loading = true;
                newState = Object.assign({}, state);
                boundaries = ScrollCalculator.computeDisplayBoundaries(this.props.rowHeight, this.props.bodyHeight, state.viewport);
                newState.displayStart = boundaries.displayStart;
                newState.displayEnd = boundaries.displayEnd;
                break;
            case GigaActionType.STOP_LOADING_MORE_DATA:
                row = (action as LoadingMoreDataAction).parentRow;
                row.loading = false;
                newState = Object.assign({}, state);
                boundaries = ScrollCalculator.computeDisplayBoundaries(this.props.rowHeight, this.props.bodyHeight, state.viewport);
                newState.displayStart = boundaries.displayStart;
                newState.displayEnd = boundaries.displayEnd;
                break;
            case GigaActionType.SET_LOADING_DATA_ERROR_STATUS:
                newState = Object.assign({}, state);
                row = (action as SetLoadingDataErrorStatusAction).row;
                row.errorStatus = (action as SetLoadingDataErrorStatusAction).status;
                break;
            case GigaActionType.GOT_MORE_DATA:
                const myAction = action as GotMoreDataAction;
                const { parentRow, rows, isDetail } = myAction;
                parentRow.collapsed = false;
                parentRow.loading = false;
                // empty and existing children / detail children
                if (isDetail) {
                    // add data as detail rows
                    parentRow.detailRows = [];
                    dataToDetailRows(rows).forEach(row => parentRow.detailRows.push(row));
                } else {
                    // add data as subtotal rows
                    parentRow.children = [];
                    dataToSubtotalRows(rows).forEach(row => parentRow.addChild(row));
                }
                newState = Object.assign({}, state);
                boundaries = ScrollCalculator.computeDisplayBoundaries(this.props.rowHeight, this.props.bodyHeight, state.viewport);
                newState.displayStart = boundaries.displayStart;
                newState.displayEnd = boundaries.displayEnd;
                break;
            case GigaActionType.CELL_CONTENT_CHANGE:
                newState = cellContentChangeHandler(state, action as CellContentChangeAction);
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
                newState = changeDisplayBoundsHandler(state, action as ChangeRowDisplayBoundsAction);
                break;
            case GigaActionType.NEW_SORT:
                newState = sortUpdateHandler(state, action as SortUpdateAction);
                break;
            case GigaActionType.CLEAR_SORT:
                newState = cleartSortHandler(state);
                break;
            case GigaActionType.TOGGLE_ROW_SELECT:
                newState = rowSelectHandler(state, action as ToggleRowSelectAction, this.props);
                break;
            case GigaActionType.TOGGLE_CELL_SELECT:
                newState = cellSelectHandler(state, action as ToggleCellSelectAction, this.props, this.getDispatcher());
                break;
            case GigaActionType.TOGGLE_SETTINGS_POPOVER:
                newState = Object.assign({}, state, { showSettingsPopover: !state.showSettingsPopover });
                break;
            case GigaActionType.TOGGLE_ROW_COLLAPSE:
                newState = toggleCollapseHandler(state, action as ToggleCollapseAction, this.props);
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

        /*
         determine if an action should trigger rasterization
         todo I wonder if we need to re-compute display bounds after rasterization if so, viewport and canvas must become states so we can access them here
         */
        if (GigaStore.shouldTriggerRasterization(action)) {
            newState.rasterizedRows = TreeRasterizer.rasterize(newState.tree);
        }
        return newState;
    }

}

export interface ServerSubtotalRow {
    data: any;
    bucketInfo: BucketInfo;
    sectorPath: BucketInfo[];
}

/**
 * convert server provided rows into DetailRow objects (the server can't give us true ES6 JavaScript instances, so we have
 * to manually instantiate them!)
 * @param rows
 * @returns {Row[]}
 */
function dataToDetailRows(rows: any[]): Row[] {
    return rows.map(row => {
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
    return rows.map(row => {
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
    rows: any[];
    isDetail: boolean;
    parentRow: Row;
}

interface LoadingMoreDataAction extends GigaAction {
    parentRow: Row;
}

interface SetLoadingDataErrorStatusAction extends GigaAction {
    row: Row;
    status: number;
}