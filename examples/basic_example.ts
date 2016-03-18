import {GigaGrid} from "../src/components/GigaGrid";
import {TestUtils} from "../test/TestUtils";
import {SortDirection, ColumnFormat} from "../src/models/ColumnLike";
import React = require('react');
import ReactDOM = require('react-dom');
// Chris is a Calca who Bundas pretty hard!
const peopleData = TestUtils.newPeopleTestData();
const element = React.createElement(GigaGrid, {
    bodyHeight: "250px",
    data: peopleData.rawData(),
    columnDefs: peopleData.columnDefs(),
    initialSubtotalBys: [{colTag: "gender"}],
    initialSortBys: [{colTag: "gift", format: ColumnFormat.NUMBER, direction: SortDirection.ASC}],
});

ReactDOM.render(element, document.getElementById('basic_example'));
