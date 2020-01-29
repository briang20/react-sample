// src/js/components/table.js

import React, { Component } from 'react';
import { connect } from "react-redux";
import { addContact } from "../actions/index";

function mapDispatchToProps(dispatch) {
    return {
        addContact: contact => dispatch(addContact(contact))
    };
  }

class TableColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: ""
        };
    }
    render() {
        return (
        <div className="usa-table">
            <h3>{this.state.label}</h3>
        </div>
        );
    }
}

class ConnectedTable extends Component {
    // state = {
    //     data: [],
    //     sortable: false
    // }
    constructor(props) {
        super(props);
        this.state = {
            title: ""
        };
    }
    render() {
        const { title } = this.state;
        return (
        <div className="usa-table">
            <h2>{title}</h2>
        </div>
        );
    }
}

const Table = connect(
    null,
    mapDispatchToProps
)(ConnectedTable);

export default Table;