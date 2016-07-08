import * as React from "react";
import {Row} from "../../models/Row";
import {FrozenGigaRow} from "../GigaRow/FrozenGigaRow";
import {TableBody} from "./TableBody";

export class FrozenTableBody extends TableBody {
    mapRowsInBody(rowHeight:number, row:Row, i:number){
        return (<FrozenGigaRow key={i}
                               columns={this.props.columns}
                               row={row}
                               rowHeight={`${rowHeight}`}
                               dispatcher={this.props.dispatcher}
                               staticLeftHeaders={true}
                               gridProps={this.props.gridProps}/>);
    }
}