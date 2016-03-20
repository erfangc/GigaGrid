import {ColumnFormat, AggregationMethod, ColumnDef} from "../../src/models/ColumnLike";
import data = require("./UKBudget.json");

export var ukBudgetColumnDefs: ColumnDef[] = [
    {colTag: "Age", title: "Age"},
    {colTag: "Children", title: "# of Children"},
    {colTag: "WFood", title: "Food", format: ColumnFormat.NUMBER, aggregationMethod: AggregationMethod.AVERAGE, formatInstruction: {roundTo: 4}},
    {colTag: "WFuel", title: "Fuel", format: ColumnFormat.NUMBER, aggregationMethod: AggregationMethod.AVERAGE, formatInstruction: {roundTo: 4}},
    {colTag: "WCloth", title: "Cloth", format: ColumnFormat.NUMBER, aggregationMethod: AggregationMethod.AVERAGE, formatInstruction: {roundTo: 4}},
    {colTag: "WAlc", title: "Alc", format: ColumnFormat.NUMBER, aggregationMethod: AggregationMethod.AVERAGE, formatInstruction: {roundTo: 4}},
    {colTag: "WTrans", title: "Transportation", format: ColumnFormat.NUMBER, aggregationMethod: AggregationMethod.AVERAGE, formatInstruction: {roundTo: 4}},
    {colTag: "WOther", title: "Other", format: ColumnFormat.NUMBER, aggregationMethod: AggregationMethod.AVERAGE, formatInstruction: {roundTo: 4},},
    {colTag: "TotExp", title: "Total Expense", format: ColumnFormat.NUMBER, aggregationMethod: AggregationMethod.AVERAGE, formatInstruction: {roundTo: 0}},
    {colTag: "Income", title: "Income", format: ColumnFormat.NUMBER, aggregationMethod: AggregationMethod.AVERAGE, formatInstruction: {roundTo: 0}}
];

export var ukBudgetInitialSubtotalBys:[{colTag: "Age"}, {colTag:"Children"}];

export var ukBudget = data;
