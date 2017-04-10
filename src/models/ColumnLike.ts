import {Row} from './Row';
import {CellProps} from '../components/Cell/Cell';

export enum AggregationMethod {
    SUM, WEIGHTED_AVERAGE, AVERAGE, RANGE, COUNT, COUNT_DISTINCT, COUNT_OR_DISTINCT, NONE
}

export enum ColumnFormat {
    NUMBER, STRING, CURRENCY, DATE
}

export interface ColumnLike {
    colTag: string;
    title?: string;
    format?: ColumnFormat;
    aggregationMethod?: AggregationMethod;
}

export enum SortDirection {
    ASC, DESC
}

export interface FormatInstruction {
    textAlign?: 'left'|'right';
    showAsPercent?: boolean;
    roundTo?: number;
    multiplier?: number;
    separator?: boolean;
    locale?: string;
    currency?: string;
}

export interface ColumnDef extends ColumnLike {
    // how wide the column is to be
    width?: number;
    minWidth?: number;
    weightBy?: string;
    formatInstruction?: FormatInstruction;
    cellTemplateCreator?: (props: CellProps) => JSX.Element;
    headerTemplateCreator?: (column: Column) => JSX.Element;
}

export interface Column extends ColumnDef {
    direction?: SortDirection;
    customSortFn?: (a: Row, b: Row)=>number;
    colSpan?: number;
}

export interface FilterBy extends ColumnLike {
    predicate: (a: any)=>boolean;
}

/**
 * this interface defines metadata for any specific SubtotalRow, such as
 * - from which column did this subtotal row come from?
 * - what is the value of this subtotal row if we tried to sort it?
 * - how shall we display its value? (could be different than the value it is sorted on)
 */
export interface BucketInfo {
    colTag: string;
    title: string;
    value: any;
}

export interface ColumnGroupDef {
    title: string;
    columns: string[]; // colTags
}