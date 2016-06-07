import * as React from "react";
import * as ReactDOM from "react-dom";
import {GigaGrid} from "../index";
import {ColumnDef, BucketInfo} from "../src/models/ColumnLike";
import "../styles/theme/Default.styl";
import {Row, SubtotalRow} from "../src/models/Row";
import {Dispatcher} from "flux";
import {GigaAction, GigaActionType} from "../src/store/GigaStore";
import {ServerSubtotalRow} from "../src/store/ServerStore";
import $ = require('jquery');

// helper
function getAJAX(sectorPath:BucketInfo[],
                 select:ColumnDef[],
                 groupBy:ColumnDef,
                 onSuccess:(any)=>any) {

    const payload = {
        select: select,
        groupBy: groupBy,
        sectorPath: sectorPath
    };

    const fullRequest = {
        filter: [],
        date: "20160331",
        client: "100k",
        payload: payload
    };

    return {
        url: "http://nyclabbxg8wp.na.blkint.com:59171/analysis/fetch-rows",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(fullRequest),
        type: 'POST',
        success: onSuccess
    }

}

interface ExampleState {
    initialData:ServerSubtotalRow[]
}

export class Examples extends React.Component<{}, ExampleState> {

    static initialSubtotalBys() {
        return [
            {colTag: "metadata.business_unit", title: "Business Unit"},
            {colTag: "metadata.risk_profile", title: "Risk Profile"},
            {colTag: "metadata.office", title: "Office"},
        ];
    }

    static columnDefs() {
        return [
            {colTag: "accountID", title: "Account ID"},
            {colTag: "metadata.advisor_id", title: "Advisor", aggregationMethod: "COUNT"},
            {colTag: "risk.accountRisk", title: "Account Risk", aggregationMethod: "AVERAGE", formatInstruction: {roundTo: 2}},
            {colTag: "risk.benchRisk", title: "Benchmark Risk", aggregationMethod: "AVERAGE", formatInstruction: {roundTo: 2}}
        ];
    }

    constructor(props:{}) {
        super(props);
        this.state = {
            initialData: []
        };
        $.ajax(getAJAX(
            [],
            Examples.columnDefs(),
            Examples.initialSubtotalBys()[0], (resp) => {
                this.setState({
                    initialData: resp.rows
                });
            }));
    }

    render() {
        return (
            <div>
                <div>
                    {this.renderBasicExample()}
                </div>
            </div>
        );
    }

    private renderBasicExample() {

        const columnDefs = Examples.columnDefs();
        const initialSubtotalBys = Examples.initialSubtotalBys();

        function fetchRowsActionCreator(row:Row, dispatch:Dispatcher<GigaAction>) {
            // TODO figure out how to create a server requests from the variables available in this scope
            if ((row as SubtotalRow).getNumChildren() > 0 || (row as SubtotalRow).detailRows.length > 0) {
                dispatch.dispatch({
                    type: GigaActionType.TOGGLE_ROW_COLLAPSE,
                    subtotalRow: row
                });
            } else {
                // load more data (this will result in a spinner)
                dispatch.dispatch({
                    type: GigaActionType.LOADING_MORE_DATA,
                    parentRow: row
                });
                // simulate more data with a time out
                var groupBy = null;
                // when the current row's SP is the same depth as subtotalBys then we must request detailed rows, otherwise request groupBy
                // as the column at the same index as the depth of subtotalBys
                const sp = row.sectorPath();
                if (sp.length < initialSubtotalBys.length)
                    groupBy = initialSubtotalBys[sp.length];

                const ajaxRequest = getAJAX(sp, columnDefs, groupBy, (resp) => {
                    dispatch.dispatch({
                        type: GigaActionType.GOT_MORE_DATA,
                        isDetail: resp.detail,
                        rows: resp.rows,
                        parentRow: row
                    });
                });
                $.ajax(ajaxRequest);
            }
        }

        const {initialData} = this.state;
        if (initialData.length == 0) {
            return <i className="fa fa-spinner fa-spin"/>;
        } else
            return (
                <GigaGrid initialData={initialData}
                          columnDefs={Examples.columnDefs()}
                          initialSubtotalBys={Examples.initialSubtotalBys()}
                          useServerStore={true}
                          fetchRowsActionCreator={fetchRowsActionCreator}/>);

    }

}

function main() {
    // App Entry point
    ReactDOM.render(<Examples />, document.getElementById("app"));
}

main();
