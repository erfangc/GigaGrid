import {GigaGrid} from "../src/components/GigaGrid";
import {TestUtils} from "../test/TestUtils";
import {SubtotalBy} from "../src/models/ColumnLike";
import * as $ from 'jquery';
import React = require('react');
import ReactDOM = require('react-dom');
const element = React.createElement(GigaGrid, {
    data: TestUtils.getSampleData().data,
    columnDefs: TestUtils.getSampleData().columnDefs,
    initialSubtotalBys: [{colTag: "gender"}]
});
ReactDOM.render(element, document.getElementById('giga-grid-container'));