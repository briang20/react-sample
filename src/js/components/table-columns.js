import React, {Component} from 'react';
import {connect} from "react-redux";
import {addSelectedItem, changeSorting, clearSelectedItems} from "../actions/index";
import {getSortingState, getSelectedItemsList, getContactsList} from "../selectors/index";
import FormCheck from "react-bootstrap/FormCheck";

function mapDispatchToProps(dispatch) {
    return {
        changeSorting: function (sortFn) {
            dispatch(changeSorting(sortFn))
        },
        addSelectedItem: function (item) {
            dispatch(addSelectedItem(item))
        },
        clearSelectedItems: function () {
            dispatch(clearSelectedItems())
        },
    };
}

const mapStateToProps = state => {
    return {
        currentSortMethod: getSortingState(state),
        contacts: getContactsList(state),
        selectedItems: getSelectedItemsList(state),
    };
}

class ConnectedTableColumns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: []
        };
        if (props.columns != null) this.state.columns = props.columns;
        this.handleClick = this.handleClick.bind(this);
        this.handleCheckboxChanged = this.handleCheckboxChanged.bind(this);
    }

    handleClick(event, column) {
        const {ascending} = column;
        let sortType = "";
        if (ascending === false) {
            column.ascending = true;
            sortType = "asc_by_" + column.field;
        } else {
            column.ascending = false;
            sortType = "dsc_by_" + column.field;
        }

        this.props.changeSorting(sortType);
    }

    handleCheckboxChanged(event) {
        const target = event.currentTarget;
        let checked = target.checked;
        if (checked === false)
            this.props.clearSelectedItems();
        else
            for (let contact of this.props.contacts)
                this.props.addSelectedItem(contact);
    }

    renderColumn(data) {
        if (data.type === "checkbox") {
            let isAllChecked = false;
            if (this.props.contacts.length > 0)
                isAllChecked = this.props.contacts.length === this.props.selectedItems.length;

            return (
                <th>
                    <FormCheck inline
                               data-testid={"select-all-rows"}
                               id="selectAll"
                               type={"checkbox"}
                               checked={isAllChecked}
                               onChange={(event) => this.handleCheckboxChanged(event)}
                    />
                    <FormCheck.Label htmlFor="selectAll">{data.title}</FormCheck.Label>
                </th>
            );
        } else {
            return (
                <th data-testid={"column-" + data.field}
                    onClick={(event) => this.handleClick(event, data)}>{data.title}</th>
            )
        }
    }

    render() {
        const {columns} = this.state;
        return (
            <thead>
            <tr>
                {Object.keys(columns).map((column) => {
                    return this.renderColumn(columns[column])
                })}
            </tr>
            </thead>
        );
    }
}

const TableColumns = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedTableColumns);

export default TableColumns;