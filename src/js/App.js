import React, {Component} from 'react';
import {connect} from "react-redux";
import '../css/uswds-theme.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/App.css';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Table from 'react-bootstrap/Table'
import TableColumns from './components/table-columns';
import TableData from './components/table-data';
import {
    addContact,
    changeSearchFilter,
    deleteContacts,
    getContacts, modifyContact,
    putContacts,
    postContacts,
    removeContact,
    clearSelectedItems
} from "./actions/index";
import {getCurrentSearchFilter, getContactsList, getSortingState, getCurrentSelectedItemList} from "./selectors/index";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";

function mapDispatchToProps(dispatch) {
    return {
        changeSearchFilter: function (filter) {
            dispatch(changeSearchFilter(filter))
        },
        addContact: function (contact) {
            dispatch(addContact(contact))
        },
        removeContact: function (contact) {
            dispatch(removeContact(contact))
        },
        clearSelectedItems: function () {
            dispatch(clearSelectedItems())
        },
        modifyContact: function (contact, newContact) {
            dispatch(modifyContact(contact, newContact))
        },
        getContacts: function () {
            dispatch(getContacts())
        },
        postContacts: function (opts) {
            dispatch(postContacts(opts))
        },
        putContacts: function (opts) {
            dispatch(putContacts(opts))
        },
        deleteContacts: function (opts) {
            dispatch(deleteContacts(opts))
        },
    };
}

const mapStateToProps = state => {
    return {
        contacts: getContactsList(state),
        currentSortMethod: getSortingState(state),
        currentSearchFilter: getCurrentSearchFilter(state),
        currentSelectedItems: getCurrentSelectedItemList(state),
    };
};

class ConnectedApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {title: '#', field: 'id', readonly: true},
                {title: 'Name', field: 'name'},
                {title: 'User', field: 'username'},
                {title: 'Email', field: 'email'},
                {title: 'Website', field: 'website'},
                {title: 'Select All', field: '', type: 'checkbox'}
            ]
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddRow = this.handleAddRow.bind(this);
        this.handleSaveChanges = this.handleSaveChanges.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        this.handleCheckForUpdates = this.handleCheckForUpdates.bind(this);
    }

    componentDidMount() {
        this.props.getContacts();
    }

    handleSubmit(event) {
        event.preventDefault();
        const searchInput = document.getElementById('filter');
        this.props.changeSearchFilter(searchInput.value);
    }

    handleDeleteRows() {
        //TODO: maybe prompt for confirmation of the delete action?
        for (let item of this.props.currentSelectedItems) {
            this.props.removeContact(item);
        }
        this.props.clearSelectedItems();
    }

    handleAddRow() {
        const opts = {id: this.props.contacts.length + 1};
        this.props.addContact([opts]);
    }

    handleCheckForUpdates() {
        this.props.getContacts();
    }

    handleSaveChanges() {
        //TODO: go through the history table and do the final calls

        // this.props.postContacts(opts);
        // this.props.deleteContacts(opts);
        // this.props.modifyContacts(opts);
    }

    render() {
        const {columns} = this.state;
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
                <Navbar bg="primary" variant="dark" sticky={"top"}>
                    <Navbar.Brand href="#home">Contacts</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                    </Nav>
                    <Form data-testid={"search-form"} onSubmit={this.handleSubmit} inline>
                        <FormControl data-testid={"search-filter"} type="text" placeholder="Search" className="mr-sm-2"
                                     id="filter"/>
                        <Button data-testid={"search-button"} type="submit" variant="outline-light">Search</Button>
                    </Form>
                </Navbar>
                <Table responsive={"sm"}
                       size={"sm"}
                       hover={true}
                       bordered={true}
                       striped={true}
                       variant="">
                    <TableColumns columns={columns}/>
                    <TableData columns={columns} data={filteredData}/>
                </Table>
                <small>
                    <p className={"usa-footer"}>1-{filteredData.length} of {this.props.contacts.length}</p>
                </small>
                <ButtonToolbar aria-label="Button toolbar that do actions on the table">
                    <ButtonGroup aria-label="Group of table CRUD buttons">
                        <Button data-testid={"save-table"} variant="primary"
                                onClick={this.handleSaveChanges}> Save Changes</Button>
                        <Button data-testid={"refresh-table"} variant="primary"
                                onClick={this.handleCheckForUpdates}>Refresh</Button>
                        <Button data-testid={"add-row"} variant="secondary" onClick={this.handleAddRow}>Add Row</Button>
                        <Button data-testid={"delete-row"} variant="secondary" onClick={this.handleDeleteRows}>Delete
                            Selected</Button>
                    </ButtonGroup>
                </ButtonToolbar>
                <button id={"backToTop"}><a href="#top" id={"topText"}>Top ^</a></button>
            </div>
        );
    }
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedApp);

export default App;
