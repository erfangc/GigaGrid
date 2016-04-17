///<reference path="./node_modules/giga-grid/typings/tsd.d.ts"/>

import * as React from "react";
import * as ReactDOM from "react-dom";
import "giga-grid/styles/theme/Default.styl";
import {Tabs, Tab, Navbar} from "react-bootstrap";
import {BasicExample} from "./BasicExample";
import {Intro} from "./Intro";
import {CustomCellTemplate} from "./CustomCellTemplate";

interface ExampleState {
    activeTabKey:number
}

export class Examples extends React.Component<{}, ExampleState> {

    constructor(props:{}) {
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
                    <h1>
                        Welcome to the GigaGrid Demo Page
                    </h1>
                    
                    <p>
                        <strong>GigaGrid</strong> and this Documentation is still <strong>Under Development</strong>! Contributions are welcome. Below are some simple examples of what it can do.
                        However, you can checkout the preview versions by simply using:
                    </p>
                    
                    <pre>
                        <code className="bash">npm install giga-grid</code>
                    </pre>
                    <br/>
                    <Tabs activeKey={this.state.activeTabKey} onSelect={idx=>this.handleTabSelect(idx)} animation={false}>
                        <Tab eventKey={0} title="Intro">
                            <Intro/>
                        </Tab>
                        <Tab eventKey={1} title="Basic Example">
                            <BasicExample/>
                        </Tab>
                        <Tab eventKey={2} title="Custom Cell Template">
                            <CustomCellTemplate/>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }

}

(function main() {
    // App Entry point
    ReactDOM.render(<Examples />, document.getElementById("app"));
})();

