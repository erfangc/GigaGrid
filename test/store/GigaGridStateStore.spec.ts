import * as Flux from 'flux';
import Dispatcher = Flux.Dispatcher;
import {GigaGridAction} from "../../src/store/GigaGridStateStore";
import {GigaGridStateStore} from "../../src/store/GigaGridStateStore";
import {GigaGridProps} from "../../src/components/GigaGrid";
import {TestUtils} from "../TestUtils";
import {SubtotalAction} from "../../src/store/GigaGridStateStore";

describe("GigaGridStateStore", ()=> {

    var dispatcher:Dispatcher<GigaGridAction>;
    var store:GigaGridStateStore;
    var props:GigaGridProps;
    var subtotalAction:SubtotalAction = {
        type: "subtotal",
        subtotalBys: [{colTag: "gender"}]
    };

    beforeEach(()=> {
        dispatcher = new Dispatcher<GigaGridAction>();
        props = {
            data: TestUtils.getSampleData().data,
            columnDefs: TestUtils.getSampleData().columnDefs
        };
        store = new GigaGridStateStore(dispatcher, props);
    });

    it("deduces the correct initial state", ()=> {
        const initialState = store.getInitialState();
        expect(initialState).toBeTruthy();
        expect(initialState.subtotalBys).toBeFalsy();
        const state = store.getState();
        expect(state).toEqual(initialState);
        expect(state.tree.getRoot().getChildren().length).toBe(0);
        expect(state.tree.getRoot().detailRows.length).toBe(10);
    });

    it("can handle subtotal action", ()=> {
        dispatcher.dispatch(subtotalAction);
        expect(store.getState().subtotalBys.length).toBe(1);
        expect(store.getState().subtotalBys[0]).toBe(subtotalAction.subtotalBys[0]);
        const children = store.getState().tree.getRoot().getChildren();
        expect(children.length).toBe(2);
        expect(store.getState().tree.getRoot().getChildByTitle("Male")).toBeDefined();
        expect(store.getState().tree.getRoot().getChildByTitle("Male")).not.toBeNull();
    });

    // TODO write more tests
});