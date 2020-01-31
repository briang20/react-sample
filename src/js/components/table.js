// src/js/components/table.js

import React, { Component } from 'react';
import { connect } from "react-redux";
import { addContact, removeContact, modifyContact } from "../actions/index";
import { getContactsState } from "../selectors/index";

function mapDispatchToProps(dispatch) {
    return {
        addContact: contact => dispatch(addContact(contact)),
        removeContact: contact => dispatch(removeContact(contact)),
        modifyContact: contact => dispatch(modifyContact(contact))
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
            field: "",
            type: "text"
        };
        if (props.field != null) this.state.title = this.state.field = props.field;
        if (props.title != null) this.state.title = props.title;
        if (props.type != null) this.state.type = props.type;
    }
    toggleCheckbox(event) {
        const target = event.target;
        var state = target.getAttribute('aria-checked').toLowerCase()

        if (event.type === 'click' || 
            (event.type === 'keydown' && event.keyCode === 32)) 
        {
            if (state === 'true') {
                target.setAttribute('aria-checked', 'false');
            } else {
                target.setAttribute('aria-checked', 'true');
            }

            //TODO: prop this to all of the rows

            event.preventDefault();
            event.stopPropagation();
        }
    }
    
    render() {
        const { title, type } = this.state;
        if (type === "checkbox") {
            return (
                <div id="table-cell" role="checkbox" onClick={this.toggleCheckbox} aria-checked="false" aria-labelledby="table-header" tabindex="0">
                </div>//TODO: add a image to this div to show either a empty box or checked box
            );
        } else {
            return (
                <div id="table-cell">{title}</div> // TODO: set this to the same style as "usa-table th"
            );
        }
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

    handleOnClick(event) {
        const target = event.target;
        target.contentEditable = true;
    }

    handleFocusOut(event, key, data) {
        const target = event.target;
        target.contentEditable = false;
        data[key] = target.textContent;
        this.props.modifyContact(data);
    }
    
    renderCells(keys, data?) {
        return (
            <>
                {Object.keys(keys).map((key) => {
                    return (<div key={key.toString()} 
                        id="table-cell" 
                        contentEditable={this.state.editible} 
                        onClick={this.handleOnClick}
                        onBlur={(event) => this.handleFocusOut(event, keys[key], data)}>
                            {data[keys[key]]}
                        </div>);
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
                return (<div key={item.toString()} id="table-row">{this.renderCells(keys, data[item])}</div>);
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