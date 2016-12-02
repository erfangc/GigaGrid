import {GigaProps} from "../../src/components/GigaProps";
declare var require:any;

import {ColumnFormat, AggregationMethod, ColumnDef, Column} from "../../src/models/ColumnLike";
let json = require("./UKBudget.json");

const columnDefs:ColumnDef[] = [
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
        formatInstruction: {roundTo: 0}
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
    }
];

const initialSubtotalBys = ["Age","Children","Income"];

const props:GigaProps = {
    columnDefs: columnDefs,
    initialSubtotalBys: initialSubtotalBys,
    data: json as any[]
};

export default props;
