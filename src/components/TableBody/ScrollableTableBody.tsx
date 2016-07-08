import * as React from "react";
import {TableBody} from "./TableBody";
import {Row} from "../../models/Row";
import {ScrollableGigaRow} from "../GigaRow/ScrollableGigaRow";

export class ScrollableTableBody extends TableBody {
    mapRowsInBody(rowHeight:number, row:Row, i:number){
        return (<ScrollableGigaRow key={i}
                                   columns={this.props.columns}
                                   row={row}
                                   rowHeight={`${rowHeight}`}
                                   dispatcher={this.props.dispatcher}
                                   scrollableRightData={true}
                                   gridProps={this.props.gridProps}/>);
    }
}