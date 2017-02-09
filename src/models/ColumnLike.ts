import {Row} from "./Row";
import {GigaState} from "../components/GigaGrid";
import * as _ from "lodash";
import {CellProps} from "../components/Cell/Cell";

export enum AggregationMethod {
    SUM, WEIGHTED_AVERAGE, AVERAGE, RANGE, COUNT, COUNT_DISTINCT, COUNT_OR_DISTINCT, NONE
}

export enum ColumnFormat {
    NUMBER, STRING, CURRENCY, DATE
}

export interface ColumnLike {
    colTag: string
    title?: string
    format?: ColumnFormat
    aggregationMethod?: AggregationMethod
}

export enum SortDirection {
    ASC, DESC
}

export interface FormatInstruction {
    textAlign?: "left"|"right"
    showAsPercent?: boolean
    roundTo?: number
    multiplier?: number
    separator?: boolean
    locale?: string
    currency?: string
}

export interface ColumnDef extends ColumnLike {
    width?: string
    weightBy?: string
    formatInstruction?: FormatInstruction
    cellTemplateCreator?: (props: CellProps) => JSX.Element
    headerTemplateCreator?: (column: Column) => JSX.Element
}

export interface Column extends ColumnDef {
    direction?: SortDirection
    customSortFn?: (a: Row, b: Row)=>number
    colSpan?: number
}

export interface FilterBy extends ColumnLike {
    predicate: (a: any)=>boolean
}

/**
 * this interface defines metadata for any specific SubtotalRow, such as
 * - from which column did this subtotal row come from?
 * - what is the value of this subtotal row if we tried to sort it?
 * - how shall we display its value? (could be different than the value it is sorted on)
 */
export interface BucketInfo {
    colTag: string
    title: string
    value: any
}

export interface ColumnGroupDef {
    title: string
    columns: string[] // colTags
}

export class ColumnFactory {

    /**
     * Create a 2-dimensional structure of Column(s), this allow us to group column headers
     * @param columnGroupDefs
     * @param state
     * @returns {Column[][]}
     */
    static createColumnsFromGroupDefinition(columnGroupDefs: ColumnGroupDef[], state: GigaState): Column[][] {

        const columns = state.columns;
        const columnMap = _.chain(columns).map((column: Column)=>column.colTag).object(columns).value();
        const nestedColumns: Column[][] = [[], []];
        _.forEach(columnGroupDefs, (groupDef: ColumnGroupDef, i: number)=> {
            nestedColumns[0].push({
                colTag: `column_group_${i + 1}`,
                title: groupDef.title,
                colSpan: groupDef.columns.length
            });
            _.forEach(groupDef.columns, colTag=>nestedColumns[1].push(columnMap[colTag]));
        });
        return nestedColumns;

    }
}