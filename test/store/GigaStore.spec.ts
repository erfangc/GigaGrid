import {
    GigaAction,
    GigaStore,
    GigaActionType,
    NewSortAction,
    AddSortAction,
    ClearSortAction
} from "../../src/store/GigaStore";
import {GigaProps} from "../../src/components/GigaGrid";
import {TestUtils} from "../TestUtils";
import {ColumnFormat, SortDirection} from "../../src/models/ColumnLike";
import {Dispatcher} from "flux";

describe("GigaStore", ()=> {

    var dispatcher:Dispatcher<GigaAction>;
    var store:GigaStore;
    var props:GigaProps;

    beforeEach(()=> {
        dispatcher = new Dispatcher<GigaAction>();
        const people = TestUtils.newPeopleTestData();
        props = {
            data: people.rawData(),
            columnDefs: people.columnDefs()
        };
        store = new GigaStore(dispatcher, props);
    });

    it("can deduce the correct initial state", ()=> {
        const initialState = store.initialize({type: GigaActionType.INITIALIZE}); // not getInitialState()
        expect(initialState.subtotalBys).toEqual([]);
        const state = store.getState();
        // expect(state).toEqual(initialState); // TODO this is failing due to deep comparison I believe
        expect(state.tree.getRoot().getChildren().length).toBe(0);
        expect(state.tree.getRoot().detailRows.length).toBe(10);
    });

    // TODO test COLUMN_UPDATE action

    describe("can handle Sort Actions", ()=> {

        const sortByGender = {
            colTag: "gender",
            direction: SortDirection.ASC,
            format: ColumnFormat.STRING
        };

        const sortByGift = {
            colTag: "gift",
            direction: SortDirection.DESC,
            format: ColumnFormat.NUMBER
        };

        it("can handle NEW_SORT action", ()=> {

            const action:NewSortAction = {
                type: GigaActionType.NEW_SORT,
                sortBys: [sortByGift]
            };

            var root = store.getState().tree.getRoot();
            dispatcher.dispatch(action);
            expect(store.getState().rasterizedRows[0].getByColTag('gift')).toBe(10);
            expect(root.detailRows[0].getByColTag('gift')).toBe(10);
            expect(root.detailRows[root.detailRows.length - 1].getByColTag('gift')).toBe(2);
            expect(store.getState().sortBys.length).toBe(1);

        });

        it("can handle CLEAR_SORT action", ()=> {
            // start with a gender sort
            const firstSort:NewSortAction = {
                type: GigaActionType.NEW_SORT,
                sortBys: [sortByGender]
            };

            dispatcher.dispatch(firstSort);

            // simulate clear sort
            const action:ClearSortAction = {
                type: GigaActionType.CLEAR_SORT
            };

            dispatcher.dispatch(action);
            expect(store.getState().sortBys.length).toBe(0);

        });

    });

    // TODO write more tests
});