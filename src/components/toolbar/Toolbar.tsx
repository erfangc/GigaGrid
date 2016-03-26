import {GigaProps, GridSubcomponentProps} from "./../GigaGrid";
import * as React from "react";
import {GigaStore, GigaAction} from "../../store/GigaStore";
import {SettingsPopover} from "./SettingsPopover";
import "./Toolbar.styl";

export interface ToolbarProps extends GridSubcomponentProps<Toolbar> {
    gridProps:GigaProps
    gridStore:GigaStore
}

interface ToolbarState {
    showSettingsPopover: boolean
}

/**
 * The job of the toolbar is to dispatch actions to the flux reduce store. It is free to query the state of the grid
 * and its props
 */
export class Toolbar extends React.Component<ToolbarProps, ToolbarState> {

    constructor(props:ToolbarProps) {
        super(props);
        this.state = {
            showSettingsPopover: false
        }
    }

    dismissSettingsPopover() {
        this.setState({
            showSettingsPopover: false
        });
    }
    
    dispatchAction(action: GigaAction) {
        this.props.dispatcher.dispatch(action);
        this.dismissSettingsPopover();
    }

    render() {
        const state = this.props.gridStore.getState();
        const {columns, subtotalBys} = state;
        return (
            <div className="giga-grid-toolbar">
                <span className="toolbar-item" onClick={()=>this.setState({showSettingsPopover: !this.state.showSettingsPopover})}>
                    <span className="toolbar-item-toggle"><i className="fa fa-cogs"/> Settings</span>
                    {
                        this.state.showSettingsPopover ?
                        <SettingsPopover onDismiss={()=>this.dismissSettingsPopover()}
                                         onSubmit={(action)=>this.dispatchAction(action)}
                                         subtotalBys={subtotalBys} columns={columns}/> : ""
                    }
                </span>
            </div>
        );
    }
}