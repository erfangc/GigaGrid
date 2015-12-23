class TestUtils {

    public static getSimpleRawDataWithMissing():any[] {
        return [
            {"col1": "A", "col2": "C"},
            {"col1": "B"},
            {"col1": "A", "col2": "C"},
            {"col1": "A", "col2": "D"},
            {"col1": "B"}
        ];
    }

    public static getSimpleRawData():any[] {
        return [
            {"col1": "A", "col2": "C"},
            {"col1": "B", "col2": "C"},
            {"col1": "A", "col2": "C"},
            {"col1": "A", "col2": "D"},
            {"col1": "B", "col2": "D"}
        ];
    }

    public static getRowWithMissingData():Row {
        return new DetailRow({
            "numCol1": 7,
            "textCol1": "R2D2",
            "textCol2": "City Wok"
        });
    }

    public static getDetailRow():DetailRow {
        return new DetailRow({
            "numCol1": 7,
            "numCol2": 42,
            "textCol1": "R2D2",
            "textCol2": "City Wok"
        });
    }

    /**
     * return a small set of sample data
     * @returns {{data: {gender: string, first_name: string, last_name: string, gift: number}[], columnDefs: ColumnDef[]}}
     */
    public static getSampleData():{data: any[], columnDefs: ColumnDef[]} {
        const data = [{"gender": "Female", "first_name": "Maria", "last_name": "Young", "gift": 2},
            {"gender": "Female", "first_name": "Kimberly", "last_name": "Kennedy", "gift": 2},
            {"gender": "Female", "first_name": "Lisa", "last_name": "Hall", "gift": 10},
            {"gender": "Female", "first_name": "Andrea", "last_name": "Peterson", "gift": 4},
            {"gender": "Male", "first_name": "Clarence", "last_name": "Cox", "gift": 9},
            {"gender": "Male", "first_name": "Charles", "last_name": "Riley", "gift": 7},
            {"gender": "Male", "first_name": "Bruce", "last_name": "Turner", "gift": 2},
            {"gender": "Female", "first_name": "Shirley", "last_name": "Riley", "gift": 9},
            {"gender": "Male", "first_name": "David", "last_name": "Hunt", "gift": 7},
            {"gender": "Male", "first_name": "Thomas", "last_name": "Bradley", "gift": 6}];
        const columnDefs:ColumnDef[] = [
            {
                colTag: "first_name",
                title: "First Name",
                format: ColumnFormat.STRING,
                aggregationMethod: AggregationMethod.NONE
            },
            {
                colTag: "gender",
                title: "Gender",
                format: ColumnFormat.STRING,
                aggregationMethod: AggregationMethod.NONE
            },
            {
                colTag: "last_name",
                title: "Last Name",
                format: ColumnFormat.STRING,
                aggregationMethod: AggregationMethod.NONE
            },
            {
                colTag: "gift", title: "Gift", format: ColumnFormat.NUMBER, aggregationMethod: AggregationMethod.SUM
            }
        ];
        return {
            data: data,
            columnDefs: columnDefs
        };
    }

    public static regex:{ dataReact: RegExp } = {
        dataReact: / data-react[-\w]+="[^"]+"/g
    };

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