import { gridResizeReducer } from '../../../src/store/handlers/GridResizeReducer';
import { GigaActionType, ColumnDef, Column } from '../../../src/index';

describe('GridResizeReducer', () => {
    it('should take an input state, an action with a new screen size and return a new state with updated colum widths and scrollable div max-width', () => {
        let columns: Column[] = [
            { colTag: '1', width: 100 },
            { colTag: '2', width: 200 },
            { colTag: '3', width: 500 },
            { colTag: '4', width: 100 }
        ];
        let state: any = {
            columns,
            rightBody: {
                style: {
                    maxWidth: '800px'
                }
            },
            rightHeader: {
                style: {
                    maxWidth: '800px'
                }
            }
        };
        let columnDefs: ColumnDef[] = [
            { colTag: '1', width: 100 },
            { colTag: '2' },
            { colTag: '3' },
            { colTag: '4' }
        ];
        let props: any = {
            columnDefs,
            staticLeftHeaders: 1
        };
        let newState = gridResizeReducer(state, { newGridWidth: '400px', type: GigaActionType.VIEWPORT_RESIZE }, props);
        expect(newState.columns).toEqual([
            { colTag: '1', width: 100 },
            { colTag: '2', width: 100 },
            { colTag: '3', width: 100 },
            { colTag: '4', width: 100 }
        ]);
        expect(newState.rightBody.style.maxWidth).toEqual('300px');
    });
});