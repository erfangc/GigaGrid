import ReactElement = __React.ReactElement;
/**
 * strongly typed arguments given to the grid
 */
class GigaGridProps {

    public subtotalBys:SubtotalBy[];

    constructor(public data:any[], public columnDefs:ColumnDef[]) {
    }

}
/**
 * The root component of this React library. assembles raw data into `Row` objects which are then translated into
 * their shadow DOM representations
 */
class GigaGrid extends React.Component<GigaGridProps, any> {
    render() {
        // TODO first pass implementation ... need to make better
        const columnHeaders:ReactElement<{}>[] = renderColumnHeaders();
        const tableRows:ReactElement<{}>[] = renderTableRows();
        const tableFooter:ReactElement<{}>[] = renderTableFooter();

        return (
            <div>
                <table>
                    <thead>
                        {columnHeaders}
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
                {tableFooter}
            </div>);
    }
}
