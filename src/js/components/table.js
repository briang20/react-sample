// src/js/components/table.js

import React, {Component} from 'react';
import {connect} from "react-redux";
import '../../css/table-theme.scss';
import {
    addContact,
    removeContact,
    modifyContact,
    addSelectedItem,
    removeSelectedItem,
    clearSelectedItems,
    postContacts,
    modifyContacts,
    deleteContacts,
} from "../actions/index";
import {
    getContactsState,
    getCurrentSearchFilter,
    getCurrentSelectedItemList,
    getSelectedItemsList,
    getSortingState
} from "../selectors/index";
import {sortTypes} from "../constants/sort-types"

function mapDispatchToProps(dispatch) {
    return {
        addContact: function (contact) {
            dispatch(addContact(contact))
        },
        removeContact: function (contact) {
            dispatch(removeContact(contact))
        },
        modifyContact: function (contact, newContact) {
            dispatch(modifyContact(contact, newContact))
        },
        addSelectedItem: function (item) {
            dispatch(addSelectedItem(item))
        },
        removeSelectedItem: function (item) {
            dispatch(removeSelectedItem(item))
        },
        clearSelectedItems: function () {
            dispatch(clearSelectedItems())
        },
        postContacts: function (opts) {
            dispatch(postContacts(opts))
        },
        modifyContacts: function (opts) {
            dispatch(modifyContacts(opts))
        },
        deleteContacts: function (opts) {
            dispatch(deleteContacts(opts))
        },
    };
}

const mapStateToProps = state => {
    return {
        contacts: getContactsState(state),
        selectedItems: getSelectedItemsList(state),
        currentSortMethod: getSortingState(state),
        currentSearchFilter: getCurrentSearchFilter(state),
        currentSelectedItems: getCurrentSelectedItemList(state)
    };
};

class ConnectedTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            editable: false,
            currentSort: 'default'
        };
        // update internal state with our props
        if (props.title != null) this.state.title = props.title;
        if (props.editable != null) this.state.editable = props.editable;

        // bind this to the callbacks
        this.handleCheckboxChanged = this.handleCheckboxChanged.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        this.handleAddRow = this.handleAddRow.bind(this);
    }

    handleFocusOut(event, key, data) {
        const target = event.target;
        //TODO: Before we actually apply this data, we need to sanitize the input
        let newData = Object.assign({}, data);
        newData[key] = target.value;
        delete newData.selected;
        this.props.modifyContacts(newData);
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
        return (Object.keys(keys).map((keyIdx) => {
                let key = keys[keyIdx];
                if (key.type === "checkbox") {
                    return (<div key={JSON.stringify(data) + "_" + keyIdx.toString()}
                                 name={"selected"}
                                 id={"table-cell"}>
                        <input type={"checkbox"}
                               data-testid={"select-row-single"}
                               id={"selectRow"}
                               name={"selection"}
                               checked={data.selected}
                               onChange={(event) => this.handleCheckboxChanged(event, data)}/>
                    </div>);
                } else {
                    return (<div key={JSON.stringify(data) + "_" + keyIdx.toString()}
                                 data-testid={key.field + "-value"}
                                 id={"table-cell"}>
                        <input type={"text"}
                               data-testid={key.field + "-input"}
                               name={"field"}
                               onChange={(event) => this.handleFocusOut(event, key.field, data)}
                               value={data[key.field]}/>
                    </div>);
                }
            })
        );
    }

    // This function renders a single row of data.
    renderRows(columns, data) {
        let keys = [];
        for (let index = 0; index < React.Children.count(columns); ++index) {
            keys = keys.concat({field: columns[index].props.field, type: columns[index].props.type});
        }

        // Sort the data based on our current sorting method
        const sortedData = [...data].sort(sortTypes[this.props.currentSortMethod].fn);
        return (Object.keys(sortedData).map((item) => {
            return (
                <div key={JSON.stringify(sortedData[item])}
                     id={"table-row"}>{this.renderCells(keys, sortedData[item])}</div>);
        }));
    }

    render() {
        // Filter out the contacts that we do not care about
        //TODO: figure out how to filter out the fields we don't care about
        const filteredData = [...this.props.contacts].filter(item => {
            if (this.props.currentSearchFilter === '')
                return true;

            const array = Object.values(item);
            for (const element of array) {
                if (element.toString().indexOf(this.props.currentSearchFilter) !== -1)
                    return true;
            }
            return false;
        });

        return (
            <div key={"div-table"} className={"usa-table"} id={"table-container"}>
                <div key={"buttons"}>
                    <button id={"addRow"}
                            className={"usa-button"}
                            data-testid={"add-row"}
                            onClick={this.handleAddRow}>Add Row
                    </button>
                    <button id={"saveChanges"}
                            className={"usa-button"}
                            data-testid={"delete-row"}
                            onClick={this.handleDeleteRows}>Delete Selected Rows
                    </button>
                </div>
                <small>
                    <p className={"usa-footer"}>1-{filteredData.length} of {this.props.contacts.length}</p>
                </small>
                <div key={"div-table-heading"} id={"table-heading"}>
                    {this.props.children}
                </div>
                <div key={"div-row"} id={"table-body"}>
                    {this.renderRows(this.props.children, filteredData)}
                </div>
            </div>
        );
    }

    handleDeleteRows() {
        //TODO: maybe prompt for confirmation of the delete action?
        for (let item of this.props.currentSelectedItems) {
            //this.props.removeContact(item);
            this.props.deleteContacts(item);
        }
        this.props.clearSelectedItems();
    }

    handleAddRow() {
        //this.props.addContact([{}]);
        this.props.postContacts({id: this.props.contacts.length + 1});
    }
}

const Table = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedTable);

export default Table;