var GigaGrid_1 = require("../src/components/GigaGrid");
var TestUtils_1 = require("../test/TestUtils");
var React = require('react');
var ReactDOM = require('react-dom');
var ColumnLike_1 = require("../src/models/ColumnLike");
var ColumnLike_2 = require("../src/models/ColumnLike");
var columnDefs = TestUtils_1.TestUtils.getSampleData().columnDefs;
var customColumnDef = columnDefs[0];
customColumnDef.cellTemplateCreator = function (data) {
    return React.createElement("a", { className: "special-cell", onClick: function () { alert("You clicked on " + data); } }, data);
};
var element = React.createElement(GigaGrid_1.GigaGrid, {
    bodyHeight: "450px",
    data: TestUtils_1.TestUtils.getSampleData().data,
    columnDefs: columnDefs,
    initialSubtotalBys: [{ colTag: "gender" }],
    initialSortBys: [{ colTag: "gift", format: ColumnLike_2.ColumnFormat.NUMBER, direction: ColumnLike_1.SortDirection.ASC }]
});
ReactDOM.render(element, document.getElementById('custom_cell_template'));
//# sourceMappingURL=custom_cell_template.js.map