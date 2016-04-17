///<reference path="./node_modules/giga-grid/typings/tsd.d.ts"/>

import * as React from "react";
import {GigaGrid, ColumnDef, DefaultCellRenderer} from "giga-grid/src/index";
import {SortDirection} from "giga-grid/src/index";
import gigaProps from "./data/UKBudget";
import * as _ from "lodash";

export class CustomCellTemplate extends React.Component<any,{}> {

    constructor(props:any) {
        super(props);
    }

    private appendCellTemplateCreator(columnDefs:ColumnDef[]):ColumnDef[] {
        return columnDefs.map((columnDef:ColumnDef) => {
            const cellTemplateCreator = (row, column, props):JSX.Element => {
                return new DefaultCellRenderer(props).render();
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
                <code className="html">
            {`
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