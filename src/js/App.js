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
import {changeSearchFilter, getContacts} from "./actions/index";
import {getCurrentSearchFilter, getContactsList, getSortingState} from "./selectors/index";
import {sortTypes} from "./constants/sort-types";

function mapDispatchToProps(dispatch) {
    return {
        changeSearchFilter: function (filter) {
            dispatch(changeSearchFilter(filter))
        },
        getContacts: function () {
            dispatch(getContacts())
        },
    };
}

const mapStateToProps = state => {
    return {
        contacts: getContactsList(state),
        currentSortMethod: getSortingState(state),
        currentSearchFilter: getCurrentSearchFilter(state),
    };
};

class ConnectedApp extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.getContacts();
    }

    handleSubmit(event) {
        const searchInput = document.getElementById('filter');

        console.log(searchInput.value);
        this.props.changeSearchFilter(searchInput.value);
        event.preventDefault();
    }

    render() {
        const columns = [
            {title: '#', field: 'id', readonly: true},
            {title: 'Name', field: 'name'},
            {title: 'User', field: 'username'},
            {title: 'Email', field: 'email'},
            {title: 'Website', field: 'website'},
            {title: 'Select All', field: '', type: 'checkbox'}
        ];
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
                    <TableData columns={columns}/>
                </Table>
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
