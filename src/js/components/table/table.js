import React, {Component} from 'react';
import {GridColumn, Grid, GridToolbar} from '@progress/kendo-react-grid';
import {process} from '@progress/kendo-data-query';
import {CommandCell} from "./command-cell";

export class GridWithState extends Component {
    constructor(props) {
        super(props);
        const data = this.props.data;

        const dataState = props.pageable ? {skip: 0, take: this.props.pageSize} : {skip: 0};

        this.state = {
            dataState: dataState,
            result: process(data, dataState),
            data: data
        };
    }

    render() {
        return (
            <Grid
                editField="_command"
                expandField="_expanded"
                {...this.props}
                {...this.state.dataState}
                {...this.state.result}

                onItemChange={this.itemChange}
                onDataStateChange={this.onDataStateChange}
            >
                <GridToolbar>
                </GridToolbar>

                {this.props.children}

                <GridColumn
                    groupable={false}
                    sortable={false}
                    filterable={false}
                    resizable={false}
                    field="_command"
                    title=" "
                    width="180px"
                    cell={CommandCell}
                />
            </Grid>
        );
    }

    itemChange(event) {
        const {data} = this.state;

        if (event.field === this.props.editField) {
            switch (event.value) {
                case 'add':
                    //TODO: add row
                    break;
                case 'edit':
                    //TODO: set the edit field
                    break;
                case 'discard':
                    //TODO: undo the new row
                    break;
                case 'cancel':
                    //TODO: undo the changes to the row
                    break;

                case 'update':
                    //TODO: CRUD calls
                    //this.props.endPoint;
                    break;
                case 'remove':
                    //TODO: CRUD calls
                    //this.props.endPoint;
                    break;
            }
        } else {
            event.dataItem[event.field] = event.value;
        }

        this.setState({
            result: process(data, this.state.dataState)
        });
    }

    onDataStateChange(e) {
        this.setState({
            dataState: e.data,
            result: process(this.state.data, e.data)
        });
    }
}