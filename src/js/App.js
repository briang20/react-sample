import React, {Component} from 'react';
import {connect} from "react-redux";
import {process} from '@progress/kendo-data-query';
import {Grid, GridColumn, GridToolbar} from '@progress/kendo-react-grid';
import '@progress/kendo-theme-default/dist/all.css';
import '../css/uswds-theme.scss';
import '../css/App.css';
import {
    addContact,
    changeSearchFilter,
    getContacts,
    removeContact,
    clearSelectedItems,
    postContacts,
    modifyContacts,
    deleteContacts,
    clearReplayBuffer, addSelectedItem, removeSelectedItem, modifyContact
} from "./actions/index";
import {getContactsList, getCurrentSearchFilter, getCurrentSelectedItemList, getReplayList} from "./selectors/index";
import {CommandCell} from "./components/command-cell";

function mapDispatchToProps(dispatch) {
    return {
        removeContact: function (contact) {
            dispatch(removeContact(contact))
        },
        clearSelectedItems: function () {
            dispatch(clearSelectedItems())
        },
        getContacts: function () {
            return dispatch(getContacts())
        },
        postContacts: function (opts) {
            dispatch(postContacts(opts))
        },
        modifyContacts: function (opts) {
            dispatch(modifyContacts(opts))
        },
        deleteContacts: function (opts) {
            dispatch(deleteContacts(opts))
        },
        addSelectedItem: function (item) {
            dispatch(addSelectedItem(item))
        },
        removeSelectedItem: function (item) {
            dispatch(removeSelectedItem(item))
        },
        modifyContact: function (contact, newContact) {
            dispatch(modifyContact(contact, newContact))
        },
    };
}

const mapStateToProps = state => {
    return {
        contacts: getContactsList(state),
        currentSearchFilter: getCurrentSearchFilter(state),
        currentSelectedItems: getCurrentSelectedItemList(state),
        replayBuffer: getReplayList(state)
    };
};

class ConnectedApp extends Component {
    editField = "inEdit";
    CommandCell;
    state = {
        dataState: {take: 10, skip: 0},
        contacts: {data: [...this.props.contacts], total: this.props.contacts.length}
    };

    constructor(props) {
        super(props);

        this.CommandCell = CommandCell({
            edit: this.enterEdit,
            remove: this.remove,

            add: this.add,
            discard: this.discard,

            update: this.update,
            cancel: this.cancel,

            editField: this.editField
        });
        this.handleRefreshTable = this.handleRefreshTable.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.onItemChange = this.onItemChange.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    enterEdit = (dataItem) => {
        this.setState({
            ...this.state,
            contacts: {
                data: this.state.contacts.data.map(item =>
                    item.id === dataItem.id ?
                        {...item, inEdit: true} : item
                )
            }
        });
    }

    remove = (dataItem) => {
        const data = [...this.state.contacts.data];
        this.props.removeContact(dataItem);
        this.props.deleteContacts(dataItem);

        this.setState({
            contacts: {
                data: data.filter(item => {
                    if (item === dataItem)
                        return false;
                    return true;
                }),
                total: data.length
            }
        });
    }

    add = (dataItem) => {
        dataItem.inEdit = undefined;
        dataItem.id = this.generateId(this.props.contacts);
        this.props.postContacts(dataItem);

        this.props.contacts.unshift(dataItem);
        this.setState({
            ...this.state,
            contacts: {data: [...this.state.contacts.data], total: this.state.contacts.data.length}
        });
    }

    discard = (dataItem) => {
        const data = [...this.state.contacts.data];
        this.removeItem(data, dataItem);
        this.props.removeContact({data});

        this.setState({contacts: {data, total: data.length}});
    }

    update = (dataItem) => {
        const data = [...this.state.contacts.data];
        const updatedItem = {...dataItem, inEdit: undefined};

        this.updateItem(data, updatedItem);
        this.props.modifyContacts(updatedItem);

        this.setState({contacts: {data, total: data.length}});
    }

    cancel = (dataItem) => {
        const originalItem = this.props.contacts.find(p => p.id === dataItem.id);
        const data = this.state.contacts.data.map(item => item.id === originalItem.id ? originalItem : item);

        this.setState({contacts: {data, total: data.length}});
    }

    updateItem = (data, item) => {
        let index = data.findIndex(p => p === item || (item.id && p.id === item.id));
        if (index >= 0) {
            data[index] = {...item};
        }
    }

    itemChange = (event) => {
        const data = this.state.contacts.data.map(item =>
            item.id === event.dataItem.id ?
                {...item, [event.field]: event.value} : item
        );

        this.setState({contacts: {data, total: data.length}});
    }

    addNew = () => {
        const newDataItem = {inEdit: true};

        this.setState({
            contacts: {data: [newDataItem, ...this.state.contacts.data], total: this.state.contacts.data.length + 1}
        });
    }

    cancelCurrentChanges = () => {
        this.setState({contacts: {data: [...this.props.contacts], total: this.props.contacts.length}});
    }

    componentDidMount() {
        this.handleRefreshTable();
    }

    generateId() {
        let id = 1;
        if (this.props.contacts.length > 0) {
            const lastContact = this.props.contacts.reduce(function (a, b) {
                return a.id < b.id ? b : a;
            });
            if (lastContact) id = lastContact.id + 1;
        }
        return id;
    }

    handleRefreshTable() {
        this.props.getContacts()
            .then(res => {
                this.updateState();
            });
    }

    updateState() {
        this.setState({
            contacts: process(this.props.contacts.slice(0), this.state.dataState)
        });
    }

    onItemChange(event) {
        console.log(event);
        const editedItem = event.dataItem;
        let payload = {id: editedItem.id, field: event.field, value: event.value};
        this.props.modifyContact(editedItem, payload);
    }

    onRowClick(event) {
        if (event.dataItem.selected) {
            event.dataItem.selected = false;
            this.props.removeSelectedItem(event.dataItem);
        } else {
            event.dataItem.selected = true;
            this.props.addSelectedItem(event.dataItem);
        }
    }

    dataStateChange = (event) => {
        this.setState({
            contacts: process(this.props.contacts.slice(0), event.data),
            dataState: event.data
        });
    }

    render() {
        let {data} = this.state.contacts;

        const hasEditedItem = data.some(p => p.inEdit);
        return (
            <>
                <div className="usa-header">
                    <h2 className={"usa-title"}>Contacts Page</h2>
                </div>
                <div className={"usa-content"}>
                    <Grid className={"usa-table"}
                          editable={true}
                          sortable={true}
                          pageable={true}
                          filterable={true}

                          {...this.state.dataState}
                          {...this.state.contacts}

                          data={data}
                          editField={this.editField}
                          selectedField={"selected"}
                          onDataStateChange={this.dataStateChange}
                          onItemChange={this.itemChange}
                          onRowClick={this.onRowClick}
                    >
                        <GridToolbar>
                            <button
                                title="Refresh"
                                className="k-button k-primary"
                                onClick={this.handleRefreshTable}
                            >
                                Refresh
                            </button>
                            <button
                                title="Add new"
                                className="k-button k-primary"
                                onClick={this.addNew}
                            >
                                Add new
                            </button>
                            {hasEditedItem && (
                                <>
                                    <button
                                        title="Cancel current changes"
                                        className="k-button"
                                        onClick={this.cancelCurrentChanges}
                                    >
                                        Cancel current changes
                                    </button>
                                </>)}
                        </GridToolbar>
                        <GridColumn field={"id"} title={"#"} width={"75px"} filter={'numeric'} editable={false}/>
                        <GridColumn field={"name"} title={"Name"} filter={'text'} editor={"text"}/>
                        <GridColumn field={"username"} title={"Username"} filter={'text'} editor={"text"}/>
                        <GridColumn field={"email"} title={"Email"} filter={'text'} editor={"text"}/>
                        <GridColumn field={"website"} title={"URL"} filter={'text'} editor={"text"}/>
                        <GridColumn filterable={false} cell={this.CommandCell} width={"240px"}/>
                    </Grid>
                </div>
                <footer className={"usa-footer usa-footer--slim"}>
                    <div className={"grid-container usa-footer__return-to-top"}>
                        <a href={"#top"}>Return to top</a>
                    </div>
                </footer>
            </>
        );
    }
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedApp);

export default App;
