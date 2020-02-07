// src/js/components/table-data.js

import React, {Component} from 'react';
import {connect} from "react-redux";
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import '../../css/table-theme.scss';
import {
    addContact,
    removeContact,
    modifyContact,
    addSelectedItem,
    removeSelectedItem,
    clearSelectedItems,
    getContacts,
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
        getContacts: function (opts) {
            dispatch(getContacts(opts))
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
            columns: [],
            currentSort: 'default'
        };
        // update internal state with our props
        if (props.columns != null) this.state.columns = props.columns;

        // bind this to the callbacks
        this.handleCheckboxChanged = this.handleCheckboxChanged.bind(this);
        this.handleAddRow = this.handleAddRow.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        this.handleTextboxChanged = this.handleTextboxChanged.bind(this);
        this.handleCheckForUpdates = this.handleCheckForUpdates.bind(this);
    }

    handleFocusOut(event, key, data) {
        const target = event.currentTarget;
        //TODO: Before we actually apply this data, we need to sanitize the input
        const oldValue = data[key.field] ? data[key.field] : '';
        if (key.readonly === true ||
            target.value === oldValue.toString()) {
            return;
        }

        let newData = Object.assign({}, data);
        newData[key.field] = target.value;
        delete newData.selected;
        this.props.modifyContact(data, newData);
        // this.props.modifyContacts(newData);
    }

    handleTextboxChanged(event, readonly) {
        const target = event.target;
        if (readonly === true)
            target.value = target.defaultValue;
    }

    handleCheckboxChanged(event, data) {
        const target = event.currentTarget;
        const targetRow = data;
        if (target.checked === true)
            this.props.addSelectedItem(targetRow);
        else
            this.props.removeSelectedItem(targetRow);
    }

    handleDeleteRows() {
        //TODO: maybe prompt for confirmation of the delete action?
        for (let item of this.props.currentSelectedItems) {
            this.props.removeContact(item);
            // this.props.deleteContacts(item);
        }
        this.props.clearSelectedItems();
    }

    handleAddRow() {
        const opts = {id: this.props.contacts.length + 1};
        this.props.addContact([opts]);
        // this.props.postContacts(opts);
    }

    handleCheckForUpdates() {
        this.props.getContacts();
    }

    renderData(columns, data) {
        return (Object.keys(columns).map((colIdx) => {
            if (columns[colIdx].type === "checkbox") {
                return (
                    <td>
                        <FormCheck data-testid={"select-row-single"}
                                   inline
                                   type={"checkbox"}
                                   label={"Selected"}
                                   checked={data.selected}
                                   onChange={(event) => this.handleCheckboxChanged(event, data)}
                        />
                    </td>
                );
            } else {
                return (
                    <td>
                        <Form.Control data-testid={columns[colIdx].field + "-input"}
                                      id={"table-input"}
                                      type="text"
                                      placeholder={columns[colIdx].field}
                                      defaultValue={data[columns[colIdx].field]}
                                      disabled={columns[colIdx].readonly}
                                      onBlur={(event) => this.handleFocusOut(event, columns[colIdx], data)}/>
                    </td>
                );
            }
        }));
    }

    // This function renders a single row of potentially sorted data.
    renderRows(columns, data) {
        // Sort the data based on our current sorting method
        const sortedData = [...data].sort(sortTypes[this.props.currentSortMethod].fn);
        return (Object.keys(sortedData).map((item) => {
            return (
                <tr key={JSON.stringify(sortedData[item])}>{this.renderData(columns, sortedData[item])}</tr>);
        }));
    }

    render() {
        // Filter out the contacts that we do not care about
        const {columns} = this.state;
        const filteredData = [...this.props.contacts].filter(item => {
            if (this.props.currentSearchFilter === '')
                return true;

            const array = Object.values(item);
            for (const element of array) {
                //TODO: figure out how to filter out the fields we don't care about
                if (element.toString().indexOf(this.props.currentSearchFilter) !== -1)
                    return true;
            }
            return false;
        });

        return (
            <tbody>
            {this.renderRows(columns, filteredData)}
            <small>
                <p className={"usa-footer"}>1-{filteredData.length} of {this.props.contacts.length}</p>
            </small>
            <ButtonToolbar aria-label="Button toolbar that modify the table">
                <ButtonGroup aria-label="Table CRUD Buttons">
                    <Button data-testid={"save-table"} variant="primary">Save Changes</Button>
                    <Button data-testid={"refresh-table"} variant="primary"
                            onClick={this.handleCheckForUpdates}>Refresh</Button>
                    <Button data-testid={"add-row"} variant="secondary" onClick={this.handleAddRow}>Add Row</Button>
                    <Button data-testid={"delete-row"} variant="secondary" onClick={this.handleDeleteRows}>Delete
                        Selected</Button>
                </ButtonGroup>
            </ButtonToolbar>
            </tbody>
        );
    }
}

const TableData = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedTable);

export default TableData;