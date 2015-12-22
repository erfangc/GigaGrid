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
        const tds = this.props.tableRowColumnDefs.map((colDef: TableRowColumnDef, i)=> {
            return <td key={i} style={{width: colDef.width}}>{this.props.row.data()[colDef.colTag]}</td>
        });
        return (<tr>{tds}</tr>);
    }
}
