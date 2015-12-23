import SyntheticEvent = __React.SyntheticEvent;

class SubtotalTableRowProps {
    constructor(public row:SubtotalRow, public tableRowColumnDefs:TableRowColumnDef[]) {
    }
}

class SubtotalTableRow extends React.Component<SubtotalTableRowProps, {}> {

    constructor(props:SubtotalTableRowProps) {
        super(props);
    }

    // TODO this will certainly not trigger the parent to be re-rendered
    // we have two options, use a custom event system (Emit) or use a callback attached to props and the event will be propogated up to the parent
    onCollapseToggle(e:SyntheticEvent) {
        this.props.row.toggleCollapse();
    }

    render() {
        const tds = this.props.tableRowColumnDefs.map((colDef:TableRowColumnDef, i:number) => {
            const identLevel = (this.props.row.sectorPath() || []).length;
            const padding = (10 + identLevel * 25) + 'px';
            if (i === 0)
                return (
                    <td key={i}
                        onClick={e => this.onCollapseToggle(e)}
                        style={{width: colDef.width, paddingLeft: padding}}
                        className="giga-grid-locked-col">
                        <strong>
                            <span>
                                <i className="fa fa-plus"/>
                            </span>
                            {this.props.row.title}
                        </strong>
                    </td>);
            else
                return <td key={i} style={{width: colDef.width}}>{this.props.row.data()[colDef.colTag] || ""}</td>;
        });
        return <tr>{tds}</tr>
    }
}

class DetailTableRowProps {
    constructor(public row:DetailRow, public tableRowColumnDefs:TableRowColumnDef[]) {
    }
}

class DetailTableRow extends React.Component<DetailTableRowProps, {}> {

    constructor(props:DetailTableRowProps) {
        super(props);
    }

    render() {
        const tds = this.props.tableRowColumnDefs.map((colDef:TableRowColumnDef, i:number) => {
            return <td key={i} style={{width: colDef.width}}>{this.props.row.data()[colDef.colTag] || ""}</td>;
        });
        return <tr>{tds}</tr>
    }

}