import {GigaGrid, GigaProps} from "../src/components/GigaGrid";
import {ColumnFormat, AggregationMethod} from "../src/models/ColumnLike";
import * as $ from "jquery";
import React = require('react');
import ReactDOM = require('react-dom');

$.ajax("./examples/data/Hotels.json").done(function (data:any[]) {

    const element = React.createElement<GigaProps>(GigaGrid, {
        bodyHeight: "500px",
        data: data,
        columnDefs: columnDefs
    });

    ReactDOM.render(element, document.getElementById('larger_data_set'));

});

const columnDefs = [
    {
        colTag: "Location",
        title: "Location",
        aggregationMethod: AggregationMethod.NONE,
        format: ColumnFormat.STRING
    },
    {
        colTag: "Beds",
        title: "Beds",
        aggregationMethod: AggregationMethod.AVERAGE,
        format: ColumnFormat.NUMBER,
        formatInstruction: {
            roundTo: 0
        }
    },
    {
        colTag: "Breakfast Included",
        title: "Breakfast Included",
        aggregationMethod: AggregationMethod.COUNT_OR_DISTINCT,
        format: ColumnFormat.STRING
    },
    {
        colTag: "Distance to Airport",
        title: "Distance to Airport",
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {
            roundTo: 2
        },
        format: ColumnFormat.NUMBER
    },
    {
        colTag: "Price / Night",
        title: "Price / Night",
        aggregationMethod: AggregationMethod.AVERAGE,
        format: ColumnFormat.NUMBER,
        formatInstruction: {
            roundTo: 2
        }
    },
    {
        colTag: "Rating",
        title: "Rating",
        aggregationMethod: AggregationMethod.AVERAGE,
        format: ColumnFormat.NUMBER,
        formatInstruction: {
            roundTo: 2
        }
    }
];