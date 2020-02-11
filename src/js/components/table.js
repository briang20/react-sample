// src/js/components/table.js

import React, {Component} from 'react';
import {connect} from "react-redux";
import {
    modifyContact,
    addSelectedItem,
    removeSelectedItem,
    modifyContacts,
} from "../actions/index";
import {
    getContactsList,
    getCurrentSearchFilter,
    getCurrentSortMethod, getReplayList
} from "../selectors/index";
import {sortTypes} from "../constants/sort-types"

function mapDispatchToProps(dispatch) {
    return {
        modifyContact: function (contact, newContact) {
            dispatch(modifyContact(contact, newContact))
        },
        addSelectedItem: function (item) {
            dispatch(addSelectedItem(item))
        },
        removeSelectedItem: function (item) {
            dispatch(removeSelectedItem(item))
        },
        modifyContacts: function (opts) {
            dispatch(modifyContacts(opts))
        },
    };
}

const mapStateToProps = state => {
    return {
        contacts: getContactsList(state),
        currentSortMethod: getCurrentSortMethod(state),
        currentSearchFilter: getCurrentSearchFilter(state),
        replayBuffer: getReplayList(state)
    };
};

class ConnectedTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSort: 'default'
        };

        // bind this to the callbacks
        this.handleCheckboxChanged = this.handleCheckboxChanged.bind(this);
        this.handleTextboxChanged = this.handleTextboxChanged.bind(this);
    }

    handleFocusOut(event, key, data) {
        const target = event.target;
        //TODO: Before we actually apply this data, we need to sanitize the input
        const oldValue = data[key.field] ? data[key.field] : '';
        if (key.readonly === true ||
            target.value === oldValue.toString()) {
            return;
        }
        let payload = {id: data.id, field: key.field, value: target.value}

        let newData = null;
        const contact = this.props.replayBuffer.find(element => element.id === data.id);
        if (!contact) {
            newData = Object.assign({}, data);
            newData[key.field] = target.value;
            delete newData.selected;
        } else {
            newData[key.field] = target.value;
        }

        this.props.modifyContact(data, payload);
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

    // This function is here to render a single cell of a row
    renderCells(keys, data) {
        //TODO: May want to think about merging this and renderRows together
        return (Object.keys(keys).map((keyIdx) => {
                let key = keys[keyIdx];
                if (key.type === "checkbox") {
                    return (<div key={JSON.stringify(data) + "_" + keyIdx.toString()}
                                 name={"selected"}
                                 className={"usa-checkbox"}
                                 id={"table-cell"}>
                        <input type={"checkbox"}
                               data-testid={"select-row-single"}
                               id={"selectRow"}
                               className={"usa-checkbox__input"}
                               name={"selection"}
                               disabled={key.readonly}
                               checked={data.selected}
                               onChange={(event) => this.handleCheckboxChanged(event, data)}/>
                    </div>);
                } else {
                    return (<div key={JSON.stringify(data) + "_" + keyIdx.toString()}
                                 data-testid={key.field + "-value-" + data.id}
                                 id={"table-cell"}>
                        <input type={"text"}
                               data-testid={key.field + "-input-" + data.id}
                               name={"field"}
                               disabled={key.readonly}
                               onChange={(event) => this.handleTextboxChanged(event, key.readonly)}
                               onBlur={(event) => this.handleFocusOut(event, key, data)}
                               defaultValue={data[key.field]}/>
                    </div>);
                }
            })
        );
    }

    // This function renders a single row of data.
    renderRows(columns, data) {
        let keys = [];
        for (let index = 0; index < React.Children.count(columns); ++index) {
            keys = keys.concat({
                field: columns[index].props.field,
                type: columns[index].props.type,
                readonly: columns[index].props.readonly
            });
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
        return (
            <div key={"div-table"} className={"usa-table"} id={"table-container"}>
                <div key={"div-table-heading"} id={"table-heading"}>
                    {this.props.children}
                </div>
                <div key={"div-row"} id={"table-body"}>
                    {this.renderRows(this.props.children, this.props.data)}
                </div>
            </div>
        );
    }
}

const Table = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedTable);

export default Table;