import React, { Component } from 'react';
import './css/styles.css';
import Contacts from './components/contacts'

class App extends Component {
  state = {
    contacts: []
  }

  componentDidMount() {
    var config = require('./.settings.json');
    const opts = {
      "token": config.main.token,
      "data": {
        "name": "Chris Torres",
        "email": "ctorres@somesite.com",
        "catchPhrase": "One day, it will just work...",
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

  render() {
    return (
      <Contacts contacts={this.state.contacts} />
    );
  }
}

export default App;
