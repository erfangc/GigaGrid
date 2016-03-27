import * as React from "react";
import * as classNames from "classnames";
import {ColumnDef} from "../../models/ColumnLike";
import {SortableDataTransfer} from "./SettingsPopover";

interface SortableItemProps extends React.Props<SortableItem> {
    column:ColumnDef
    idx:number
    type:string
    onClick:() => any
    onUpdate:(src:SortableDataTransfer, dest:SortableDataTransfer) => any
}

export class SortableItem extends React.Component<SortableItemProps,{}> {

    constructor(props:SortableItemProps) {
        super(props);
        this.state = {
            isDraggingOver: false
        }
    }

    onDrop(e:React.DragEvent) {

        const src:SortableDataTransfer = {
            type: e.dataTransfer.getData('type'),
            colTag: e.dataTransfer.getData('colTag'),
            idx: parseInt(e.dataTransfer.getData('idx'))
        };
        const dest:SortableDataTransfer = {
            type: this.props.type,
            colTag: this.props.column.colTag,
            idx: this.props.idx
        };

        this.props.onUpdate(src, dest)
    }

    onDragStart(e:React.DragEvent) {
        e.dataTransfer.setData('colTag', this.props.column.colTag);
        e.dataTransfer.setData('type', this.props.type);
        e.dataTransfer.setData('idx', `${this.props.idx}`);
    }

    onDragOver(e:React.DragEvent) {
        e.preventDefault();
        this.setState({
            isDraggingOver: true
        });
    }

    onDragLeave(e:React.DragEvent) {
        e.preventDefault();
        this.setState({
            isDraggingOver: false
        });
    }

    componentWillReceiveProps() {
        this.setState({
            isDraggingOver: false
        });
    }

    render() {
        const cx = classNames({
            dragging: this.state['isDraggingOver']
        });
        return (
            <li className={cx} draggable={true}
                onClick={()=>this.props.onClick.call(undefined, this.props.column)}
                onDragStart={(e)=>this.onDragStart.call(this, e)}
                onDragOver={(e)=>this.onDragOver(e)}
                onDragLeave={(e)=>this.onDragLeave(e)}
                onDrop={(e)=>this.onDrop(e)}>
                {this.props.column.title || this.props.column.colTag}
            </li>
        )
    }
}
