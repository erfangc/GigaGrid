class TestUtils {

    public static getDetailRow():DetailRow {
        return new DetailRow({
            "numCol1": 7,
            "numCol2": 42,
            "textCol1": "R2D2",
            "textCol2": "City Wok"
        });
    }

    public static getSampleSubtotalRow():SubtotalRow {
        const subtotalRow:SubtotalRow = new SubtotalRow("Sector X");
        subtotalRow.setData({
            "numCol1": 2187,
            "numCol2": 117,
            "textCol1": "BB8",
            "textCol2": "This is Sparta!"
        });
        return subtotalRow;
    }

    public static getSampleColumnDefs():ColumnDef[] {
        const columnDef1:ColumnDef = new ColumnDef("numCol1", ColumnFormat.NUMBER, AggregationMethod.SUM);
        const columnDef2:ColumnDef = new ColumnDef("numCol2", ColumnFormat.NUMBER, AggregationMethod.AVERAGE);
        const columnDef3:ColumnDef = new ColumnDef("textCol1", ColumnFormat.STRING, AggregationMethod.NONE);
        const columnDef4:ColumnDef = new ColumnDef("textCol2", ColumnFormat.STRING, AggregationMethod.NONE);

        return [
            columnDef1,
            columnDef2,
            columnDef3,
            columnDef4
        ];
    }

    public static getSampleTableRowColumnDefs():TableRowColumnDef[] {

        const columnDefs = TestUtils.getSampleColumnDefs();

        const tableRowColumnDef1:TableRowColumnDef = new TableRowColumnDef(columnDefs[0]);
        const tableRowColumnDef2:TableRowColumnDef = new TableRowColumnDef(columnDefs[1]);
        const tableRowColumnDef3:TableRowColumnDef = new TableRowColumnDef(columnDefs[2]);
        const tableRowColumnDef4:TableRowColumnDef = new TableRowColumnDef(columnDefs[3]);

        return [
            tableRowColumnDef1,
            tableRowColumnDef2,
            tableRowColumnDef3,
            tableRowColumnDef4
        ];
    }
}