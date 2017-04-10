/// <reference types="flux" />
import { ReduceStore } from "flux/utils";
import { Dispatcher } from "flux";
import { GigaAction } from "./GigaStore";
import { InitializeAction } from "./handlers/InitializeReducer";
import { BucketInfo } from "../models/ColumnLike";
import { Row } from "../models/Row";
import { GigaProps } from "../components/GigaProps";
import { GigaState } from "../components/GigaState";
export declare class ServerStore extends ReduceStore<GigaState, GigaAction> {
    static id: number;
    private props;
    constructor(dispatcher: Dispatcher<GigaAction>, props: GigaProps);
    getInitialState(): GigaState;
    initialize(action: InitializeAction): GigaState;
    reduce(state: GigaState, action: GigaAction): GigaState;
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
export declare function dataToSubtotalRows(rows: ServerSubtotalRow[]): Row[];
