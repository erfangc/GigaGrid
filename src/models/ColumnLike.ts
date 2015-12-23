/// <reference path="../../typings/tsd.d.ts" />

enum AggregationMethod {
    SUM, AVERAGE, NONE
}
enum ColumnFormat {
    NUMBER, STRING, CURRENCY, DATE
}

interface ColumnLike {
    colTag: string;
}


class ColumnDef implements ColumnLike {

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

class TableRowColumnDef extends ColumnDef {
    constructor(columnDef:ColumnDef, public width:string = "auto") {
        super(columnDef.colTag, columnDef.format, columnDef.aggregationMethod);
    }
}

class SubtotalBy implements ColumnLike {
    constructor(colTag:string) {
        this.colTag = colTag;
    }

    public colTag:string;
}