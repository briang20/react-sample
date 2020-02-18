import React from 'react';
import {GridColumnMenuFilter} from '@progress/kendo-react-grid';

export class ColumnMenu extends React.Component {
    render() {
        return (
            <div>
                <GridColumnMenuFilter {...this.props} expanded={true}/>
            </div>
        );
    }
}