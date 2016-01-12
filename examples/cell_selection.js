var GigaGrid_1 = require("../src/components/GigaGrid");
var TestUtils_1 = require("../test/TestUtils");
var React = require('react');
var ReactDOM = require('react-dom');
var ColumnLike_1 = require("../src/models/ColumnLike");
var ColumnLike_2 = require("../src/models/ColumnLike");
var element = React.createElement(GigaGrid_1.GigaGrid, {
    bodyHeight: "250px",
    data: TestUtils_1.TestUtils.getSampleData().data,
    columnDefs: TestUtils_1.TestUtils.getSampleData().columnDefs,
    initialSubtotalBys: [{ colTag: "gender" }],
    initialSortBys: [{ colTag: "gift", format: ColumnLike_2.ColumnFormat.NUMBER, direction: ColumnLike_1.SortDirection.ASC }],
    onCellClick: function (row, columnDef) {
        alert("You clicked on " + row.data()[columnDef.colTag]);
        return true;
    }
});
ReactDOM.render(element, document.getElementById('cell_selection'));
//# sourceMappingURL=cell_selection.js.map