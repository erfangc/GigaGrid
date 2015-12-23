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
        SubtotalAggregator.aggregateTree(tree, this.props.columnDefs);
        this.state = {tree: tree};
    }

    render() {
        // TODO first pass implementation ... need to make better
        return (
            <div className="giga-grid">
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
            return <th className={colDef.format === ColumnFormat.NUMBER ? "numeric" : "non-numeric"}
                       key={i}>{colDef.title || colDef.colTag}</th>
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
        // TODO dummy implemenation, replace with pagination
        return (<div>This is Where the Footer is Supposed to Go!</div>);
    }
}

////////////////////////////////////////////////////////////////////////////////
// In your runtime library somewhere
// from TypeScript's official site, we need this to apply Mixins, weird .. I Know!
////////////////////////////////////////////////////////////////////////////////

function applyMixins(derivedCtor:any, baseCtors:any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        })
    });
}