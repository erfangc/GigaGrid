class DemoProps {
    public name:string;
    public age:number;
}

class Demo extends React.Component<DemoProps, any> {

    constructor(props:DemoProps) {
        super(props);
    }

    render() {
        return (<div className="blue">Hello {this.props.name}, whose age is {this.props.age}</div>);
    }

}