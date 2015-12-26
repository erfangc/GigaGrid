export enum AggregationMethod {
    SUM, AVERAGE, NONE
}
export enum ColumnFormat {
    NUMBER, STRING, CURRENCY, DATE
}

export interface ColumnLike {
    colTag: string;
}

export interface ColumnDef {
    colTag:string;
    title:string;
    format:ColumnFormat;
    aggregationMethod:AggregationMethod;
}

export interface TableRowColumnDef extends ColumnDef {
    width?:string;
}

export interface SubtotalBy extends ColumnLike{
}
