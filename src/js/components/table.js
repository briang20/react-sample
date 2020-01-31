// src/js/components/table.js

import React, {Component} from 'react';
import {connect} from "react-redux";
import {addContact, removeContact, modifyContact} from "../actions/index";
import {getContactsState} from "../selectors/index";

function mapDispatchToProps(dispatch) {
    return {
        addContact: contact => dispatch(addContact(contact)),
        removeContact: contact => dispatch(removeContact(contact)),
        modifyContact: (contact, newContact) => dispatch(modifyContact(contact, newContact))
    };
}

const mapStateToProps = state => {
    return {contacts: getContactsState(state)};
};

function toggleCheckbox(event) {
    const target = event.currentTarget;
    const state = target.getAttribute('aria-checked');
    const image = target.getElementsByTagName('img')[0]; // Get the img to change the look

    if (event.type === 'click' ||
        (event.type === 'keydown' && event.keyCode === 32)) {
        if (state.toLowerCase() === 'true') {
            target.setAttribute('aria-checked', 'false');
            image.src = './images/checkbox-unchecked-black.png';
        } else {
            target.setAttribute('aria-checked', 'true');
            image.src = './images/checkbox-checked-black.png';
        }

        event.preventDefault();
        event.stopPropagation();
    }
}

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

    render() {
        const {title, type} = this.state;
        if (type === "checkbox") {
            return (
                <div id={"table-cell"} role={"checkbox"}
                     aria-checked={"false"}
                     aria-labelledby={"table-header"}
                     tabindex={"0"}
                     onClick={toggleCheckbox}
                     onKeyDown={this.handleOnClick}>
                    {title + " "}
                    <img src={"./images/checkbox-unchecked-black.png"} alt={""}/>
                </div>
            );
        } else {
            return (
                <div id={"table-cell"}>{title}</div> //TODO: set this to the same style as "usa-table th"
            );
        }
    }
}

class ConnectedTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            editable: false
        };
        if (props.title != null) this.state.title = props.title;
        if (props.editable != null) this.state.editable = props.editable;
    }

    handleOnClick(event) {
        const target = event.target;
        target.contentEditable = true;
    }

    handleFocusOut(event, key, data) {
        const target = event.target;
        let newData = Object.assign({}, data);
        target.contentEditable = false;
        newData[key] = target.textContent;
        this.props.modifyContact(data, newData);
    }

    // This function is here to render a single cell of a row
    renderCells(keys, data) {
        //TODO: May want to think about merging this and renderRows together
        return (
            <>
                {Object.keys(keys).map((keyIdx) => {
                    let key = keys[keyIdx];
                    if (key.type === "checkbox") {
                        return (<div key={keyIdx.toString()}
                                     name={"selected"}
                                     id={"table-cell"}
                                     role={"checkbox"}
                                     aria-checked={"false"}
                                     aria-labelledby={"table-header"}
                                     tabindex={"0"}
                                     onClick={toggleCheckbox}
                                     onKeyDown={this.handleOnClick}>
                            <img src={"./images/checkbox-unchecked-black.png"} alt={""}/>
                        </div>);
                    } else {
                        return (<div key={key.field.toString()}
                                     id={"table-cell"}
                                     contentEditable={this.state.editable}
                                     onClick={this.handleOnClick}
                                     onBlur={(event) => this.handleFocusOut(event, key.field, data)}>
                            {data[key.field]}
                        </div>);
                    }
                })}
            </>
        );
    }

    // This function renders a single row of data.
    renderRows(columns, data) {
        let keys = [];
        for (let index = 0; index < React.Children.count(columns); ++index) {
            keys = keys.concat({field: columns[index].props.field, type: columns[index].props.type});
        }
        return (
            <>
                {Object.keys(data).map((item) => {
                    return (<div key={item.toString()} id={"table-row"}>{this.renderCells(keys, data[item])}</div>);
                })}
            </>
        );
    }

    render() {
        return (
            <div>
                <div className={"usa-table"} id={"table-body"}>
                    <div id={"table-heading"}>
                        {this.props.children}
                    </div>
                    <div id={"table-body"}>
                        {this.renderRows(this.props.children, this.props.contacts)}
                    </div>
                </div>
                <p className={"usa-footer"}>{this.props.contacts.length} records</p>
                <button id={"addRow"} onClick={this.handleAddRow}>Add Row</button>
                <button id={"saveChanges"} onClick={this.handleDeleteRows}>Delete Selected Rows</button>
            </div>
        );
    }

    handleDeleteRows() {
        //TODO: get the selected rows and pass them here.
        //TODO: maybe prompt for confirmation of the delete action?
        //this.props.removeContact({});
    }

    handleAddRow() {
        //TODO: figure out how we want to actually allow the user to edit the new row before adding a new record
        //this.props.addContact({});
    }
}

const Table = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedTable);

export default Table;