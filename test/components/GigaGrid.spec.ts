import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ColumnDef} from "../../src/models/ColumnLike";
import {GigaProps} from "../../src/components/GigaGrid";
import {GigaGrid} from "../../src/components/GigaGrid";
import {SubtotalBy} from "../../src/models/ColumnLike";
import {TestUtils} from "../TestUtils";

// TODO use ReactTestUtils
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
        const gigaGridProps:GigaProps = {data: data, columnDefs: columnDefs};
        const element = React.createElement(GigaGrid, gigaGridProps);
        const $container = $("#container");

        ReactDOM.render(element, document.getElementById("container"));

        expect($container.find("table > tbody").find("tr").length).toBe(10);
        expect($container.find("table > thead").find("th").first().text().substr(0,10)).toBe("First Name");

    });

    it("it can render a subtotaled HTML table (as indicated by the presence of additional `tr` in the DOM)", () => {

        const data:any[] = TestUtils.getSampleData().data;
        const columnDefs:ColumnDef[] = TestUtils.getSampleData().columnDefs;
        const gigaGridProps:GigaProps = {data: data, columnDefs: columnDefs};
        gigaGridProps.initialSubtotalBys = [{colTag: "gender"}];

        const element = React.createElement<GigaProps>(GigaGrid, gigaGridProps);
        const $container = $("#container");

        ReactDOM.render(element, document.getElementById("container"));

        expect($container.find("table > tbody").find("tr").length).toBe(12);

    });

    // TODO write addition tests for corner cases and other features


});
