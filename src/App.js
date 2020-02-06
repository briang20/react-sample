import React, {Component} from 'react';
import {connect} from "react-redux";
import './css/uswds-theme.scss';
import './App.css';
import Table from './js/components/table';
import TableColumn from './js/components/table-column';
import {addContact, changeSearchFilter} from "./js/actions/index";
import {getCurrentSearchFilter} from "./js/selectors";

function mapDispatchToProps(dispatch) {
    return {
        addContact: function (contact) {
            dispatch(addContact(contact))
        },
        changeSearchFilter: function (filter) {
            dispatch(changeSearchFilter(filter))
        },
        // fetchContacts: function (type, opts, fnCallback) {
        //     dispatch(fetchContacts(type, opts, fnCallback))
        // },
    };
}

const mapStateToProps = state => {
    return {
        currentSearchFilter: getCurrentSearchFilter(state)
    };
};

class ConnectedApp extends Component {
    constructor(props) {
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    componentDidMount() {
        this.getContacts();
    }

    fetchContacts(type, opts, fnCallback) {
        const config = require('./.settings.json');
        return fetch(config.main.apiUrl ? config.main.apiUrl : 'http://jsonplaceholder.typicode.com/users', {
            method: type,
            headers: {'Content-Type': 'application/json'},
            body: opts
        })
            .then(function (res) {
                return res.json()
            })
            .then(fnCallback)
    }

    getContacts() {
        this.fetchContacts('get', null, (data) => { // The '=>' operator doesn't work in IE11 and I can't get the props without 'this'?
            for (let contact of data) {
                this.props.addContact(contact);
            }
        }).catch(console.log);
    }

    postContacts(opts) {
        this.fetchContacts('post', JSON.stringify(opts), this.getContacts).catch(console.log);
    }

    modifyContacts(opts) {
        this.fetchContacts('put', JSON.stringify(opts), this.getContacts).catch(console.log);
    }

    deleteContacts(opts) {
        this.fetchContacts('delete', JSON.stringify(opts), this.getContacts).catch(console.log);
    }

    renderHeader() {
        return (
            <div className="usa-header">
                <h2>Contacts Page</h2>
            </div>
        );
    }

    handleTextChange(event) {
        const target = event.currentTarget;
        this.props.changeSearchFilter(target.value);
    }

    render() {
        return (
            <div className={"usa-content"}>
                {this.renderHeader()}
                <input type={"text"} className={"usa-input"} name={"filter"} placeholder={"Search"}
                       data-testid={"search-filter"}
                       value={this.props.currentSearchFilter}
                       onChange={this.handleTextChange}/>
                <p></p>
                <Table title="Contacts" editable="false">
                    <TableColumn field="id" title="User ID"/>
                    <TableColumn field="name" title="Name"/>
                    <TableColumn field="username" title="Username"/>
                    <TableColumn field="email" title="Email"/>
                    <TableColumn field="website" title="URL"/>
                    <TableColumn title="Select" type="checkbox"/>
                </Table>
            </div>
        );
    }
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedApp);

export default App;
