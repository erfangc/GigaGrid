describe("SubtotalTableRow", () => {

    afterEach(()=> {
        ReactDOM.unmountComponentAtNode(document.getElementById('container'));
        $("body").empty();
    });

    beforeEach(()=> {
        $("body").append("<table><tbody id='container'></tbody></table>");
    });

    it("should render a SubtotalRow", ()=> {

        const props:SubtotalTableRowProps = new SubtotalTableRowProps(TestUtils.getSampleSubtotalRow(), TestUtils.getSampleTableRowColumnDefs());
        const element = React.createElement(SubtotalTableRow, props);

        ReactDOM.render(element, document.getElementById('container'));

        expect($("#container").find("tr")
            .html().replace(TestUtils.regex.dataReact, ''))
            .toEqual('<td style="width:auto;padding-left:10px;" class="giga-grid-locked-col"><strong><span><i class="fa fa-plus"></i>' +
                '</span><span>Sector X</span></strong></td>' +
                '<td style="width:auto;">117</td>' +
                '<td style="width:auto;">BB8</td>' +
                '<td style="width:auto;">This is Sparta!</td>');

    });

    describe("should render a SubtotalRow that is N layers deep in the tree:", ()=> {
        it("2 layers", () => {
            var subtotalRow = TestUtils.getSampleSubtotalRow();
            subtotalRow.setSectorPath(['Sector X']);
            const props:SubtotalTableRowProps = new SubtotalTableRowProps(subtotalRow, TestUtils.getSampleTableRowColumnDefs());
            const element = React.createElement(SubtotalTableRow, props);

            ReactDOM.render(element, document.getElementById('container'));
            expect($("#container").find("tr")
                .html().replace(TestUtils.regex.dataReact, ''))
                .toEqual('<td style="width:auto;padding-left:35px;" class="giga-grid-locked-col"><strong><span><i class="fa fa-plus"></i></span><span>Sector X</span></strong></td>' +
                    '<td style=\"width:auto;\">117</td>' +
                    '<td style=\"width:auto;\">BB8</td>' +
                    '<td style=\"width:auto;\">This is Sparta!</td>');
        });

        it("3 layers", () => {
            var subtotalRow = TestUtils.getSampleSubtotalRow();
            subtotalRow.setSectorPath(['Sector X', 'Another']);
            const props:SubtotalTableRowProps = new SubtotalTableRowProps(subtotalRow, TestUtils.getSampleTableRowColumnDefs());
            const element = React.createElement(SubtotalTableRow, props);

            ReactDOM.render(element, document.getElementById('container'));
            expect($("#container").find("tr")
                .html().replace(TestUtils.regex.dataReact, ''))
                .toEqual('<td style=\"width:auto;padding-left:60px;\" class=\"giga-grid-locked-col\"><strong><span><i class="fa fa-plus"></i></span><span>Sector X</span></strong></td>' +
                    '<td style=\"width:auto;\">117</td>' +
                    '<td style=\"width:auto;\">BB8</td>' +
                    '<td style=\"width:auto;\">This is Sparta!</td>');
        });

        it("4 layers", () => {
            var subtotalRow = TestUtils.getSampleSubtotalRow();
            subtotalRow.setSectorPath(['Sector X', 'Another', 'Another']);
            const props:SubtotalTableRowProps = new SubtotalTableRowProps(subtotalRow, TestUtils.getSampleTableRowColumnDefs());
            const element = React.createElement(SubtotalTableRow, props);

            ReactDOM.render(element, document.getElementById('container'));
            expect($("#container").find("tr")
                .html().replace(TestUtils.regex.dataReact, ''))
                .toEqual('<td style=\"width:auto;padding-left:85px;\" class=\"giga-grid-locked-col\"><strong><span><i class="fa fa-plus"></i></span><span>Sector X</span></strong></td>' +
                    '<td style=\"width:auto;\">117</td>' +
                    '<td style=\"width:auto;\">BB8</td>' +
                    '<td style=\"width:auto;\">This is Sparta!</td>');
        });
    });


    it("should render a DetailRow", ()=> {

        const props:TableRowProps = new DetailTableRowProps(TestUtils.getDetailRow(), TestUtils.getSampleTableRowColumnDefs());
        const element = React.createElement(DetailTableRow, props);

        ReactDOM.render(element, document.getElementById('container'));
        expect($("#container").find("tr")
            .html().replace(TestUtils.regex.dataReact, ''))
            .toEqual(
                "<td style=\"width:auto;\">7</td>" +
                "<td style=\"width:auto;\">42</td>" +
                "<td style=\"width:auto;\">R2D2</td>" +
                "<td style=\"width:auto;\">City Wok</td>");

    });

    it("should render a row with missing data", ()=> {

        const props:DetailTableRowProps = new DetailTableRowProps(TestUtils.getRowWithMissingData(), TestUtils.getSampleTableRowColumnDefs());
        const element = React.createElement(DetailTableRow, props);

        ReactDOM.render(element, document.getElementById('container'));
        expect($("#container").find("tr")
            .html().replace(TestUtils.regex.dataReact, ''))
            .toEqual(
                "<td style=\"width:auto;\">7</td>" +
                "<td style=\"width:auto;\"></td>" +
                "<td style=\"width:auto;\">R2D2</td>" +
                "<td style=\"width:auto;\">City Wok</td>");

    });

});
