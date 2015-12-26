import {DropdownMenu} from "../../../src/components/dropdown/DropdownMenu";
import {SimpleDropdownMenuItem} from "../../../src/components/dropdown/DropdownMenu";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-addons-test-utils';
import * as $ from 'jquery';

describe("DropdownMenu", ()=> {

    describe("basic DropdownMenu", ()=> {

        var componentRef:DropdownMenu;
        var component;
        var $componentNode;

        beforeEach(()=> {
            component = ReactTestUtils.renderIntoDocument(
                <DropdownMenu ref={(c:DropdownMenu)=>componentRef=c}>
                    <SimpleDropdownMenuItem text="Item 1"/>
                    <SimpleDropdownMenuItem text="Item 2"/>
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
        var subMenuRef:DropdownMenu;

        beforeEach(()=> {
            component = ReactTestUtils.renderIntoDocument(
                <DropdownMenu>
                    <SimpleDropdownMenuItem text="Item 1" onClick={e=>clicked=true}>
                        <SimpleDropdownMenuItem text="Item 1.1"/>
                        <SimpleDropdownMenuItem text="Item 1.2"/>
                    </SimpleDropdownMenuItem>
                    <SimpleDropdownMenuItem text="Item 2"/>
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
            const lis = ReactTestUtils.scryRenderedDOMComponentsWithTag(dropdownMenuRefs[0], 'li');
            expect(lis.length).toBe(4);
            ReactTestUtils.Simulate.click(lis[0]);
            expect(subMenuRef.state.visible).toBeTruthy();
        });

    });

    describe("DropdownMenu with a custom menu item", () => {
        class InfoPane extends React.Component<any, any> {
            constructor(props:any) {
                super(props)
            }

            render() {
                return (<div className="dropdown-menu-item">This is a DIV</div>)
            }
        }
        const component = ReactTestUtils.renderIntoDocument(
            <DropdownMenu>
                <InfoPane/>
            </DropdownMenu>
        );
        const div = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'div');
        it("should contain the custom DIV", ()=> {
            expect(div.textContent).toEqual("This is a DIV");
        });
    });

});