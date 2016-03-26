import {DetailRow, SubtotalRow, Row} from "../src/models/Row";
import {ColumnDef, ColumnFormat, AggregationMethod, Column, ColumnGroupDef} from "../src/models/ColumnLike";
import {TreeBuilder, Tree} from "../src/static/TreeBuilder";
import {GigaState} from "../src/components/GigaGrid";

interface TestDataFactory {
    rawData():any[]
    columnDefs():ColumnDef[]
    tree():Tree
    columns():Column[]
    detailRows():Row[]
}

class ComprehensiveTypeData implements TestDataFactory {

    constructor() {

    }

    rawData():any[] {
        return [
            {
                "id": 1,
                "last_name": "George",
                "gender": "Female",
                "invariant": "Invariant",
                "sum_field": 10,
                "average_field": 10,
                "count_or_distinct_field": "F",
                "range_field": 2,
                "weight_factor": 0.66
            },
            {
                "id": 2,
                "last_name": "Wood",
                "gender": "Female",
                "invariant": "Invariant",
                "sum_field": 3,
                "average_field": 7,
                "count_or_distinct_field": "F",
                "range_field": 8,
                "weight_factor": 0.68
            },
            {
                "id": 3,
                "last_name": "Gonzales",
                "gender": "Male",
                "invariant": "Invariant",
                "sum_field": 5,
                "average_field": 4,
                "count_or_distinct_field": "M",
                "range_field": 4,
                "weight_factor": 0.41
            },
            {
                "id": 4,
                "last_name": "Boyd",
                "gender": "Male",
                "invariant": "Invariant",
                "sum_field": 6,
                "average_field": 7,
                "count_or_distinct_field": "M",
                "range_field": 6,
                "weight_factor": 0.29
            },
            {
                "id": 5,
                "last_name": "Long",
                "gender": "Male",
                "invariant": "Invariant",
                "sum_field": 10,
                "average_field": 5,
                "count_or_distinct_field": "M",
                "range_field": 1,
                "weight_factor": 0.75
            },
            {
                "id": 6,
                "last_name": "Long",
                "gender": "Male",
                "invariant": "Invariant",
                "sum_field": 9,
                "average_field": 6,
                "count_or_distinct_field": "F",
                "range_field": 10,
                "weight_factor": 0.65
            },
            {
                "id": 7,
                "last_name": "Patterson",
                "gender": "Male",
                "invariant": "Invariant",
                "sum_field": 8,
                "average_field": 2,
                "count_or_distinct_field": "F",
                "range_field": 2,
                "weight_factor": 0.93
            },
            {
                "id": 8,
                "last_name": "Ford",
                "gender": "Female",
                "invariant": "Invariant",
                "sum_field": 10,
                "average_field": 2,
                "count_or_distinct_field": "M",
                "range_field": 1,
                "weight_factor": 0.77
            },
            {
                "id": 9,
                "last_name": "Jenkins",
                "gender": "Male",
                "invariant": "Invariant",
                "sum_field": 2,
                "average_field": 9,
                "count_or_distinct_field": "F",
                "range_field": 6,
                "weight_factor": 0.71
            },
            {
                "id": 10,
                "last_name": "Moreno",
                "gender": "Male",
                "invariant": "Invariant",
                "sum_field": 4,
                "average_field": 5,
                "count_or_distinct_field": "M",
                "range_field": 6,
                "weight_factor": 0.22
            },
            {
                "id": 11,
                "last_name": "Perez",
                "gender": "Female",
                "invariant": "Invariant",
                "sum_field": 10,
                "average_field": 8,
                "count_or_distinct_field": "F",
                "range_field": 5,
                "weight_factor": 0.69
            },
            {
                "id": 12,
                "last_name": "Sims",
                "gender": "Female",
                "invariant": "Invariant",
                "sum_field": 5,
                "average_field": 2,
                "count_or_distinct_field": "M",
                "range_field": 1,
                "weight_factor": 0.08
            },
            {
                "id": 13,
                "last_name": "Phillips",
                "gender": "Female",
                "invariant": "Invariant",
                "sum_field": 7,
                "average_field": 3,
                "count_or_distinct_field": "F",
                "range_field": 4,
                "weight_factor": 0.28
            },
            {
                "id": 14,
                "last_name": "Morris",
                "gender": "Male",
                "invariant": "Invariant",
                "sum_field": 8,
                "average_field": 7,
                "count_or_distinct_field": "F",
                "range_field": 7,
                "weight_factor": 0.87
            },
            {
                "id": 15,
                "last_name": "Burns",
                "gender": "Male",
                "invariant": "Invariant",
                "sum_field": 8,
                "average_field": 4,
                "count_or_distinct_field": "F",
                "range_field": 3,
                "weight_factor": 0.42
            }];
    }

    columnDefs():ColumnDef[] {
        return [
            {
                colTag: "id",
                format: ColumnFormat.NUMBER,
                aggregationMethod: AggregationMethod.COUNT
            },
            {
                colTag: "last_name",
                format: ColumnFormat.STRING,
                aggregationMethod: AggregationMethod.COUNT_DISTINCT
            },
            {
                colTag: "gender",
                format: ColumnFormat.STRING,
                aggregationMethod: AggregationMethod.COUNT_OR_DISTINCT
            },
            {
                colTag: "invariant",
                format: ColumnFormat.STRING,
                aggregationMethod: AggregationMethod.COUNT_OR_DISTINCT
            },
            {
                colTag: "sum_field",
                format: ColumnFormat.NUMBER,
                aggregationMethod: AggregationMethod.SUM
            }, {
                colTag: "average_field",
                format: ColumnFormat.NUMBER,
                aggregationMethod: AggregationMethod.AVERAGE
            },
            {
                colTag: "range_field",
                format: ColumnFormat.NUMBER,
                aggregationMethod: AggregationMethod.RANGE
            }
        ];
    }

    tree() {
        return TreeBuilder.buildTree(this.rawData());
    }

    columns() {
        return this.columnDefs();
    }

    detailRows() {
        return this.tree().getRoot().detailRows;
    }

}

class PeopleTestData implements TestDataFactory {

    constructor() {
    }

    rawData():any[] {
        return [{"gender": "Female", "first_name": "Maria", "last_name": "Young", "gift": 2},
            {"gender": "Female", "first_name": "Kimberly", "last_name": "Kennedy", "gift": 2},
            {"gender": "Female", "first_name": "Lisa", "last_name": "Hall", "gift": 10},
            {"gender": "Female", "first_name": "Andrea", "last_name": "Peterson", "gift": 4},
            {"gender": "Male", "first_name": "Clarence", "last_name": "Cox", "gift": 9},
            {"gender": "Male", "first_name": "Charles", "last_name": "Riley", "gift": 7},
            {"gender": "Male", "first_name": "Bruce", "last_name": "Turner", "gift": 2},
            {"gender": "Female", "first_name": "Shirley", "last_name": "Riley", "gift": 9},
            {"gender": "Male", "first_name": "David", "last_name": "Hunt", "gift": 7},
            {"gender": "Male", "first_name": "Thomas", "last_name": "Bradley", "gift": 6}];
    }

    columnDefs():ColumnDef[] {
        return [
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
                colTag: "gift",
                title: "Gift",
                format: ColumnFormat.NUMBER,
                aggregationMethod: AggregationMethod.SUM
            }
        ];
    }

    tree():Tree {
        return TreeBuilder.buildTree(this.rawData(), [{colTag: "gender"}]);
    }

    columns():Column[] {
        return this.columnDefs();
    }

    detailRows():Row[] {
        return TreeBuilder.buildTree(this.rawData()).getRoot().detailRows;
    }
}

export class TestUtils {

    static getSimpleRawDataWithMissing():any[] {
        return [
            {"col1": "A", "col2": "C"},
            {"col1": "B"},
            {"col1": "A", "col2": "C"},
            {"col1": "A", "col2": "D"},
            {"col1": "B"}
        ];
    }

    static getSimpleRawData():any[] {
        return [
            {"col1": "A", "col2": "C"},
            {"col1": "B", "col2": "C"},
            {"col1": "A", "col2": "C"},
            {"col1": "A", "col2": "D"},
            {"col1": "B", "col2": "D"}
        ];
    }

    static getDetailRowWithMissingData():DetailRow {
        return new DetailRow({
            "numCol1": 7,
            "textCol1": "R2D2",
            "textCol2": "City Wok"
        });
    }

    static getDetailRow():DetailRow {
        return new DetailRow({
            "numCol1": 7,
            "numCol2": 42,
            "textCol1": "R2D2",
            "textCol2": "City Wok"
        });
    }

    static getSimpleSubtotalRow():SubtotalRow {
        const subtotalRow:SubtotalRow = new SubtotalRow("Sector X");
        subtotalRow.setData({
            "numCol1": 2187,
            "numCol2": 117,
            "textCol1": "BB8",
            "textCol2": "This is Sparta!"
        });
        return subtotalRow;
    }

    /**
     * returns column definitions for two numeric columns: numCol1, numCol2, as well as two string columns: textCol1, textCol2
     * @returns {ColumnDef[]}
     */
    static getSimpleColumnDefs():ColumnDef[] {
        const columnDef1:ColumnDef = {
            colTag: "numCol1",
            title: "",
            format: ColumnFormat.NUMBER,
            aggregationMethod: AggregationMethod.SUM
        };
        const columnDef2:ColumnDef = {
            colTag: "numCol2",
            title: "",
            format: ColumnFormat.NUMBER,
            aggregationMethod: AggregationMethod.SUM
        };
        const columnDef3:ColumnDef = {
            colTag: "textCol1",
            title: "",
            format: ColumnFormat.STRING,
            aggregationMethod: AggregationMethod.NONE
        };
        const columnDef4:ColumnDef = {
            colTag: "textCol2",
            title: "",
            format: ColumnFormat.STRING,
            aggregationMethod: AggregationMethod.NONE
        };

        return [
            columnDef1,
            columnDef2,
            columnDef3,
            columnDef4
        ];
    }

    static newPeopleTestData():PeopleTestData {
        return new PeopleTestData();
    }

    static newComprehensiveTypeData():ComprehensiveTypeData {
        return new ComprehensiveTypeData();
    }

    private static mockColumnGroupDefinition = {
        columnGroupDefs: [
            {
                title: "Group 1",
                columns: ["col1", "col2"]
            },
            {
                title: "Group 2",
                columns: ["col3", "col2", "col4"] // col2 is repeated intentionally
            }],

        columnDefs: [
            {
                colTag: "col1"
            },
            {
                colTag: "col2"
            },
            {
                colTag: "col3"
            },
            {
                colTag: "col4"
            }
        ],
        state: {
            tree: null,
            columns: [],
            sortBys: [],
            subtotalBys: [],
            filterBys: [],
            rasterizedRows: [],
            displayStart: 0,
            displayEnd: 1
        }
    };

    static getMockColumnGroupDefs():ColumnGroupDef[] {
        return this.mockColumnGroupDefinition.columnGroupDefs;
    }

    static getMockColumnDefs():Column[] {
        return this.mockColumnGroupDefinition.columnDefs;
    }

    static getMockState():GigaState {
        return this.mockColumnGroupDefinition.state;
    }
}