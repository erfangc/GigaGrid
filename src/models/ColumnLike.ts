export enum AggregationMethod {
    SUM, AVERAGE
}
export enum ColumnFormat {
    NUMBER, STRING, CURRENCY, DATE
}

export interface ColumnLike {
    colTag: string;
}

export class ColumnDef implements ColumnLike {

    public colTag:string;
    public format:ColumnFormat;
    public aggregationMethod:AggregationMethod;

    constructor(colTag:string, format:ColumnFormat, aggregationMethod:AggregationMethod) {
        this.colTag = colTag;
        this.format = format;
        this.aggregationMethod = aggregationMethod;
    }

}

export class SubtotalBy implements ColumnLike {
    constructor(colTag:string) {
        this.colTag = colTag;
    }

    public colTag:string;
}