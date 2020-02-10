import React, {Component} from 'react';
import {connect} from "react-redux";
import '../css/uswds-theme.scss';
import '../css/App.css';
import Table from './components/table';
import TableColumn from './components/table-column';
import {
    addContact,
    clearContacts,
    changeSearchFilter,
    getContacts,
    removeContact,
    clearSelectedItems,
    postContacts,
    modifyContacts,
    deleteContacts
} from "./actions/index";
import {getContactsState, getCurrentSearchFilter, getCurrentSelectedItemList} from "./selectors/index";

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
        clearContacts: function () {
            dispatch(clearContacts())
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
    };
}

const mapStateToProps = state => {
    return {
        contacts: getContactsState(state),
        currentSearchFilter: getCurrentSearchFilter(state),
        currentSelectedItems: getCurrentSelectedItemList(state)
    };
};

class ConnectedApp extends Component {
    constructor(props) {
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        this.handleAddRow = this.handleAddRow.bind(this);
        this.handleRefreshTable = this.handleRefreshTable.bind(this);
    }

    componentDidMount() {
        this.handleRefreshTable();
    }

    renderHeader() {
        return (
            <div className="usa-header">
                <h2>Contacts Page</h2>
                <input type={"text"} className={"usa-search"} name={"filter"} placeholder={"Search"}
                       data-testid={"search-filter"}
                       value={this.props.currentSearchFilter}
                       onChange={this.handleTextChange}/>
            </div>
        );
    }

    handleTextChange(event) {
        const target = event.currentTarget;
        this.props.changeSearchFilter(target.value);
    }

    handleDeleteRows() {
        //TODO: maybe prompt for confirmation of the delete action?
        for (let item of this.props.currentSelectedItems) {
            this.props.removeContact(item);
            this.props.deleteContacts(item);
        }
        this.props.clearSelectedItems();
    }

    handleAddRow() {
        const opts = {id: this.props.contacts.length + 1};
        this.props.addContact([opts]);
        this.props.postContacts(opts);
    }

    handleRefreshTable() {
        this.props.getContacts();
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

        return (
            <div className={"usa-content"}>
                {this.renderHeader()}
                <p></p>
                <Table title="Contacts" editable="false" data={filteredData}>
                    <TableColumn title="" type="checkbox"/>
                    <TableColumn field="id" title="User ID" readonly={true}/>
                    <TableColumn field="name" title="Name"/>
                    <TableColumn field="username" title="Username"/>
                    <TableColumn field="email" title="Email"/>
                    <TableColumn field="website" title="URL"/>
                </Table>
                <p></p>
                <small>
                    <p className={"usa-footer"}>1-{filteredData.length} of {this.props.contacts.length}</p>
                </small>
                <div key={"buttons"}>
                    <button id={"saveChanges"}
                            className={"usa-button"}
                            data-testid={"save-table"}
                            onClick={this.handleDeleteRows}>Save
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
                <button id={"backToTop"}><a href="#top" id={"topText"}>Top</a></button>
            </div>
        );
    }
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedApp);

export default App;
