import {GigaGrid} from "../src/components/GigaGrid";
import {TestUtils} from "../test/TestUtils";
import {SubtotalBy} from "../src/models/ColumnLike";
import * as $ from 'jquery';
import React = require('react');
import ReactDOM = require('react-dom');
import {SortDirection} from "../src/models/ColumnLike";
import {ColumnFormat} from "../src/models/ColumnLike";
import {Column} from "../src/models/ColumnLike";

const columnDefs = TestUtils.getSampleData().columnDefs;
const customColumnDef = columnDefs[0];

customColumnDef.cellTemplateCreator = (data:any) => {
    return React.createElement("a", {className: "special-cell", onClick: ()=>{alert(`You clicked on ${data}`)}}, data);
};

const element = React.createElement(GigaGrid, {
    bodyHeight: "450px",
    data: TestUtils.getSampleData().data,
    columnDefs: columnDefs,
    initialSubtotalBys: [{colTag: "gender"}],
    initialSortBys: [{colTag: "gift", format: ColumnFormat.NUMBER, direction: SortDirection.ASC}]
});

ReactDOM.render(element, document.getElementById('custom_cell_template'));
