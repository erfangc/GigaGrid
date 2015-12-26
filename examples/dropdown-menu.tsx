import React = require('react');
import ReactDOM = require('react-dom');
import {DropdownMenu,SimpleDropdownMenuItem} from "./../src/components/DropdownMenu";
import * as $ from 'jquery';
import SyntheticEvent = __React.SyntheticEvent;

class CustomDropdownMenuItemWithForm extends React.Component<{},{}> {

    constructor(props:any) {
        super(props)
    }

    private handleClick(e:SyntheticEvent) {
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        return (
            <div className="dropdown-menu-item" onClick={(e: SyntheticEvent)=>this.handleClick(e)}>
                <div className="dropdown-menu-input-group">
                    <input type="text" placeholder="Enter Your Preference"/>
                    Go <span className="input-addon"><i className="fa fa-play"/></span>
                </div>
            </div>
        );
    }
}

var topLevelMenu:DropdownMenu;
$("#showMenuHandle").on('click', ()=> {
    topLevelMenu.toggleDisplay();
});
var menu = (
    <DropdownMenu ref={(c:DropdownMenu) => topLevelMenu = c}>
        <SimpleDropdownMenuItem text="Item 1">
            <CustomDropdownMenuItemWithForm/>
        </SimpleDropdownMenuItem>
        <SimpleDropdownMenuItem text="Item 2" onClick={(e:SyntheticEvent)=>alert("Item 2 clicked!")}>
            <SimpleDropdownMenuItem text="Item 2.1" onClick={(e:SyntheticEvent)=>alert("Item 2.1 clicked!")}/>
            <SimpleDropdownMenuItem text="Item 2.2" onClick={(e:SyntheticEvent)=>alert("Item 2.2 clicked!")}/>
        </SimpleDropdownMenuItem>
    </DropdownMenu>);

ReactDOM.render(menu, document.getElementById('container'));
