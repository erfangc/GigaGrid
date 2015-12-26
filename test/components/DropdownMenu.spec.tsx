import {DropdownMenu} from "../../src/components/DropdownMenu";
import {DropdownMenuItem} from "../../src/components/DropdownMenu";
import React = require('react');
import ReactDOM = require('react-dom');
import ReactTestUtils = require('react-addons-test-utils');
import * as $ from 'jquery';

describe("DropdownMenu", ()=> {

    describe("basic DropdownMenu", ()=> {

        var componentRef:DropdownMenu;
        var component;
        var $componentNode;

        beforeEach(()=> {
            component = ReactTestUtils.renderIntoDocument(
                <DropdownMenu ref={(c:DropdownMenu)=>componentRef=c}>
                    <DropdownMenuItem text="Item 1"/>
                    <DropdownMenuItem text="Item 2"/>
                </DropdownMenu>);
            $componentNode = $(ReactDOM.findDOMNode(component))
        });

        it("has 2 items", ()=> {
            expect($componentNode.children().length).toBe(2);
        });

        it("is not visible by default", () => {
            expect($componentNode.css("display")).toBe("none");
        });

        it("becomes visible after toggle", () => {
            componentRef.toggleDisplay();
            expect($componentNode.css("display")).toBe("block");
        });

    });

    describe("DropdownMenu with a submenu", ()=> {

        var clicked = false;
        var component;
        var dropdownMenuRefs:DropdownMenu[];
        var subMenuRef: DropdownMenu;

        beforeEach(()=> {
            component = ReactTestUtils.renderIntoDocument(
                <DropdownMenu>
                    <DropdownMenuItem text="Item 1" onClick={e=>clicked=true}>
                        <DropdownMenuItem text="Item 1.1"/>
                        <DropdownMenuItem text="Item 1.2"/>
                    </DropdownMenuItem>
                    <DropdownMenuItem text="Item 2"/>
                </DropdownMenu>
            );
            dropdownMenuRefs = ReactTestUtils.scryRenderedComponentsWithType<DropdownMenu>(component, DropdownMenu);
            subMenuRef = dropdownMenuRefs[1];
        });

        it("there should be two dropdown menus (the main menu and the submenu)", ()=> {
            expect(dropdownMenuRefs.length).toBe(2);
        });

        it("the submenu is not visible by default, but becomes visible after a click", () => {
            expect(subMenuRef.state.visible).toBeFalsy();
            const lis = ReactTestUtils.scryRenderedDOMComponentsWithTag(dropdownMenuRefs[0],'li');
            expect(lis.length).toBe(4);
            ReactTestUtils.Simulate.click(lis[0]);
            expect(subMenuRef.state.visible).toBeTruthy();
        });

    });

});