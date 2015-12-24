/// <reference path="../../typings/tsd.d.ts" />

export enum AggregationMethod {
    SUM, AVERAGE, NONE
}
export enum ColumnFormat {
    NUMBER, STRING, CURRENCY, DATE
}

export interface ColumnLike {
    colTag: string;
}


export class ColumnDef implements ColumnLike {

    public colTag:string;
    public title:string;
    public format:ColumnFormat;
    public aggregationMethod:AggregationMethod;

    constructor(colTag:string, format:ColumnFormat, aggregationMethod:AggregationMethod) {
        this.colTag = colTag;
        this.format = format;
        this.aggregationMethod = aggregationMethod;
    }

}

export class TableRowColumnDef extends ColumnDef {
    constructor(columnDef:ColumnDef, public width:string = "auto") {
        super(columnDef.colTag, columnDef.format, columnDef.aggregationMethod);
    }
}

export class SubtotalBy implements ColumnLike {
    constructor(colTag:string) {
        this.colTag = colTag;
    }

    public colTag:string;
}