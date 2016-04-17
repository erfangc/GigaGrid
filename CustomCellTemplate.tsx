///<reference path="./node_modules/giga-grid/typings/tsd.d.ts"/>
///<reference path="./typings/tsd.d.ts"/>

import * as React from "react";
import {GigaGrid, ColumnDef} from "giga-grid/src/index";
import {SortDirection} from "giga-grid/src/index";
import gigaProps from "./data/UKBudget";
import * as _ from "lodash";
import * as chroma from "chroma-js";

export class CustomCellTemplate extends React.Component<any,{}> {

    constructor(props:any) {
        super(props);
    }

    private appendCellTemplateCreator(columnDefs:ColumnDef[]):ColumnDef[] {
        const scale = chroma.scale(['green', 'red']).colors(10);
        return columnDefs.map((columnDef:ColumnDef) => {
            const cellTemplateCreator = (row, column):JSX.Element => {
                const style = {
                    backgroundColor: scale[Math.floor(Math.random() * (scale.length ))],
                    color: 'white'
                };
                return (<td className="numeric" style={style}>{row.get(column)}</td>);
            };
            return _.assign<{},{},{},ColumnDef>({}, columnDef, {cellTemplateCreator: cellTemplateCreator});
        });
    }

    render() {
        const {data, columnDefs} = gigaProps;
        const code = (
            <div>
                <strong>Code Sample</strong>
                <pre>
                <code className="typescript">
            {`
const cellTemplateCreator = (row, column):JSX.Element => {
                const style = {
                    backgroundColor: scale[Math.floor(Math.random() * (scale.length ))],
                    color: 'white'
                };
                return (<td className="numeric" style={style}>{row.get(column)}</td>);
            };
...
// then add the cellTemplateCreator as a property of the ColumnDef(s) you want it to apply to
<GigaGrid
    initialSortBys={[{"colTag":"WOther", direction: SortDirection.DESC}]}
    data={data}
    columnDefs={columnDefs}
    />`
                }
                </code>
            </pre>
        </div>
        );

        return (
            <div>
                <br/>
                <GigaGrid
                    initialSortBys={[{"colTag":"WOther", direction: SortDirection.DESC}]}
                    data={data}
                    columnDefs={this.appendCellTemplateCreator(columnDefs)}
                />
                {code}
            </div>);
    }

}