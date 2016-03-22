import * as React from "react";
import * as ReactDOM from "react-dom";
import {GigaGrid} from "../src/index";
import UKBudget from "./data/UKBudget";
import {GigaProps} from "../src/components/GigaGrid";
import {Tabs, Tab, Navbar} from "react-bootstrap";

/**
 * Created by erfangc on 3/20/16.
 */

interface ExamplesProps extends React.Props<Examples> {
    ukBudget:GigaProps
}

interface ExampleState {
    activeTabKey: number
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
                    <Tabs activeKey={this.state.activeTabKey} onSelect={idx=>this.handleTabSelect(idx)} animation={false}>
                        <Tab eventKey={0} title="Basic Example">
                            <br/>
                            {this.renderBasicExample()}
                        </Tab>
                        <Tab eventKey={1} title="With Column Grouping">
                            <br/>
                            {this.renderExampleWithColumnGrouping()}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }

    private renderBasicExample() {
        return (<GigaGrid onRowClick={()=>alert("Clicked")} {...this.props.ukBudget}/>);
    }

    private renderExampleWithColumnGrouping() {
        return (<GigaGrid
            columnGroups={[
                {title:"Info", columns:["Age","Children"]},
                {title:"Spending Proportion", columns:["WFood","WFuel","WCloth","WAlc","WTrans","WOther"]},
                {title:"Average Income vs. Expense", columns:["TotExp","Income"]}
            ]}
            {...this.props.ukBudget}/>);
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
