import { GigaAction } from "../GigaStore";
import { Column } from "../../models/ColumnLike";
import { GigaProps } from "../../components/GigaProps";
import { GigaState } from "../../components/GigaState";
/**
 * decorate any sortBy(s) with properties that might exist on the column - properties defined in sortBys override those
 * defined in the column definition
 * @param initialSortBys
 * @param columnsWithSort
 * @returns {Column[]}
 */
export declare function decorateInitialSortBys(initialSortBys: any, columnsWithSort: Column[]): Column[];
/**
 * for every column, add the direction property if it is part of a initialSortBy
 * @param columns
 * @param initialSortBys
 * @returns {any}
 */
export declare function decorateColumnsWithSort(columns: any, initialSortBys: any): Column[];
export default function (action: InitializeAction): GigaState;
export interface InitializeAction extends GigaAction {
    props?: GigaProps;
}
