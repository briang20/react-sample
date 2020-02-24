import React, {Component} from 'react';
import {GridColumn, Grid, GridToolbar} from '@progress/kendo-react-grid';
import {process} from '@progress/kendo-data-query';
import {CommandCell} from "./command-cell";
import DataLoader from "../loading-portal";

export class GridWithState extends Component {
    constructor(props) {
        super(props);
        const dataState = props.pageable ? {
            take: this.props.pageSize,
            filter: undefined,
            skip: 0,
            sort: undefined
        } : {skip: 0};

        this.state = {
            dataState: dataState,
            result: process(this.props.data, dataState),
            allData: this.props.data
        };

        this.generateId = this.generateId.bind(this);
        this.itemChange = this.itemChange.bind(this);
        this.dataReceived = this.dataReceived.bind(this);
        this.onDataStateChange = this.onDataStateChange.bind(this);
    }

    render() {
        let {allData} = this.state;

        const hasEditedItem = allData.some(p => p.inEdit);
        const hasSelectedItems = allData.some(p => p.selected);
        return (
            <>
                <Grid
                    editField={this.props.editField}
                    expandField="_expanded"
                    selectedField={"selected"}
                    {...this.props}
                    {...this.state.dataState}
                    {...this.state.result}

                    onItemChange={this.itemChange}
                    onDataStateChange={this.onDataStateChange}
                >
                    <GridToolbar>
                        <button
                            title="Refresh"
                            className="k-button k-primary"
                            onClick={event => this.toolbarButtonClick(event, 'refresh')}
                            data-testid={"refresh-table"}
                        >
                            Refresh
                        </button>
                        <button
                            title="Add new"
                            className="k-button k-primary"
                            onClick={event => this.toolbarButtonClick(event, 'add')}
                            data-testid={"add-row"}
                        >
                            Add new
                        </button>
                        {hasSelectedItems && (<button
                            title="Delete Selected Items"
                            className="k-button"
                            onClick={event => this.toolbarButtonClick(event, 'delete-selected')}
                            data-testid={"delete-selected-row"}
                        >
                            Delete Selected Items
                        </button>)}
                        {hasEditedItem && (
                            <button
                                title="Cancel current changes"
                                className="k-button"
                                onClick={event => this.toolbarButtonClick(event, 'cancel')}
                                data-testid={"cancel-current-changes"}
                            >
                                Cancel current changes
                            </button>)}
                    </GridToolbar>

                    {this.props.children}

                    <GridColumn
                        groupable={false}
                        sortable={false}
                        filterable={false}
                        resizable={false}
                        field={this.props.editField}
                        title=" "
                        width="180px"
                        cell={CommandCell}
                    />
                </Grid>
                <DataLoader
                    container={".k-grid-content"}
                    fetchData={this.props.fetchData}
                    dataState={this.state.dataState}
                    onDataReceived={this.dataReceived}
                />
            </>
        );
    }

    generateId() {
        let id = 1;
        if (this.state.allData.length > 0) {
            const lastId = this.state.allData.reduce(function (a, b) {
                return a.id < b.id ? b : a;
            });
            if (lastId) id = lastId.id + 1;
        }
        return id;
    }

    toolbarButtonClick(event, command) {
        switch (command) {
            case 'add':
                let data = this.state.result.data;
                data.unshift({[this.props.editField]: true, id: undefined});
                this.setState({
                    result: process(data, this.props.pageable ? {
                        take: this.state.dataState.take,
                        filter: this.state.dataState.filter,
                        skip: 0,
                        sort: this.state.dataState.sort
                    } : this.state.dataState),
                    dataState: this.props.pageable ? {
                        take: this.state.dataState.take,
                        filter: this.state.dataState.filter,
                        skip: 0,
                        sort: this.state.dataState.sort
                    } : this.state.dataState
                });
                break;
            case 'cancel':
                //TODO:
                console.log('cancel all changes button pressed');
                break;
            case 'delete-selected':
                this.props.onClick.call(undefined, {event, value: command});
                break;
            case 'refresh':
                this.props.onClick.call(undefined, {event, value: command, callback: this.dataReceived});
                break;
        }
    }

    itemChange(event) {
        const {allData} = this.state;

        if (event.field === this.props.editField) {
            switch (event.value) {
                case 'add':
                    //TODO: add row
                    console.log('final add button pressed');
                    break;
                case 'edit':
                    //TODO: set the edit field
                    console.log('got edit event', event);
                    event.dataItem[event.field] = true;
                    break;
                case 'discard':
                    this.setState({
                        result: process(allData, this.props.pageable ? {
                            take: this.state.dataState.take,
                            filter: this.state.dataState.filter,
                            skip: 0,
                            sort: this.state.dataState.sort
                        } : this.state.dataState),
                    });
                    break;
                case 'cancel':
                    //TODO: undo the changes to the row
                    const originalItem = this.state.allData.find(p => p.id === event.dataItem.id);
                    const data = this.state.result.data.map(item => item.id === originalItem.id ? originalItem : item);

                    delete event.dataItem[this.props.editField];
                    this.setState({
                        result: process(data, this.props.pageable ? {
                            take: this.state.dataState.take,
                            filter: this.state.dataState.filter,
                            skip: 0,
                            sort: this.state.dataState.sort
                        } : this.state.dataState),
                    });
                    break;

                case 'update':
                    //TODO: CRUD calls
                    //this.props.endPoint;
                    delete event.dataItem[this.props.editField];
                    this.props.onChange(event);
                    break;
                case 'remove':
                    //TODO: CRUD calls
                    //this.props.endPoint;
                    delete event.dataItem[this.props.editField];
                    this.props.onChange(event);
                    break;
            }
        } else {
            event.dataItem[event.field] = event.value;
        }

        this.setState({
            result: process(allData, this.state.dataState)
        });
    }

    dataReceived(e) {
        this.setState({
            result: process(e, this.state.dataState),
            allData: e
        });
    }

    onDataStateChange(e) {
        this.setState({
            dataState: e.data,
            result: process(this.state.data, e.data)
        });
    }
}