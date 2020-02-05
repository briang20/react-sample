import React, {Component} from 'react';
import {connect} from "react-redux";
import './css/uswds-theme.scss';
import './App.css';
import Table from './js/components/table';
import TableColumn from './js/components/table-column';
import {addContact, changeSearchFilter} from "./js/actions/index";

function mapDispatchToProps(dispatch) {
    return {
        addContact: function(contact) {dispatch(addContact(contact))},
        changeSearchFilter: function(filter) {dispatch(changeSearchFilter(filter))}
    };
}

class ConnectedApp extends Component {
    constructor(props) {
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    componentDidMount() {
        this.fetchContacts()
            .catch(console.log);
    }

    //TODO: convert this to redux-thunk
    fetchContacts() {
        var config = require('./.settings.json');
        return fetch(config.main.apiUrl ? config.main.apiUrl : 'http://jsonplaceholder.typicode.com/users', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        })
            .then(function (res) {
                return res.json()
            })
            .then((data) => { // The '=>' operator doesn't work in IE11 and I can't get the props without 'this'?
                for (let contact in data) {
                    this.props.addContact(data[contact]);
                }
            })
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
    null,
    mapDispatchToProps
)(ConnectedApp);

export default App;
