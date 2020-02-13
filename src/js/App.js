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
        addContact: function (contact) {
            dispatch(addContact(contact))
        },
        removeContact: function (contact) {
            dispatch(removeContact(contact))
        },
        changeSearchFilter: function (filter) {
            dispatch(changeSearchFilter(filter))
        },
        clearSelectedItems: function () {
            dispatch(clearSelectedItems())
        },
        getContacts: function () {
            dispatch(getContacts())
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
        clearReplayBuffer: function () {
            dispatch(clearReplayBuffer())
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
        data: [...this.props.contacts]
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

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleRefreshTable = this.handleRefreshTable.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.onItemChange = this.onItemChange.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    enterEdit = (dataItem) => {
        this.setState({
            data: this.state.data.map(item =>
                item.id === dataItem.id ?
                    {...item, inEdit: true} : item
            )
        });
    }

    remove = (dataItem) => {
        const data = [...this.state.data];
        this.props.removeContact(dataItem);
        this.props.deleteContacts(dataItem);

        this.setState({data});
    }

    add = (dataItem) => {
        dataItem.inEdit = undefined;
        dataItem.id = this.generateId(this.props.contacts);
        this.props.postContacts(dataItem);

        this.props.contacts.unshift(dataItem);
        this.setState({
            data: [...this.state.data]
        });
    }

    discard = (dataItem) => {
        const data = [...this.state.data];
        this.removeItem(data, dataItem);
        this.props.removeContact(data);

        this.setState({data});
    }

    update = (dataItem) => {
        const data = [...this.state.data];
        const updatedItem = {...dataItem, inEdit: undefined};

        this.updateItem(data, updatedItem);
        this.props.modifyContacts(updatedItem);

        this.setState({data});
    }

    cancel = (dataItem) => {
        const originalItem = this.props.contacts.find(p => p.id === dataItem.id);
        const data = this.state.data.map(item => item.id === originalItem.id ? originalItem : item);

        this.setState({data});
    }

    updateItem = (data, item) => {
        let index = data.findIndex(p => p === item || (item.id && p.id === item.id));
        if (index >= 0) {
            data[index] = {...item};
        }
    }

    itemChange = (event) => {
        const data = this.state.data.map(item =>
            item.id === event.dataItem.id ?
                {...item, [event.field]: event.value} : item
        );

        this.setState({data});
    }

    addNew = () => {
        const newDataItem = {inEdit: true};

        this.setState({
            data: [newDataItem, ...this.state.data]
        });
    }

    cancelCurrentChanges = () => {
        this.setState({data: [...this.props.contacts]});
    }

    componentDidMount() {
        this.handleRefreshTable();
    }

    handleTextChange(event) {
        const target = event.currentTarget;
        this.props.changeSearchFilter(target.value);
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
        this.props.getContacts();
        this.updateState();
    }

    updateState() {
        this.setState({
            data: [...this.props.contacts]
        });
    }

    onItemChange(event) {
        console.log(event);
        const editedItem = event.dataItem;
        let payload = {id: editedItem.id, field: event.field, value: event.value};
        this.props.modifyContact(editedItem, payload);
    }

    onRowClick(event) {
        if (event.dataItem.selected)
            this.props.removeSelectedItem(event.dataItem);
        else
            this.props.addSelectedItem(event.dataItem);
    }

    render() {
        const {data} = this.state;

        // Filter out the contacts that we do not care about
        const filteredData = [...data].filter(item => {
            if (this.props.currentSearchFilter === '')
                return true;

            const array = Object.values(item);
            for (const element of array) {
                if (element.toString().indexOf(this.props.currentSearchFilter) !== -1)
                    return true;
            }
            return false;
        });

        let shownCountText = '0-';
        if (filteredData.length > 0)
            shownCountText = '1-';
        shownCountText = shownCountText + filteredData.length + ' of ' + data.length;

        const hasEditedItem = data.some(p => p.inEdit);
        return (
            <>
                <div className="usa-header">
                    <h2 className={"usa-title"}>Contacts Page</h2>
                    <input type={"text"} className={"usa-search"} name={"filter"} placeholder={"Search"}
                           data-testid={"search-filter"}
                           tabIndex={1}
                           value={this.props.currentSearchFilter}
                           onChange={this.handleTextChange}/>
                </div>
                <div className={"usa-content"}>
                    <Grid className={"usa-table"}
                          data={filteredData}
                          editable={true}
                          editField={this.editField}
                          onItemChange={this.itemChange}
                          sortable
                          selectedField={"selected"}
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
                        <GridColumn field="id" title={"#"} width={"50px"} editable={false}/>
                        <GridColumn field="name" title={"Name"} editor="text"/>
                        <GridColumn field="username" title={"Username"} editor="text"/>
                        <GridColumn field="email" title={"Email"} editor="text"/>
                        <GridColumn field="website" title={"URL"} editor="text"/>
                        <GridColumn cell={this.CommandCell} width="240px"/>
                    </Grid>
                    <small>
                        <p>{shownCountText}</p>
                    </small>
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
