import {GigaGrid} from "../src/components/GigaGrid";
import {TestUtils} from "../test/TestUtils";
import {SubtotalBy} from "../src/models/ColumnLike";
import * as $ from 'jquery';
import React = require('react');
import ReactDOM = require('react-dom');
import {SortDirection} from "../src/models/ColumnLike";
import {ColumnFormat} from "../src/models/ColumnLike";
import {Row} from "../src/models/Row";

const element = React.createElement(GigaGrid, {
    bodyHeight: "350px",
    data: TestUtils.getSampleData().data,
    columnDefs: TestUtils.getSampleData().columnDefs,
    columnGroups: [
        {title: "Names", columns: ["first_name", "last_name"]},
        {title: "Other Info", columns: ["gender", "gift"]}
    ],
    initialSortBys: [{colTag: "gift", format: ColumnFormat.NUMBER, direction: SortDirection.ASC}],
});

ReactDOM.render(element, document.getElementById('column_grouping'));
