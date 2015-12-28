import * as Flux from 'flux';
import Dispatcher = Flux.Dispatcher;
import {GigaGridAction} from "../../src/store/GigaGridStore";
import {GigaGridStore} from "../../src/store/GigaGridStore";
import {GigaGridProps} from "../../src/components/GigaGrid";
import {TestUtils} from "../TestUtils";
import {NewSubtotalAction} from "../../src/store/GigaGridStore";
import {GigaGridActionType} from "../../src/store/GigaGridStore";
import {ClearSubtotalAction} from "../../src/store/GigaGridStore";

describe("GigaGridStore", ()=> {

    var dispatcher:Dispatcher<GigaGridAction>;
    var store:GigaGridStore;
    var props:GigaGridProps;
    var newSubtotalAction:NewSubtotalAction = {
        type: GigaGridActionType.NEW_SUBTOTAL,
        subtotalBys: [{colTag: "gender"}]
    };

    beforeEach(()=> {
        dispatcher = new Dispatcher<GigaGridAction>();
        props = {
            data: TestUtils.getSampleData().data,
            columnDefs: TestUtils.getSampleData().columnDefs
        };
        store = new GigaGridStore(dispatcher, props);
    });

    it("can deduce the correct initial state", ()=> {
        const initialState = store.getInitialState();
        expect(initialState).toBeTruthy();
        expect(initialState.subtotalBys).toBeFalsy();
        const state = store.getState();
        expect(state).toEqual(initialState);
        expect(state.tree.getRoot().getChildren().length).toBe(0);
        expect(state.tree.getRoot().detailRows.length).toBe(10);
    });

    it("can handle NEW_SUBTOTAL action", ()=> {
        dispatcher.dispatch(newSubtotalAction);
        expect(store.getState().subtotalBys.length).toBe(1);
        expect(store.getState().subtotalBys[0]).toBe(newSubtotalAction.subtotalBys[0]);
        const children = store.getState().tree.getRoot().getChildren();
        expect(children.length).toBe(2);
        expect(store.getState().tree.getRoot().getChildByTitle("Male")).toBeDefined();
        expect(store.getState().tree.getRoot().getChildByTitle("Male")).not.toBeNull();
    });

    it("can handle CLEAR_SUBTOTAL action", ()=> {
        dispatcher.dispatch(newSubtotalAction);
        expect(store.getState().subtotalBys[0]).toBe(newSubtotalAction.subtotalBys[0]);

        // clear subtotal
        dispatcher.dispatch({type: GigaGridActionType.CLEAR_SUBTOTAL});
        expect(store.getState().subtotalBys).toEqual([]);
        expect(store.getState().tree.getRoot().getChildren.length).toBe(0);
    });

    // TODO write more tests
});