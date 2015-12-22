import ReactInstance = __React.ReactInstance;
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
            .html().replace(TestUtils.regex.dataReact, ''))
            .toEqual("<td style=\"width:auto;padding-left:10px;\" class=\"giga-grid-locked-col\"><strong>Sector X</strong></td>" +
                "<td style=\"width:auto;\">117</td>" +
                "<td style=\"width:auto;\">BB8</td>" +
                "<td style=\"width:auto;\">This is Sparta!</td>");

    });

    describe("should render a SubtotalRow that is N layers deep in the tree:", ()=> {
        it("2 layers", () => {
            var sampleSubtotalRow = TestUtils.getSampleSubtotalRow();
            sampleSubtotalRow.setSectorPath(['Sector X']);
            const tableRowProps:TableRowProps = new TableRowProps(sampleSubtotalRow, TestUtils.getSampleTableRowColumnDefs());
            const tableRowElement = React.createElement(TableRow, tableRowProps);

            ReactDOM.render(tableRowElement, document.getElementById('container'));
            expect($("#container").find("tr")
                .html().replace(TestUtils.regex.dataReact, ''))
                .toEqual("<td style=\"width:auto;padding-left:35px;\" class=\"giga-grid-locked-col\"><strong>Sector X</strong></td>" +
                    "<td style=\"width:auto;\">117</td>" +
                    "<td style=\"width:auto;\">BB8</td>" +
                    "<td style=\"width:auto;\">This is Sparta!</td>");
        });

        it("3 layers", () => {
            var sampleSubtotalRow = TestUtils.getSampleSubtotalRow();
            sampleSubtotalRow.setSectorPath(['Sector X', 'Another']);
            const tableRowProps:TableRowProps = new TableRowProps(sampleSubtotalRow, TestUtils.getSampleTableRowColumnDefs());
            const tableRowElement = React.createElement(TableRow, tableRowProps);

            ReactDOM.render(tableRowElement, document.getElementById('container'));
            expect($("#container").find("tr")
                .html().replace(TestUtils.regex.dataReact, ''))
                .toEqual("<td style=\"width:auto;padding-left:60px;\" class=\"giga-grid-locked-col\"><strong>Sector X</strong></td>" +
                    "<td style=\"width:auto;\">117</td>" +
                    "<td style=\"width:auto;\">BB8</td>" +
                    "<td style=\"width:auto;\">This is Sparta!</td>");
        });

        it("4 layers", () => {
            var sampleSubtotalRow = TestUtils.getSampleSubtotalRow();
            sampleSubtotalRow.setSectorPath(['Sector X', 'Another', 'Another']);
            const tableRowProps:TableRowProps = new TableRowProps(sampleSubtotalRow, TestUtils.getSampleTableRowColumnDefs());
            const tableRowElement = React.createElement(TableRow, tableRowProps);

            ReactDOM.render(tableRowElement, document.getElementById('container'));
            expect($("#container").find("tr")
                .html().replace(TestUtils.regex.dataReact, ''))
                .toEqual("<td style=\"width:auto;padding-left:85px;\" class=\"giga-grid-locked-col\"><strong>Sector X</strong></td>" +
                    "<td style=\"width:auto;\">117</td>" +
                    "<td style=\"width:auto;\">BB8</td>" +
                    "<td style=\"width:auto;\">This is Sparta!</td>");
        });
    });


    it("should render a DetailRow", ()=> {

        const tableRowProps:TableRowProps = new TableRowProps(TestUtils.getDetailRow(), TestUtils.getSampleTableRowColumnDefs());
        const tableRowElement = React.createElement(TableRow, tableRowProps);

        ReactDOM.render(tableRowElement, document.getElementById('container'));
        expect($("#container").find("tr")
            .html().replace(TestUtils.regex.dataReact, ''))
            .toEqual(
                "<td style=\"width:auto;\">7</td>" +
                "<td style=\"width:auto;\">42</td>" +
                "<td style=\"width:auto;\">R2D2</td>" +
                "<td style=\"width:auto;\">City Wok</td>");

    });

    it("should render a row with missing data", ()=> {

        const tableRowProps:TableRowProps = new TableRowProps(TestUtils.getRowWithMissingData(), TestUtils.getSampleTableRowColumnDefs());
        const tableRowElement = React.createElement(TableRow, tableRowProps);

        ReactDOM.render(tableRowElement, document.getElementById('container'));
        expect($("#container").find("tr")
            .html().replace(TestUtils.regex.dataReact, ''))
            .toEqual(
                "<td style=\"width:auto;\">7</td>" +
                "<td style=\"width:auto;\"></td>" +
                "<td style=\"width:auto;\">R2D2</td>" +
                "<td style=\"width:auto;\">City Wok</td>");

    });

});
