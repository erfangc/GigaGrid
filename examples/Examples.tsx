import * as React from "react";
import * as ReactDOM from "react-dom";
import {GigaGrid} from "../src/index";
import {ColumnDef, SubtotalBy} from "../src/models/ColumnLike";
import {ukBudget, ukBudgetColumnDefs, ukBudgetInitialSubtotalBys} from './data/UKBudget';

/**
 * Created by erfangc on 3/20/16.
 */

interface ExamplesProps extends React.Props<Examples> {
    ukBudget:any[]
    ukBudgetColumnDefs:ColumnDef[]
    ukBudgetInitialSubtotalBys: SubtotalBy[]
}

export class Examples extends React.Component<ExamplesProps,{}> {

    constructor(props:ExamplesProps) {
        super(props);
    }

    basicExample() {
        return (
            <div id="basic_example" className="card">
                <div className="card-block">
                    <h4 className="card-title">Basic Example</h4>
                    <GigaGrid data={this.props.ukBudget} columnDefs={this.props.ukBudgetColumnDefs} initialSubtotalBys={this.props.ukBudgetInitialSubtotalBys}/>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="container">
                {this.basicExample()}
            </div>
        );
    }
}

function main(args:string[]) {
    // App Entry point
    ReactDOM.render(<Examples ukBudgetColumnDefs={ukBudgetColumnDefs}
                              ukBudget={ukBudget}
                              ukBudgetInitialSubtotalBys={ukBudgetInitialSubtotalBys}
    />, document.getElementById("app"));
}

main([]);
