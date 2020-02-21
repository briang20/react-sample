import React, {Component} from 'react';
import {GridColumnMenuFilter} from '@progress/kendo-react-grid';

export class ColumnMenu extends Component {
    render() {
        return (
            <div>
                <GridColumnMenuFilter data-testid={"table-menu-filter"} {...this.props} expanded={true}/>
            </div>
        );
    }
}