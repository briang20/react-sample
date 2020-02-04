// src/js/components/table.js

import React, {Component} from 'react';
import {connect} from "react-redux";
import {addContact, removeContact, modifyContact, addSelectedItem, removeSelectedItem} from "../actions/index";
import {getContactsState, getCurrentSearchFilter, getCurrentSelectedItemList, getSortingState} from "../selectors/index";
import {sortTypes} from "../constants/sort-types"

function mapDispatchToProps(dispatch) {
    return {
        addContact: function (contact) {dispatch(addContact(contact))},
        removeContact: function (contact) {dispatch(removeContact(contact))},
        modifyContact: function (contact, newContact) {dispatch(modifyContact(contact, newContact))},
        addSelectedItem: function (item) {dispatch(addSelectedItem(item))},
        removeSelectedItem: function (item) {dispatch(removeSelectedItem(item))}
    };
}

const mapStateToProps = state => {
    return {
        contacts: getContactsState(state),
        currentSortMethod: getSortingState(state),
        currentSearchFilter: getCurrentSearchFilter(state),
        currentSelectedItems: getCurrentSelectedItemList(state)
    };
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

class ConnectedTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            editable: false,
            currentSort: 'default'
        };
        if (props.title != null) this.state.title = props.title;
        if (props.editable != null) this.state.editable = props.editable;
        this.handleCheckboxChanged = this.handleCheckboxChanged.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
    }

    handleOnClick(event) {
        const target = event.target;
        target.contentEditable = true;
    }

    handleFocusOut(event, key, data) {
        const target = event.target;
        // Before we actually apply this data, we should sanitize the input
        let newData = Object.assign({}, data);
        target.contentEditable = false;
        newData[key] = target.textContent;
        this.props.modifyContact(data, newData);
    }

    handleCheckboxChanged(event, data) {
        const target = event.currentTarget;
        const targetRow = data;
        if (target.checked === true)
            this.props.addSelectedItem(targetRow);
        else
            this.props.removeSelectedItem(targetRow);
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
                                     id={"table-cell"}>
                            <input key={keyIdx.toString()}
                                   type={"checkbox"}
                                   id={"selectRow"}
                                   name={"selection"}
                                   onChange={(event) => this.handleCheckboxChanged(event, data)} />
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

        // Filter out the contacts that we do not care about
        //TODO: figure out how to filter out the fields we don't care about
        const filteredData = [...data].filter(item => {
            if (this.props.currentSearchFilter !== '') {
                const array = Object.values(item);
                for (const element of array) {
                    if (element.toString().indexOf(this.props.currentSearchFilter) !== -1)
                        return true;
                }
                return false;
            }
            return true;
        });
        // Sort the data based on our current sorting method
        const sortedData = [...filteredData].sort(sortTypes[this.props.currentSortMethod].fn);
        return (
            <>
                {Object.keys(sortedData).map((item) => {
                    return (
                        <div key={item.toString()} id={"table-row"}>{this.renderCells(keys, sortedData[item])}</div>);
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
                <small>
                    <p className={"usa-footer"}>{this.props.contacts.length} records</p>
                </small>
                <button id={"addRow"} onClick={this.handleAddRow}>Add Row</button>
                <button id={"saveChanges"} onClick={this.handleDeleteRows}>Delete Selected Rows</button>
            </div>
        );
    }

    handleDeleteRows() {
        //TODO: maybe prompt for confirmation of the delete action?
        for (let item of this.props.currentSelectedItems) {
            this.props.removeContact(item);
        }
        //TODO: figure out why checkboxes are still checked
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