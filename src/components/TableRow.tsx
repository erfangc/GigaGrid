class TableRowProps {
    constructor(public row:Row, public tableRowColumnDefs:TableRowColumnDef[]) {
    }
}

class TableRow extends React.Component<TableRowProps, {}> {

    constructor(props:TableRowProps) {
        super(props);
    }

    render() {
        // TODO refactor this shit brah
        const tds = this.props.tableRowColumnDefs.map((colDef:TableRowColumnDef, i:number) => {
            if (i === 0 && !this.props.row.isDetail()) {
                const identLevel = (this.props.row.sectorPath() || []).length;
                const padding = (10 + identLevel * 25) + 'px';
                return <td key={i} style={{width: colDef.width, paddingLeft: padding}}
                           className="giga-grid-locked-col">
                    <strong>{this.props.row.title}</strong>
                </td>;
            }
            else
                return <td key={i} style={{width: colDef.width}}>{this.props.row.data()[colDef.colTag] || ""}</td>;
        });
        return (<tr>{tds}</tr>);
    }
}
