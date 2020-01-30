import React, { Component } from 'react';
import './css/styles.css';
import './App.css';
import Table, {TableColumn} from './js/components/table';

class App extends Component {
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
        console.log(JSON.stringify(data[contact])); // This is temp until I hook this class up
        //this.props.addContact(data[contact]);
      }
    })
    .catch(console.log)
  }

  renderHeader() {
    return (
      <div className="usa-header">
        <h1>Some page header here</h1>
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

export default App;
