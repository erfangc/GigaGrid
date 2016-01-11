import {GigaGrid} from "../src/components/GigaGrid";
import {TestUtils} from "../test/TestUtils";
import {SubtotalBy} from "../src/models/ColumnLike";
import * as $ from 'jquery';
import React = require('react');
import ReactDOM = require('react-dom');
import {SortDirection} from "../src/models/ColumnLike";
import {ColumnFormat} from "../src/models/ColumnLike";
import {Row} from "../src/models/Row";

const peopleData = TestUtils.newPeopleTestData();
const element = React.createElement(GigaGrid, {
    bodyHeight: "250px",
    data: peopleData.rawData(),
    columnDefs: peopleData.columnDefs(),
    initialSubtotalBys: [{colTag: "gender"}],
    initialSortBys: [{colTag: "gift", format: ColumnFormat.NUMBER, direction: SortDirection.ASC}],
});

ReactDOM.render(element, document.getElementById('basic_example'));
