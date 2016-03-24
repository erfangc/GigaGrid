declare var require: any;

import {ColumnFormat, AggregationMethod, ColumnDef, SubtotalBy} from "../../src/models/ColumnLike";
import {GigaProps} from "../../src/components/GigaGrid";
var json = require("./UKBudget.json");

const columnDefs:ColumnDef[] = [
    {colTag: "Age", title: "Age"},
    {
        colTag: "Children",
        title: "# of Children",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.COUNT
        // weightBy: "Income"
    },
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
        formatInstruction: {roundTo: 4}
    },
    {
        colTag: "WCloth",
        title: "Cloth",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 4}
    },
    {
        colTag: "WAlc",
        title: "Alc",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 4}
    },
    {
        colTag: "WTrans",
        title: "Transportation",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 4}
    },
    {
        colTag: "WOther",
        title: "Other",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 4},
    },
    {
        colTag: "TotExp",
        title: "Total Expense",
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

const initialSubtotalBys:SubtotalBy[] = [{colTag:"Age"}, {colTag:"Children"}];

// const initialSortBy:SortBy[] = [{colTag: "Age", sortDirection: SortDirection.DESC}];

const props:GigaProps = {
    columnDefs: columnDefs,
    initialSubtotalBys: initialSubtotalBys,
    data: json as any[]
};

export default props;
