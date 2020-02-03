import React, {Component} from 'react';
import {connect} from "react-redux";
import './css/uswds-theme.scss';
import './App.css';
import Table, {TableColumn} from './js/components/table';
import {addContact} from "./js/actions/index";

function mapDispatchToProps(dispatch) {
    return {
        addContact: function(contact) {dispatch(addContact(contact))}
    };
}

class ConnectedApp extends Component {
    componentDidMount() {
        this.queryApi();
    }

    queryApi() {
        fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        })
            .then(function(res){return res.json()})
            .then((data) => { // The '=>' operator doesn't work in IE11 and I can't get the props without 'this'?
                for (let contact in data) {
                    this.props.addContact(data[contact]);
                }
            })
            .catch(console.log)

        // var config = require('./.settings.json');
        // const opts = {
        //   "token": config.main.token,
        //   "data": {
        //     "name": "name",
        //     "email": "internetEmail",
        //     "catchPhrase": "otherCatchPhrase",
        //     _repeat: 10
        //   }
        // }
        // fetch('https://app.fakejson.com/q', {
        //   method: 'post',
        //   body: JSON.stringify(opts),
        //   headers: { 'Content-Type': 'application/json' },
        // })
        // .then(res => res.json())
        // .then((data) => {
        //   for (let contact in data)
        //   {
        //     this.props.addContact(data[contact]);
        //   }
        // })
        // .catch(console.log)
    }

    renderHeader() {
        return (
            <div className="usa-header">
                <h2>Contacts Page</h2>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderHeader()}
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
