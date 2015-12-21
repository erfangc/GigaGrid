/// <reference path="../../typings/tsd.d.ts" />

enum AggregationMethod {
    SUM, AVERAGE
}
enum ColumnFormat {
    NUMBER, STRING, CURRENCY, DATE
}

interface ColumnLike {
    colTag: string;
}

class ColumnDef implements ColumnLike {

    public colTag:string;
    public format:ColumnFormat;
    public aggregationMethod:AggregationMethod;

    constructor(colTag:string, format:ColumnFormat, aggregationMethod:AggregationMethod) {
        this.colTag = colTag;
        this.format = format;
        this.aggregationMethod = aggregationMethod;
    }

}

class SubtotalBy implements ColumnLike {
    constructor(colTag:string) {
        this.colTag = colTag;
    }

    public colTag:string;
}