import {GigaGrid} from "../src/components/GigaGrid";
import {TestUtils} from "../test/TestUtils";
import {SubtotalBy} from "../src/models/ColumnLike";
import * as $ from 'jquery';
import React = require('react');
import ReactDOM = require('react-dom');
import {SortDirection} from "../src/models/ColumnLike";
import {ColumnFormat} from "../src/models/ColumnLike";
import {Row} from "../src/models/Row";
import {AggregationMethod} from "../src/models/ColumnLike";
import {GigaProps} from "../src/components/GigaGrid";

$.ajax("./examples/data/Hotels.json").done(function (data:any[]) {

    const element = React.createElement<GigaProps>(GigaGrid, {
        bodyHeight: "500px",
        data: data,
        columnDefs: columnDefs
    });

    ReactDOM.render(element, document.getElementById('custom_column_width'));

});

const columnDefs = [
    {
        colTag: "Location",
        title: "Location",
        aggregationMethod: AggregationMethod.NONE,
        format: ColumnFormat.STRING,
        width: "250px"
    },
    {
        colTag: "Beds",
        title: "Beds",
        aggregationMethod: AggregationMethod.AVERAGE,
        format: ColumnFormat.STRING,
        width: "300px"
    },
    {
        colTag: "Breakfast Included",
        title: "Breakfast Included",
        aggregationMethod: AggregationMethod.COUNT_OR_DISTINCT,
        format: ColumnFormat.STRING,
        width: "200px"
    },
    {
        colTag: "Distance to Airport",
        title: "Distance to Airport",
        aggregationMethod: AggregationMethod.AVERAGE,
        format: ColumnFormat.NUMBER,
        width: "250px"
    },
    {
        colTag: "Price / Night",
        title: "Price / Night",
        aggregationMethod: AggregationMethod.AVERAGE,
        format: ColumnFormat.NUMBER,
        width: "250px"
    },
    {
        colTag: "Rating",
        title: "Rating",
        aggregationMethod: AggregationMethod.AVERAGE,
        format: ColumnFormat.NUMBER,
        width: "100px"
    }
];