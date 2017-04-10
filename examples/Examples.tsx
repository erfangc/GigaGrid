import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GigaGrid} from '../src/index';
import UKBudget from './data/UKBudget';
import '../themes/default.css';
import {GigaProps} from '../src/components/GigaProps';

export interface ExamplesProps {
    ukBudget: GigaProps;
}

export class Examples extends React.Component<ExamplesProps, {}> {

    constructor(props: ExamplesProps) {
        super(props);
    }

    render() {
        const additionalUserButtons = [{name: 'Export Grid'}];
        return (
            <div>
                <div className="container">
                    {this.renderBasicExample(additionalUserButtons)}
                </div>
            </div>
        );
    }

    private renderBasicExample(additionalUserButtons) {
        return (
            <GigaGrid
                bodyHeight={'500px'}
                staticLeftHeaders={1}
                {...UKBudget}
            />
        );
    }

}

function main() {
    ReactDOM.render(<Examples ukBudget={UKBudget}/>, document.getElementById('app'));
}

main();
