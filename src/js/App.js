import React, {Component} from 'react';
import {connect} from "react-redux";
import '../css/uswds-theme.scss';
import '../css/App.css';
import Table from './components/table';
import TableColumn from './components/table-column';
import {
    addContact,
    changeSearchFilter,
    getContacts,
    removeContact,
    clearSelectedItems,
    postContacts,
    modifyContacts,
    deleteContacts,
    clearReplayBuffer
} from "./actions/index";
import {getContactsList, getCurrentSearchFilter, getCurrentSelectedItemList, getReplayList} from "./selectors/index";

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
    constructor(props) {
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        this.handleAddRow = this.handleAddRow.bind(this);
        this.handleRefreshTable = this.handleRefreshTable.bind(this);
        this.handleSaveTable = this.handleSaveTable.bind(this);
    }

    componentDidMount() {
        this.handleRefreshTable();
    }

    handleTextChange(event) {
        const target = event.currentTarget;
        this.props.changeSearchFilter(target.value);
    }

    handleDeleteRows() {
        //TODO: maybe prompt for confirmation of the delete action?
        for (let item of this.props.currentSelectedItems) {
            this.props.removeContact(item);
        }
        this.props.clearSelectedItems();
    }

    handleAddRow() {
        let id = 1;
        const lastContact = this.props.contacts.reduce(function (a, b) {
            return a.id < b.id ? b : a;
        });
        if (lastContact) id = lastContact.id + 1;
        const opts = {id: id};
        this.props.addContact(opts);
    }

    handleRefreshTable() {
        //TODO: maybe show a alert that there are unsaved changes?
        if (this.props.replayBuffer.length > 0) {
            // await for alert here
        }
        this.props.getContacts();
        this.props.clearReplayBuffer();
    }

    handleSaveTable() {
        let actions = [];
        for (const action of this.props.replayBuffer) {
            switch (action.type) {
                case 'post':
                case 'delete':
                    actions.push(action);
                    break;
                case 'put':
                    let contact = actions.find(element => element.data.id === action.data.id);
                    if (!contact) {
                        contact = Object.assign({}, this.props.contacts.find(element => element.id === action.data.id));
                        contact[action.data.field] = action.data.value;
                        delete contact.selected;
                        actions.push({type: 'put', data: contact});
                    } else {
                        contact.data[action.data.field] = action.data.value;
                    }
                    break;
                default:
                    console.log('got unknown action', action);
            }
        }
        // We processed the buffer, now clear it
        this.props.clearReplayBuffer();

        for (const action of actions) {
            switch (action.type) {
                case 'delete':
                    this.props.deleteContacts(action.data);
                    break;
                case 'post':
                    this.props.postContacts(action.data);
                    break;
                case 'put':
                    this.props.modifyContacts(action.data);
                    break;
                default:
                    console.log('got unknown action', action);
            }
        }
    }

    render() {
        // Filter out the contacts that we do not care about
        const filteredData = [...this.props.contacts].filter(item => {
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
        shownCountText = shownCountText + filteredData.length + ' of ' + this.props.contacts.length;

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
                    <Table title={"Contacts"} data={filteredData}>
                        <TableColumn title={""} type={"checkbox"}/>
                        <TableColumn field={"id"} title={"#"} type={"text"} readonly={true}/>
                        <TableColumn field={"name"} title={"Name"} type={"text"}/>
                        <TableColumn field={"username"} title={"Username"} type={"text"}/>
                        <TableColumn field={"email"} title={"Email"} type={"email"}/>
                        <TableColumn field={"website"} title={"URL"} type={"text"}/>
                    </Table>
                    <small>
                        <p>{shownCountText}</p>
                    </small>
                </div>
                <footer className={"usa-footer usa-footer--slim"}>
                    <div key={"buttons"} className={"no-floating"}>
                        <button id={"saveChanges"}
                                className={"usa-button"}
                                data-testid={"save-table"}
                                onClick={this.handleSaveTable}>Save
                        </button>
                        <button id={"refreshTable"}
                                className={"usa-button"}
                                data-testid={"refresh-table"}
                                onClick={this.handleRefreshTable}>Refresh
                        </button>
                        <button id={"addRow"}
                                className={"usa-button"}
                                data-testid={"add-row"}
                                onClick={this.handleAddRow}>Add Row
                        </button>
                        <button id={"deleteRow"}
                                className={"usa-button"}
                                data-testid={"delete-row"}
                                onClick={this.handleDeleteRows}>Delete Selected Rows
                        </button>
                    </div>
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
