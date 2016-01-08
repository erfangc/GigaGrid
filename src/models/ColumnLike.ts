import {Row} from "./Row";

export enum AggregationMethod {
    SUM, AVERAGE, NONE
}

export enum ColumnFormat {
    NUMBER, STRING, CURRENCY, DATE
}

export interface ColumnLike {
    colTag: string
}

export enum SortDirection {
    ASC, DESC
}

export interface ColumnDef {
    colTag:string
    title:string
    format:ColumnFormat
    width?:string
    aggregationMethod:AggregationMethod
}

export interface TableRowColumnDef extends ColumnDef {
    sortDirection?: SortDirection
    customSortFn?:(a:Row, b:Row)=>number
    cellTemplateCreator?:(data:any, tableRowColumnDef?:TableRowColumnDef)=>JSX.Element
}

export interface FilterBy extends ColumnLike {
    predicate: (a:any)=>boolean
}

export interface SubtotalBy extends ColumnLike {
}

export interface SortBy {
    colTag:string;
    format: ColumnFormat;
    customSortFn?:(a:Row, b:Row)=>number; // UDF for sorting
    direction: SortDirection
}
