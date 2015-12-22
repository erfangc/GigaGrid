describe("TableRow", () => {

    afterEach(()=> {
        ReactDOM.unmountComponentAtNode(document.getElementById('container'));
        $("body").empty();
    });

    beforeEach(()=> {
        $("body").append("<table><tbody id='container'></tbody></table>");
    });

    it("should render a SubtotalRow", ()=> {

        const tableRowProps:TableRowProps = new TableRowProps(TestUtils.getSampleSubtotalRow(), TestUtils.getSampleTableRowColumnDefs());
        const tableRowElement = React.createElement(TableRow, tableRowProps);

        ReactDOM.render(tableRowElement, document.getElementById('container'));
        expect($("#container").find("tr")
            .html())
            .toEqual(
                "<td style=\"width:auto;\" data-reactid=\".0.$0\">2187</td>" +
                "<td style=\"width:auto;\" data-reactid=\".0.$1\">117</td>" +
                "<td style=\"width:auto;\" data-reactid=\".0.$2\">BB8</td>" +
                "<td style=\"width:auto;\" data-reactid=\".0.$3\">This is Sparta!</td>");

    });

    it("should render a DetailRow", ()=> {

        const tableRowProps:TableRowProps = new TableRowProps(TestUtils.getDetailRow(), TestUtils.getSampleTableRowColumnDefs());
        const tableRowElement = React.createElement(TableRow, tableRowProps);

        ReactDOM.render(tableRowElement, document.getElementById('container'));
        expect($("#container").find("tr")
            .html())
            .toEqual(
                "<td style=\"width:auto;\" data-reactid=\".1.$0\">7</td>" +
                "<td style=\"width:auto;\" data-reactid=\".1.$1\">42</td>" +
                "<td style=\"width:auto;\" data-reactid=\".1.$2\">R2D2</td>" +
                "<td style=\"width:auto;\" data-reactid=\".1.$3\">City Wok</td>");

    });

});