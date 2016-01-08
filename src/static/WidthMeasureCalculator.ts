import {ColumnDef} from "../models/ColumnLike";
import * as _ from 'lodash';
var round = Math.round;

export interface WidthMeasures {
    bodyWidth:string
    columnWidths: any
}

export function parsePixelValue(pxMeasure:string):number {
    return parseInt(pxMeasure.substr(0, pxMeasure.length - 2));
}

export function allColumnWidthProvided(columnDefs:ColumnDef[]):boolean {
    for (let i = 0; i < columnDefs.length; i++) {
        if (!(columnDefs[i].width && _.endsWith(columnDefs[i].width, "px")))
            return false;
    }
    return true;
}

// #7 Determine column width automatically if not passed in by the user https://github.com/erfangc/GigaGrid/issues/7
export class WidthMeasureCalculator {

    static computeWidthMeasures(bodyWidth:string, columnDefs:ColumnDef[]):WidthMeasures {
        var columnWidthProvided = allColumnWidthProvided(columnDefs);

        const measures:WidthMeasures = {
            bodyWidth: null,
            columnWidths: {}
        };
        if (columnWidthProvided) {
            const bodyWidth = _.chain(columnDefs).map((cd)=>parsePixelValue(cd.width)).sum();
            measures.bodyWidth = bodyWidth + "px";
            _.forEach(columnDefs, (cd:ColumnDef)=> {
                measures.columnWidths[cd.colTag] = cd.width;
            });
        } else if (bodyWidth) {
            measures.bodyWidth = bodyWidth;
            const bodyWidthPx = parsePixelValue(bodyWidth);
            const cellWidth = round(bodyWidthPx / columnDefs.length);
            var totalCellWidth = 0;
            for (let i = 0; i < columnDefs.length - 1; i++) {
                measures.columnWidths[columnDefs[i].colTag] = cellWidth + "px";
                totalCellWidth += cellWidth;
            }
            const lastColTag = columnDefs[columnDefs.length - 1].colTag;
            measures.columnWidths[lastColTag] = (bodyWidthPx - totalCellWidth) + "px";
        } else {
            measures.bodyWidth = "100%";
            _.forEach(columnDefs, (cd)=> {
                measures.columnWidths[cd.colTag] = "auto";
            });
        }
        return measures;
    }

}
