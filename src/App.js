import React, { Component } from 'react';
import { connect } from "react-redux";
import './css/styles.css';
import './App.css';
import Table, {TableColumn} from './js/components/table';
import { addContact } from "./js/actions/index";

function mapDispatchToProps(dispatch) {
  return {
      addContact: contact => dispatch(addContact(contact))
  };
}

class ConnectedApp extends Component {
  componentDidMount() {
    this.queryApi();
  }

  queryApi() {
    var config = require('./.settings.json');
    const opts = {
      "token": config.main.token,
      "data": {
        "name": "name",
        "email": "internetEmail",
        "catchPhrase": "otherCatchPhrase",
        _repeat: 10
      }
    }
    fetch('https://app.fakejson.com/q', {
      method: 'post',
      body: JSON.stringify(opts),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then((data) => {
      for (let contact in data)
      {
        this.props.addContact(data[contact]);
      }
    })
    .catch(console.log)
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
        <Table title="Contacts">
          <TableColumn field="name" />
          <TableColumn field="email" />
          <TableColumn field="catchPhrase" />
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
