import {GigaGrid} from "../src/components/GigaGrid";
import {TestUtils} from "../test/TestUtils";
import {SubtotalBy} from "../src/models/ColumnLike";
import * as $ from 'jquery';
import React = require('react');
import ReactDOM = require('react-dom');
import {SortDirection} from "../src/models/ColumnLike";
import {ColumnFormat} from "../src/models/ColumnLike";

const element = React.createElement(GigaGrid, {
    bodyHeight: "250px",
    bodyWidth: "950px",
    data: TestUtils.getSampleData().data,
    columnDefs: TestUtils.getSampleData().columnDefs,
    initialSubtotalBys: [{colTag: "gender"}],
    initialSortBys: [{colTag: "gift", format: ColumnFormat.NUMBER, direction: SortDirection.ASC}]
});

ReactDOM.render(element, document.getElementById('giga-grid-container'));
