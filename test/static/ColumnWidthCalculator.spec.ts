import { Column, ColumnDef } from "../../src/index";
import { GigaProps } from "../../src/components/GigaProps";
import { ColumnWidthCalculator } from "../../src/static/ColumnWidthCalculator";

describe('ColumnWidthCalculator', () => {

    it('should compute the width of right container based the width of the viewport and the other columns', () => {
        let props: Partial<GigaProps> = {
            staticLeftHeaders: 1
        };
        let columns: Column[] = [
            { colTag: "1", width: 200 },
            { colTag: "2", width: 100 },
            { colTag: "3", width: 100 }
        ];
        let maxWidth = ColumnWidthCalculator.calculateRightPanelMaxWidth(columns, '400px', props);
        expect(maxWidth).toEqual('200px');
    });

    it('should compute the width of right container to be the full viewport maxWidth if there are no left containers', () => {
        let props: Partial<GigaProps> = {
        };
        let columns: Column[] = [
            { colTag: "1", width: 200 },
            { colTag: "2", width: 100 },
            { colTag: "3", width: 100 }
        ];
        let maxWidth = ColumnWidthCalculator.calculateRightPanelMaxWidth(columns, '400px', props);
        expect(maxWidth).toEqual('400px');
    });

    it('should compute the width of individual columns if none of them have width specified', () => {
        let columns: Column[] = [
            { colTag: "1" },
            { colTag: "2" },
            { colTag: "3" }
        ];
        let newGridWidth = '300px';
        // making columnDefs == columns
        ColumnWidthCalculator.enrichColumnsWithWidth(columns, columns, newGridWidth);
        expect(columns).toEqual([
            { colTag: "1", width: 100 },
            { colTag: "2", width: 100 },
            { colTag: "3", width: 100 }
        ]);
    });

    it('should compute the width of individual columns even if some column has their width specified, these should be respected', () => {
        let columnsDefs: ColumnDef[] = [
            { colTag: "1", width: 100 },
            { colTag: "2" },
            { colTag: "3" }
        ];
        let columns: Column[] = [
            { colTag: "1" },
            { colTag: "2" },
            { colTag: "3" }
        ];
        let newGridWidth = '200px';
        ColumnWidthCalculator.enrichColumnsWithWidth(columns, columnsDefs, newGridWidth);
        expect(columns).toEqual([
            { colTag: "1", width: 100 },
            { colTag: "2", width: 50 },
            { colTag: "3", width: 50 }
        ]);
    });

    it('should compute the width of individual columns, giving the last column the width any remainder if the width of viewport cannot be divided evenly', () => {
        let columnDefs: ColumnDef[] = [
            { colTag: "1", width: 100 },
            { colTag: "2" },
            { colTag: "3" }
        ];
        let columns: ColumnDef[] = [
            { colTag: "1" },
            { colTag: "2" },
            { colTag: "3" }
        ];
        let newGridWidth = '203px';
        ColumnWidthCalculator.enrichColumnsWithWidth(columns, columnDefs, newGridWidth);
        expect(columns).toEqual([
            { colTag: "1", width: 100 },
            { colTag: "2", width: 51.5 },
            { colTag: "3", width: 51.5 }
        ]);
    });

});