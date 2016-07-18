import * as React from "react";
import * as ReactDOM from "react-dom";
import {GigaGrid} from "../index";
import UKBudget from "./data/UKBudget";
import {GigaProps, GigaState} from "../src/components/GigaGrid";
import {Tabs, Tab} from "react-bootstrap";
import {Row} from "../src/models/Row";
import {SortDirection} from "../src/models/ColumnLike";
import "../styles/theme/Default.styl";

interface ExamplesProps extends React.Props<Examples> {
    ukBudget:GigaProps
}

interface ExampleState {
    activeTabKey:number
}

export class Examples extends React.Component<ExamplesProps, ExampleState> {

    constructor(props:ExamplesProps) {
        super(props);
        this.state = {
            activeTabKey: 0
        }
    }

    private handleTabSelect(idx) {
        // trigger resize on click so the table headers adjust
        this.setState({
            activeTabKey: idx
        });
    }

    render() {
        return (
            <div>
                <div className="container">
                    <br/>
                    <Tabs activeKey={this.state.activeTabKey} onSelect={idx=>this.handleTabSelect(idx)}
                          animation={false}>
                        <Tab eventKey={0} title="Basic Example">
                            <br/>
                            {this.renderBasicExample()}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }

    private renderBasicExample() {
        console.log(UKBudget);
        return (<GigaGrid
            onRowClick={(row:Row, state:GigaState)=>{
                row; state;
                return true;
            }}
            initialSortBys={[
                {colTag:"Age", direction: SortDirection.ASC, customSortFn: function(a,b){ return a - b },},
                {colTag:"Children", direction: SortDirection.ASC, customSortFn: function(a,b){ return b - a }},
                {colTag:"Income", direction: SortDirection.ASC, customSortFn: function(a,b){ return b - a }}
            ]}
            staticLeftHeaders={1}
            {...UKBudget}
        />);
    }

}

function main() {
    // App Entry point
    ReactDOM.render(<Examples ukBudget={UKBudget}/>, document.getElementById("app"));
}

main();
