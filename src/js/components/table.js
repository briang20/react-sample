// src/js/components/table.js

import React, { Component } from 'react';
import { connect } from "react-redux";
import { addContact } from "../actions/index";
import { getContactsState } from "../selectors/index";

function mapDispatchToProps(dispatch) {
    return {
        addContact: contact => dispatch(addContact(contact))
    };
  }

  const mapStateToProps = state => {
    return { contacts: getContactsState(state) };
  };

export class TableColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            field: ""
        };
        if (props.field != null) this.state.title = this.state.field = props.field;
        if (props.title != null) this.state.title = props.title;
    }
    render() {
        const { title } = this.state;
        return (
            <div id="table-cell">{title}</div> // TODO: set this to the same style as "usa-table th"
        );
    }
}

class ConnectedTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            editible: false
        };
        if (props.title != null) this.state.title = props.title;
        if (props.editible != null) this.state.editible = props.editible;
    }
    
    renderCells(keys, data?) {
        return (
            <>
                {Object.keys(keys).map((key) => {
                    return (<div key={"cell" + key.toString()} id="table-cell" contentEditable={this.state.editible}>{data[keys[key]]}</div>);
                })}
            </>
        );
    }
    renderRows(columns, data?) {
        let keys = [];
        for (let index = 0; index < React.Children.count(columns); ++index)
        {
            let key = columns[index].props.field;
            keys = keys.concat(key);
        }
        return (
            <>
            {Object.keys(data).map((item) => {
                return (<div key={"row" + item.toString()} id="table-row">{this.renderCells(keys,data[item])}</div>);
            })}
            </>
        );
    }

    render() {
        let colCount = React.Children.count(this.props.children);
        //TODO: render the rows of data using the dynamic columns we have
        return (
            <div>
                <div className="usa-table" id="table-body">
                    <div id="table-heading">
                        {this.props.children}
                    </div>
                    <div id="table-body">
                        {this.renderRows(this.props.children, this.props.contacts)}
                    </div>
                </div>
                <p>{colCount} cols</p>
                <p>{this.props.contacts.length} records</p>
            </div>
        );
    }
}

const Table = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedTable);

export default Table;