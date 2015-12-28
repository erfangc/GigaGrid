import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import className = require('classnames');
import SyntheticEvent = __React.SyntheticEvent;


export interface DropdownMenuProps extends React.Props<DropdownMenu> {
    /**
     * an no-arg function that returns the DOM Element that toggle the visibility of this dropdown menu
     */
    toggleHandle?:()=>Element;
    /**
     * indicate sub menu like styling should be used
     */
    isSubMenu?: boolean;
    /**
     * makes the dropdown menu visible by default
     */
    isInitiallyVisible?: boolean;
    /**
     * left align the dropdown menu (by default its style is set to left:0)
     */
    alignLeft?: boolean;
}

export interface DropdownMenuState {
    visible: boolean;
}

/**
 * a generic dropdown menu component that can be reused in any context
 */
export class DropdownMenu extends React.Component<DropdownMenuProps, DropdownMenuState> {

    private clickOutsideHandler:(event:MouseEvent) => void;

    constructor(props:DropdownMenuProps) {
        super(props);
        this.state = {visible: this.props.isInitiallyVisible || false};
    }

    toggleDisplay() {
        this.setState({
            visible: !this.state.visible
        });
    }

    show() {
        this.setState({visible: true});
    }

    hide() {
        this.setState({visible: false});
    }

    render() {
        const style = {
            display: this.state.visible ? 'block' : 'none'
        };
        const cx = className({
            "dropdown-menu-align-right": !this.props.alignLeft,
            "dropdown-menu-align-left": this.props.alignLeft,
            "dropdown-submenu-align-right": this.props.isSubMenu && !this.props.alignLeft,
            "dropdown-submenu-align-left": this.props.isSubMenu && this.props.alignLeft
        });

        // a click outside the ul should close the dropdown menu
        return (
            <ul style={style} className={cx}>{this.props.children}</ul>
        );
    }

    componentDidMount() {
        this.clickOutsideHandler = (event:MouseEvent) => {
            var toggleHandle = null;
            if (this.props.toggleHandle)
                toggleHandle = this.props.toggleHandle();

            if (!$(event.target).closest(ReactDOM.findDOMNode(this)).length && this.state.visible)
                if ($(event.target).closest(toggleHandle).length) {
                }
                else
                    this.hide();
        };
        if (typeof document !== "undefined")
            document.addEventListener('mousedown', this.clickOutsideHandler);
    }

    componentWillUnmount() {
        if (typeof document !== "undefined")
            document.removeEventListener('mousedown', this.clickOutsideHandler);
    }

}

export interface DropdownMenuItemProps extends React.Props<SimpleDropdownMenuItem> {
    text?:string;
    isFirstColumn?:boolean;
    isLastColumn?:boolean;
    onClick?: (e:SyntheticEvent) => any
}

/**
 * generic simple menu item on a dropdown menu that can optionally expand
 * into a submenu
 */
export class SimpleDropdownMenuItem extends React.Component<DropdownMenuItemProps,any> {

    private subMenuRef:DropdownMenu;

    private handleClick(e:SyntheticEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (this.subMenuRef)
            this.subMenuRef.toggleDisplay();
        if (this.props.onClick)
            this.props.onClick(e);
    }

    constructor(props:DropdownMenuItemProps) {
        super(props);
    }

    private renderSubMenu() {
        // Note: dropdown menu need a way to reference the DOM element that activate its visibility, in this case
        // since we are creating a sub menu that is activated by this component, this component is the visibility toggle handle
        return (
            <DropdownMenu isSubMenu={true} ref={(c:DropdownMenu)=>this.subMenuRef=c}
                          alignLeft={this.props.isLastColumn} toggleHandle={()=>ReactDOM.findDOMNode(this)}>
                {this.props.children}
            </DropdownMenu>
        );
    }

    render() {
        // if the component has children, render them as submenu
        return (
            <li className='dropdown-menu-item hoverable' onClick={(e)=>this.handleClick(e)}>
                {this.props.text || "Menu Item"}
                {this.props.children ? this.renderSubMenu() : null}
            </li>
        );
    }
}
