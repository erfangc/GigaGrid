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

export interface ColumnDef {
    colTag:string
    title:string
    format:ColumnFormat
    aggregationMethod:AggregationMethod
}

export interface TableRowColumnDef extends ColumnDef {
    width?:string
    sortDirection?: SortDirection
    customSortFn?:(a:Row, b:Row)=>number
    cellTemplateCreator?:(data:any, tableRowColumnDef?:TableRowColumnDef)=>JSX.Element
}

export interface SubtotalBy extends ColumnLike {
}

export enum SortDirection {
    ASC, DESC
}

export interface SortBy {
    colTag:string;
    format: ColumnFormat;
    customSortFn?:(a:Row, b:Row)=>number; // UDF for sorting
    direction: SortDirection
}
