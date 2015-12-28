import {Tree} from "./TreeBuilder";

export enum SortDirection {
    ASC, DESC
}

export interface SortBy {
    colTag:string;
    direction: SortDirection
}

export class SortFactory {
    public static sortTree(tree:Tree, sortBys:SortBy[]):Tree {
        // TODO implement
        return null;
    }
}
