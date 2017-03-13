/// <reference types="react" />
import { Row } from "./Row";
import { CellProps } from "../components/Cell/Cell";
export declare enum AggregationMethod {
    SUM = 0,
    WEIGHTED_AVERAGE = 1,
    AVERAGE = 2,
    RANGE = 3,
    COUNT = 4,
    COUNT_DISTINCT = 5,
    COUNT_OR_DISTINCT = 6,
    NONE = 7,
}
export declare enum ColumnFormat {
    NUMBER = 0,
    STRING = 1,
    CURRENCY = 2,
    DATE = 3,
}
export interface ColumnLike {
    colTag: string;
    title?: string;
    format?: ColumnFormat;
    aggregationMethod?: AggregationMethod;
}
export declare enum SortDirection {
    ASC = 0,
    DESC = 1,
}
export interface FormatInstruction {
    textAlign?: "left" | "right";
    showAsPercent?: boolean;
    roundTo?: number;
    multiplier?: number;
    separator?: boolean;
    locale?: string;
    currency?: string;
}
export interface ColumnDef extends ColumnLike {
    width?: number;
    weightBy?: string;
    formatInstruction?: FormatInstruction;
    cellTemplateCreator?: (props: CellProps) => JSX.Element;
    headerTemplateCreator?: (column: Column) => JSX.Element;
}
export interface Column extends ColumnDef {
    direction?: SortDirection;
    customSortFn?: (a: Row, b: Row) => number;
    colSpan?: number;
}
export interface FilterBy extends ColumnLike {
    predicate: (a: any) => boolean;
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
    columns: string[];
}
