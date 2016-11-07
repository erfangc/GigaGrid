import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from 'lodash';
import {GigaGrid} from "../src/index";
import UKBudget from "./data/UKBudget";
import {GigaProps, GigaState} from "../src/components/GigaGrid";
import {Row} from "../src/models/Row";
import {SortDirection, ColumnDef} from "../src/models/ColumnLike";
import "../styles/theme/Retro.styl";

interface ExamplesProps extends React.Props<Examples> {
    ukBudget: GigaProps
}

export class Examples extends React.Component<ExamplesProps, {}> {

    constructor(props: ExamplesProps) {
        super(props);
    }

    render() {
        var additionalUserButtons = [{name: 'Export Grid'}];
        return (
            <div>
                <div className="container">
                    {this.renderBasicExample(additionalUserButtons)}
                </div>
            </div>
        );
    }

    private renderBasicExample(additionalUserButtons) {
        var additionalUserButtons = additionalUserButtons.map(this.callCustomFunction.bind(this));
        // Comment below line in if you want to test locale functionality
        // this.enhanceColumnsWithLocale(UKBudget.columnDefs);
        return (<GigaGrid
            onRowClick={(row:Row, state:GigaState)=>{
               console.log(row);
               console.log(state);
                return true;
            }}
            additionalUserButtons={additionalUserButtons}
            initialSortBys={[
                {colTag:"Age", direction: SortDirection.ASC},
                {colTag:"Children", direction: SortDirection.ASC},
                {colTag:"Income", direction: SortDirection.ASC}
            ]}
            staticLeftHeaders={1}
            {...UKBudget}
        />);
    }

    private callCustomFunction(additionalUserButton) {
        additionalUserButton.customCallback = () => {
            this.customCallback()
        };
        return additionalUserButton;
    }

    private customCallback() {
        console.log('Export grid');
    }

    private enhanceColumnsWithLocale(columnDefs: ColumnDef[]) {
        _.each(columnDefs, (columnDef:ColumnDef) => {
            if( columnDef.formatInstruction )
                columnDef.formatInstruction.locale = "bn";
        })
    }
}

function main() {
    // App Entry point
    ReactDOM.render(<Examples ukBudget={UKBudget}/>, document.getElementById("app"));
}

main();
