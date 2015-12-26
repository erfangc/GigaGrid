import * as React from 'react';
import className = require('classnames');
import SyntheticEvent = __React.SyntheticEvent;

export interface DropdownMenuProps extends React.Props<DropdownMenu> {
    isSubMenu?: boolean;
    isInitiallyVisible?: boolean;
    alignLeft?: boolean;
}

export interface DropdownMenuState {
    visible: boolean;
}

/**
 * a generic dropdown menu component that can be reused in any context
 */
export class DropdownMenu extends React.Component<DropdownMenuProps, DropdownMenuState> {

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
        return (
            <ul style={style} className={cx}>{this.props.children}</ul>
        );
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
        return (
            <DropdownMenu isSubMenu={true} ref={(c:DropdownMenu)=>this.subMenuRef=c} alignLeft={this.props.isLastColumn}>
                {this.props.children}
            </DropdownMenu>
        );
    }

    render() {
        // if the component has children, render them as submenu
        return (
            <li className='dropdown-menu-item hoverable' onClick={(e)=>this.handleClick(e)}>
                {this.props.text}
                {this.props.children ? this.renderSubMenu() : null}
            </li>
        );
    }
}
