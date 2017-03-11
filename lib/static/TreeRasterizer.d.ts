import { Tree } from "./TreeBuilder";
import { Row } from "../models/Row";
export declare class TreeRasterizer {
    static rasterize(tree: Tree): Row[];
    private static rasterizeChildren(row, rasterizedRows);
}
