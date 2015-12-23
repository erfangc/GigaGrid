import ReactElement = __React.ReactElement;
/**
 * strongly typed arguments given to the grid
 */
class GigaGridProps {

    public initialSubtotalBys:SubtotalBy[];

    constructor(public data:any[], public columnDefs:ColumnDef[]) {
    }

}
/**
 * The root component of this React library. assembles raw data into `Row` objects which are then translated into
 * their shadow DOM representations
 */
class GigaGrid extends React.Component<GigaGridProps, any> {

    constructor(props:GigaGridProps) {
        super(props);
        // set initial state (from this point on use this.setState();
        const tree:Tree = TreeBuilder.buildTree(this.props.data, this.props.initialSubtotalBys);
        this.state = {tree: tree};
    }

    render() {
        // TODO first pass implementation ... need to make better
        return (
            <div>
                <table>
                    {this.renderColumnHeaders()}
                    <tbody>
                        {this.renderTableRows()}
                    </tbody>
                </table>
                {this.renderTableFooter()}
            </div>);
    }

    renderColumnHeaders():ReactElement<{}> {
        const ths = this.props.columnDefs.map((colDef:ColumnDef, i:number)=> {
            return <th key={i}>{colDef.title || colDef.colTag}</th>
        });
        return (
            <thead>
                <tr>{ths}</tr>
            </thead>
        );
    }

    renderTableRows():ReactElement<{}>[] {
        const rows:Row[] = TreeRasterizer.rasterize(this.state.tree);
        // convert plain ColumnDef to TableRowColumnDef which has additional properties
        const tableRowColumnDefs:TableRowColumnDef[] = this.props.columnDefs.map((colDef) => {
            return new TableRowColumnDef(colDef);
        });
        return rows.map((row:Row, i:number)=> {
            // syntax highlighter will think Row cannot be coerced into its implementing classes
            // we would need to explicitly down cast ... BUT this is JSX, the TypeScript down cast operator looks
            // like an XML opening tag ... so we can't do that and have to live with the syntax highlight error LOL
            if (row.isDetail())
                return <DetailTableRow key={i} tableRowColumnDefs={tableRowColumnDefs} row={row}/>;
            else
                return <SubtotalTableRow key={i} tableRowColumnDefs={tableRowColumnDefs} row={row}/>
        });
    }

    renderTableFooter() {
        // TODO dummy implemenation
        return <div>This is a footer</div>
    }
}
