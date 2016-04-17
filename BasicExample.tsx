///<reference path="./node_modules/giga-grid/typings/tsd.d.ts"/>

import * as React from "react";
import {GigaGrid, SortDirection} from "giga-grid/src/index";
import gigaProps from "./data/UKBudget";

export class BasicExample extends React.Component<any,{}> {

    constructor(props:any) {
        super(props);
    }

    render() {
        const {data, columnDefs, initialSubtotalBys} = gigaProps;
        const code = (
            <div>
                <strong>Code Sample</strong>
        <pre><code className="html">
            {`
<GigaGrid
    initialSortBys={[{"colTag":"WOther", direction: SortDirection.DESC}]}
    data={data}
    columnDefs={columnDefs}
    initialSubtotalBys={initialSubtotalBys} />`
                }
        </code></pre>
            </div>
        );

        return (
            <div>
                <br/>
                <GigaGrid
                    initialSortBys={[{"colTag":"WOther", direction: SortDirection.DESC}]}
                    data={data}
                    columnDefs={columnDefs}
                    initialSubtotalBys={initialSubtotalBys}/>
                {code}
            </div>);
    }

}