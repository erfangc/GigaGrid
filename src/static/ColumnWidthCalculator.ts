/**
 * ColumnWidthCalculator
 */
import { Column, ColumnDef } from "../index";
import { GigaProps } from "../components/GigaProps";

export class ColumnWidthCalculator {

    static calculateRightPanelMaxWidth(columns: Column[], newGridWidth: string, props: Partial<GigaProps>): string {
        let { staticLeftHeaders } = props;
        let leftHeaders = columns.slice(0, staticLeftHeaders || 0);
        let leftHeadersTotalWidth = leftHeaders.length === 0 ? 0 : columns.slice(0, staticLeftHeaders).map(column => column.width || 0).reduce((a, b) => a + b);
        return `${parseFloat(newGridWidth) - leftHeadersTotalWidth}px`;
    }

    static enrichColumnsWithWidth(columns: Column[], columnDefs: ColumnDef[], newGridWidth: string) {
        let newWidth = parseFloat(newGridWidth);
        /**
         * grab all columns that already have a width specified via props (i.e. columnDefs)
         */
        let unspecifiedColumns: Column[] = [];
        let totalSpecifiedWidth: number = 0;
        let columnDefsMap: { [key: string]: ColumnDef } = {};
        columnDefs.forEach(columnDef => columnDefsMap[columnDef.colTag] = columnDef);

        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            let columnDef = columnDefsMap[column.colTag];
            if (columnDef.width) {
                totalSpecifiedWidth += columnDef.width;
                column.width = columnDef.width;
            } else {
                unspecifiedColumns.push(column);
            }
        }
        let remainingWidth = newWidth - totalSpecifiedWidth;
        for (let j = 0; j < unspecifiedColumns.length; j++) {
            unspecifiedColumns[j].width = remainingWidth / unspecifiedColumns.length;
        }
    }

}