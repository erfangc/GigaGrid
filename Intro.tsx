///<reference path="./node_modules/giga-grid/typings/tsd.d.ts"/>

import * as React from "react";
import {ListGroup, ListGroupItem} from "react-bootstrap";

export class Intro extends React.Component<any,{}> {
    
    render() {
        return (
            <div>

                <h2>Getting Started</h2>

                <p>
                    You simply use <code>GigaGrid</code> like any other React component. After <code>npm install</code>
                </p>
                <pre>
                    <code className="typescript">
                        {`import {GigaGrid} from "giga-grid";
// import the stylesheet, we use stylus - but if you like something else, let us know!
import "giga-grid/styles/theme/Default.styl";

const data = [ {col1: '...', col: 2: '...' }, ... ];
const columnDefs = [ {colTag: 'col1', title: 'Column 1'}, ... ];
const myGrid = React.createElement(GigaGrid, {data: data, columnDefs: columnDefs});
ReactDOM.render(myGrid, document.body);`}
                    </code>
                </pre>

                <h3>Key Concepts</h3>
                <p>
                    Advanced users should familiarize with the following concepts / classes when interacting with the grid
                </p>
                <ListGroup>
                    <ListGroupItem>
                        <pre>Row|SubtotalRow|DetailRow</pre>
                        <p>
                            Represents a single row in the table, you do not have to create these. They are created from the <code>data</code> prop you pass to the grid.
                            The only time you must deal <code>Row</code> objects is during callbacks that you provide in response to user events.
                        </p>
                        <p>
                            You can find out if a <code>Row</code> given to you is a <code>DetailRow</code> or a <code>SubtotalRow</code> via the <code>isDetail()</code> method.
                        </p>
                    </ListGroupItem>
                    <ListGroupItem>
                        <pre>
                            ColumnDef|Column
                        </pre>
                        <p>
                            Defines a column in the grid. You must provide <code>ColumnDef</code> objects that describe column properties such as <code>format</code>, <code>title</code> etc.
                            <code>Column</code> are different from <code>ColumnDefs</code> in that you do not create <code>Column</code> objects, they are simply enriched <code>ColumnDef</code> objects. The only time you deal with them
                            is in callbacks.
                        </p>
                    </ListGroupItem>
                    <ListGroupItem>
                        <strong>Documentation To be Completed</strong>
                    </ListGroupItem>
                </ListGroup>

                <br/>

                <h2>GigaGrid Props</h2>
                <ListGroup>
                    <ListGroupItem>
                        <pre><code className="typescript">data : any[]</code></pre>
                        This prop is used to pass the raw data that the grid will render
                    </ListGroupItem>
                    <ListGroupItem>
                        <pre><code className="typescript">columnDefs : ColumnDef[]</code></pre>
                        The column definitions that describe columns of the <code>data</code> prop.
                    </ListGroupItem>
                    <ListGroupItem>
                        <pre><code className="typescript">initialSubtotalBys : Column[]</code></pre>
                        The columns listed here will be used to create the initial subtotals in the grid
                    </ListGroupItem>
                    <ListGroupItem>
                        <pre><code className="typescript">initialSortBys : Column[]</code></pre>
                        The columns listed here will be used to initially sort the grid
                    </ListGroupItem>
                    <ListGroupItem>
                        <pre><code className="typescript">onRowClick:(row:Row, state:GigaState)=>boolean</code></pre>
                        Callback that fires when a row is clicked, return <code>false</code> in the passed callback function to suppress default behavior (highlights the row)
                    </ListGroupItem>
                    <ListGroupItem>
                        <pre><code className="typescript">enableMultiRowSelect:boolean</code></pre>
                        Enable selecting multiple rows
                    </ListGroupItem>
                    <ListGroupItem>
                        <pre><code className="typescript">onCellClick:(row:Row, columnDef:Column)=>boolean</code></pre>
                        Callback that fires when a cell is clicked, return <code>false</code> in the passed callback function to suppress default behavior
                    </ListGroupItem>
                </ListGroup>
            </div>
        );
    }
}
