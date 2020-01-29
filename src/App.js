import React, { Component } from 'react';
import './css/styles.css';
import './App.css';
import Table from './js/components/table';

class App extends Component {
  state = {
    contacts: []
  }

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
      this.setState({contacts: data})
    })
    .catch(console.log)
  }

  // renderHeader() {
  //   return (
  //   );
  // }

  render() {
    return (
      <div>
        <Table contacts={this.state.contacts} />
      </div>
    );
  }
}

export default App;
