import {DetailRow} from "../src/models/Row";
import {ColumnDef} from "../src/models/ColumnLike";
import {ColumnFormat} from "../src/models/ColumnLike";
import {AggregationMethod} from "../src/models/ColumnLike";
import {SubtotalRow} from "../src/models/Row";
import {Column} from "../src/models/ColumnLike";
import {TreeBuilder} from "../src/static/TreeBuilder";
import {SubtotalAggregator} from "../src/static/SubtotalAggregator";
import {Tree} from "../src/static/TreeBuilder";
import {Row} from "../src/models/Row";

interface TestDataFactory {
    rawData():any[]
    columnDefs():ColumnDef[]
    tree():Tree
    columns():Column[]
    detailRows():Row[]
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

    static getUnsubtotaledTree():Tree {
        return TreeBuilder.buildTree(TestUtils.getSampleData().data);
    }

    static getTreeSubtotaledByGender():Tree {
        const tree = TreeBuilder.buildTree(TestUtils.getSampleData().data, [{colTag: "gender"}]);
        SubtotalAggregator.aggregateTree(tree, TestUtils.getSampleData().columnDefs);
        return tree;
    }

    /**
     * return a small set of sample data
     * @returns {{data: {gender: string, first_name: string, last_name: string, gift: number}[], columnDefs: ColumnDef[]}}
     */
    static getSampleData():{data: any[], columnDefs: ColumnDef[]} {
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
                colTag: "gift",
                title: "Gift",
                format: ColumnFormat.NUMBER,
                aggregationMethod: AggregationMethod.SUM
            }
        ];
        return {
            data: data,
            columnDefs: columnDefs
        };
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

    /**
     * wraps around the sample columnDefs returned by another method
     * @see getSimpleColumnDefs
     * @returns {Column[]}
     */
    static getSampleColumns():Column[] {
        return TestUtils.getSimpleColumnDefs();
    }

    static newPeopleTestData():PeopleTestData {
        return new PeopleTestData();
    }
}