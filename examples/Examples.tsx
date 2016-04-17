import * as React from "react";
import * as ReactDOM from "react-dom";
import {GigaGrid} from "../src/index";
import UKBudget from "./data/UKBudget";
import {GigaProps, GigaState} from "../src/components/GigaGrid";
import {Tabs, Tab, Navbar} from "react-bootstrap";
import {Row} from "../src/models/Row";
import {SortDirection} from "../src/models/ColumnLike";
import "../src/styles/theme/Default.styl";

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
                {Examples.renderNavbar()}
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
        return (<GigaGrid
            onRowClick={(row:Row, state:GigaState)=>true}
            initialSortBys={[{"colTag":"WOther", direction: SortDirection.DESC}]}
            {...this.props.ukBudget}
        />);
    }

    private static renderNavbar() {
        return (
            <Navbar inverse>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">GigaGrid Examples</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
            </Navbar>
        );
    }
}

function main() {
    // App Entry point
    ReactDOM.render(<Examples ukBudget={UKBudget}/>, document.getElementById("app"));
}

main();
