import {GigaGrid} from "../src/components/GigaGrid";
import {TestUtils} from "../test/TestUtils";
import {SortDirection, ColumnFormat} from "../src/models/ColumnLike";
import * as React from "react";
import * as ReactDOM from "react-dom";

export default function run() {

    const peopleData = TestUtils.newPeopleTestData();

    ReactDOM.render(<GigaGrid
        data={peopleData.rawData()}
        initialSortBys={[{colTag: "gift", format: ColumnFormat.NUMBER, direction: SortDirection.ASC}]}
        bodyHeight="550px"
        columnDefs={peopleData.columnDefs()}
        columnGroups={[
    {title: "Names", columns: ["first_name", "last_name"]},
    {title: "Other Info", columns: ["gender", "gift"]}
    ]}
    />, document.getElementById('column_grouping'));

};