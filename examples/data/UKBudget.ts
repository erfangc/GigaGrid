declare var require:any;

import {ColumnFormat, AggregationMethod, ColumnDef, Column} from "../../src/models/ColumnLike";
import {GigaProps} from "../../src/components/GigaGrid";
var json = require("./UKBudget.json");

const columnDefs:ColumnDef[] = [
    {
        colTag: "WFood",
        title: "Food",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 1}
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
    }
];

const initialSubtotalBys:Column[] = [{colTag: "Age", title: "Age"}, {colTag: "Children", title: "Children"}, {colTag: "Income", title: "Income"}];

const props:GigaProps = {
    columnDefs: columnDefs,
    initialSubtotalBys: initialSubtotalBys,
    data: json as any[]
};

export default props;
