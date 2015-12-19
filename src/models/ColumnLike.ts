export enum ColumnFormat {
    NUMBER, STRING, CURRENCY, DATE
}

export interface ColumnLike {
    colTag: string;
}

export class ColumnDef implements ColumnLike {

    public colTag: string;
    public format: ColumnFormat;

    constructor(colTag:string, format:ColumnFormat) {
        this.colTag = colTag;
        this.format = format;
    }

}

export class SubtotalBy implements ColumnLike {
    constructor(colTag:string) {
        this.colTag = colTag;
    }
    public colTag: string;
}