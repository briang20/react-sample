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
        addSelectedItem: function (item) {
            dispatch(addSelectedItem(item))
        },
        removeSelectedItem: function (item) {
            dispatch(removeSelectedItem(item))
        },
        clearSelectedItems: function () {
            dispatch(clearSelectedItems())
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
        this.handleTextboxChanged = this.handleTextboxChanged.bind(this);
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
        return (
            <tbody>
                {this.renderRows(columns, this.props.data)}
            </tbody>
        );
    }
}

const TableData = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedTable);

export default TableData;