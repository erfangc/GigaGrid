import {GigaProps} from "../../src/components/GigaProps";
import {ColumnFormat, AggregationMethod, ColumnDef} from "../../src/models/ColumnLike";
import {GigaActionType} from "../../src/store/GigaStore";
import {CellContentChangeAction} from "../../src/store/handlers/CellContentChange";
declare var require: any;

let json = require("./UKBudget.json");

const columnDefs: any[] = [
    {
        colTag: "WFood",
        title: "Food",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {
            roundTo: 1
        }
    },
    {
        colTag: "WFuel",
        title: "Fuel",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 2, showAsPercent: true, multiplier: 100}
    },
    {
        colTag: "WCloth",
        title: "Cloth",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 2, showAsPercent: true, multiplier: 100}
    },
    {
        colTag: "WAlc",
        title: "Alc",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 2, showAsPercent: true, multiplier: 100}
    },
    {
        colTag: "WTrans",
        title: "Transportation",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 2, showAsPercent: true, multiplier: 100}
    },
    {
        colTag: "WOther",
        title: "Other",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 2, showAsPercent: true, multiplier: 100},
    },
    {
        colTag: "TotExp",
        title: "Total Expense",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {currency: "EUR"}
    },
    {
        colTag: "Age",
        title: "Age",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 0}
    },
    {
        colTag: "Children",
        title: "Children",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 0}
    },
    {
        colTag: "Income",
        title: "Income",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 0}
    },
    {
        colTag: "Time",
        title: "Time",
        format: "DATETIME",
        aggregationMethod: AggregationMethod.NONE,
        formatInstruction: {
            textAlign: 'left'
        },
        width: 35
    }
];

const initialSubtotalBys = ["Age", "Children", "Income"];

const props: GigaProps = {
    columnDefs: columnDefs,
    initialSubtotalBys: initialSubtotalBys,
    data: json as any[],
    onCellClick: function (row, columnDef, dispatcher) {
        let action: CellContentChangeAction = {
            type: GigaActionType.CELL_CONTENT_CHANGE,
            column: columnDef,
            row: row,
            newContent: 0
        };
        setTimeout(()=>{
            dispatcher.dispatch(action);
        });
        return true;
    }
};

export default props;
