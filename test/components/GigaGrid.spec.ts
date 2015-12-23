describe('GigaGrid', ()=> {

    afterEach(()=> {
        ReactDOM.unmountComponentAtNode(document.getElementById('container'));
        $("body").empty();
    });

    beforeEach(()=> {
        $("body").append("<div id='container'></div>");
    });

    it("can render a basic HTML table", () => {

        const data:any[] = TestUtils.getSampleData().data;
        const columnDefs:ColumnDef[] = TestUtils.getSampleData().columnDefs;
        const gigaGridProps:GigaGridProps = new GigaGridProps(data, columnDefs);
        const element = React.createElement(GigaGrid, gigaGridProps);
        const $container = $("#container");

        ReactDOM.render(element, document.getElementById("container"));

        expect($container.find("table > tbody").find("tr").length).toBe(10);
        expect($container.find("table > thead").find("th").first().text()).toBe("First Name");

    });

    it("it can render a subtotaled HTML table (as indicated by the presence of additional `tr` in the DOM)", () => {

        const data:any[] = TestUtils.getSampleData().data;
        const columnDefs:ColumnDef[] = TestUtils.getSampleData().columnDefs;
        const gigaGridProps:GigaGridProps = new GigaGridProps(data, columnDefs);
        gigaGridProps.initialSubtotalBys = [new SubtotalBy("gender")];

        const element = React.createElement(GigaGrid, gigaGridProps);
        const $container = $("#container");

        ReactDOM.render(element, document.getElementById("container"));

        expect($container.find("table > tbody").find("tr").length).toBe(12);

    });

    // TODO write addition tests for corner cases and other features

});
